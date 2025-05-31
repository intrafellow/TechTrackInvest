# src/services/conference_generator.py
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# Сервис для генерации технологических конференций с использованием LLM.

from __future__ import annotations

import logging
from functools import lru_cache
import random
import json
from uuid import uuid4
from deep_translator import GoogleTranslator

import torch
from transformers import pipeline, Pipeline
import regex as re

from src.models import ConferenceProfile, GenerateConferencesRequest, GenerateConferenceRequest

logger = logging.getLogger("services.conference_generator")
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

NICHES = {
    "1": "IT",
    "2": "GreenTech",
    "3": "MedTech",
    "4": "SpaceTech"
}

# ---------------------------------------------------------------------------
# Helper functions
# ---------------------------------------------------------------------------

def is_russian_text(text: str) -> bool:
    russian_chars = sum(1 for c in text if ord('а') <= ord(c.lower()) <= ord('я'))
    total_chars = sum(1 for c in text if c.isalpha())
    if total_chars == 0:
        return False
    return (russian_chars / total_chars) > 0.7

def clean_text(text: str) -> str:
    allowed_punctuation = '.,!?;:()[]{}«»""-–— '
    cleaned = ''.join(c for c in text if (
        ord('а') <= ord(c.lower()) <= ord('я') or
        c.isdigit() or
        c in allowed_punctuation
    ))
    return ' '.join(cleaned.split())

def translate_to_russian(text: str) -> str:
    try:
        if is_russian_text(text):
            return text
        sentences = text.split('.')
        translated_sentences = []
        translator = GoogleTranslator(source='auto', target='ru')
        for sentence in sentences:
            if sentence.strip():
                try:
                    translated = translator.translate(sentence.strip())
                    translated_sentences.append(translated)
                except Exception as e:
                    logger.error(f"Ошибка при переводе предложения: {e}")
                    translated_sentences.append(sentence.strip())
        result = '. '.join(translated_sentences)
        if result and not result.endswith('.'):
            result += '.'
        return result
    except Exception as e:
        logger.error(f"Ошибка при переводе: {e}")
        return text

def extract_json_from_response(response: str) -> dict | None:
    """Извлекает JSON-блок из строки и удаляет висячие запятые."""
    # Находим первый полный JSON-блок
    start = response.find("{")
    if start == -1:
        return None
        
    # Ищем парную закрывающую скобку
    stack = 1
    pos = start + 1
    while stack > 0 and pos < len(response):
        if response[pos] == "{":
            stack += 1
        elif response[pos] == "}":
            stack -= 1
        pos += 1
        
    if stack != 0:
        logger.error("Незавершенный JSON-блок")
        return None
        
    json_str = response[start:pos]
    
    # Удаляем незавершенные поля (содержащие переносы строк)
    json_str = re.sub(r',\s*"[^"]+"\s*:\s*"[^"]*$', '', json_str)
    json_str = re.sub(r',\s*"[^"]+"\s*:\s*\{[^}]*$', '', json_str)
    
    # Удаляем запятые перед закрывающими скобками
    cleaned_json = re.sub(r",(\s*[}\]])", r"\1", json_str)
    
    try:
        data = json.loads(cleaned_json)
        
        # Преобразуем числовые идентификаторы ниш в текстовые названия
        if "nicheId" in data:
            niche_id = str(data["nicheId"])
            if niche_id in NICHES:
                data["nicheId"] = NICHES[niche_id]
        
        if "expertise" in data and isinstance(data["expertise"], list):
            for item in data["expertise"]:
                if "nicheId" in item:
                    niche_id = str(item["nicheId"])
                    if niche_id in NICHES:
                        item["nicheId"] = NICHES[niche_id]
        
        return data
    except json.JSONDecodeError as e:
        logger.error(f"Ошибка парсинга JSON: {e}")
        logger.error("Проблемный блок:")
        logger.error(cleaned_json)
        return None

# ---------------------------------------------------------------------------
# LLM initialisation (lazy singleton)
# ---------------------------------------------------------------------------

_MODEL_NAME = "Qwen/Qwen2.5-0.5B-Instruct"

@lru_cache(maxsize=1)
def _get_generator() -> Pipeline:
    logger.info("Loading LLM: %s", _MODEL_NAME)
    return pipeline(
        "text-generation",
        model=_MODEL_NAME,
        device_map="cpu",
        torch_dtype=torch.float32,
    )

def warmup() -> None:
    _get_generator()

# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def generate_conference(request: GenerateConferenceRequest) -> ConferenceProfile:
    pipe = _get_generator()
    niche_name = random.choice(list(NICHES.values()))

    prompt = (
        "Привет! Ты — опытный сценарист-аналитик, моделирующий реалистичные и увлекательные технологические конференции. "
        "Ты отлично понимаешь, как выглядят настоящие мероприятия, полезные для стартапов, — с интересными названиями, "
        "живыми описаниями и адекватной пользой для участников.\n\n"
        "Сгенерируй профиль технологической конференции в формате JSON. ВАЖНО: все поля обязательны!\n\n"
        "Поля JSON:\n"
        "- name: УНИКАЛЬНОЕ название конференции на английском языке. Название должно:\n"
        "  * Быть креативным и запоминающимся\n"
        "  * Отражать специфику ниши {niche_name}\n"
        "  * Использовать современную техническую терминологию\n"
        "  * Быть коротким (2-4 слова)\n"
        "  * НЕ использовать простые комбинации вида 'Niche Conference' или 'Niche Summit'\n"
        "  * НЕ использовать шаблонные названия\n"
        "  * НЕ использовать названия из примеров\n"
        "- description: Оригинальное описание конференции на русском языке\n"
        "- nicheId: Должно быть \"{niche_name}\"\n"
        "- enrollPrice: ОБЯЗАТЕЛЬНО Целое число от 1000 до 9000\n"
        "- gainedReputation: Целое число от 1 до 10\n"
        "- expertise: Массив с одним объектом, содержащим:\n"
        "  * nicheId (КЛЮЧ ДОЛЖЕН НАЗЫВАТЬСЯ nicheId, И НИКАК ИНАЧЕ): Должно быть \"{niche_name}\"\n"
        "  * change: Целое число от 1 до 10\n\n"
        "КРИТИЧЕСКИ ВАЖНО:\n"
        "1) Все поля обязательны, нельзя пропускать ни одного поля\n"
        "2) Все числовые поля должны быть простыми целыми числами\n"
        "3) Поле name должно быть на английском языке\n"
        "4) Поле description ОБЯЗАТЕЛЬНО должно быть на русском языке\n"
        "5) Используйте ТОЛЬКО кириллицу для русских текстов\n"
        "6) Проверьте, что все поля присутствуют в JSON перед отправкой\n"
        "7) Поле nicheId должно быть СТРОГО равно \"{niche_name}\"\n"
        "8) Все текстовые поля должны соответствовать нише {niche_name}\n"
        "9) В поле description ЗАПРЕЩЕНО использовать английский язык\n"
        "10) В поле description ОБЯЗАТЕЛЬНО используйте ТОЛЬКО русский язык\n"
        "11) В поле description НЕДОПУСТИМО использовать латинские буквы\n"
        "12) В поле description ЗАПРЕЩЕНО использовать иероглифы и другие не-кириллические символы\n"
        "13) В поле description ДОПУСТИМЫ ТОЛЬКО русские буквы, цифры и знаки препинания\n"
        "14) В поле description НЕДОПУСТИМО использовать транслитерацию\n"
        "15) Массив expertise ОБЯЗАТЕЛЬНО должен содержать ровно один объект\n"
        "16) В объекте expertise поле nicheId должно быть СТРОГО равно \"{niche_name}\"\n"
        "17) В объекте expertise поле change должно быть целым числом от 1 до 10\n"
        "18) enrollPrice ОБЯЗАНО быть целым числом от 1000 до 9000\n"
        "19) НЕДОПУСТИМО генерировать неполный JSON\n"
        "20) НЕДОПУСТИМО пропускать какие-либо поля\n"
        "21) НЕДОПУСТИМО генерировать JSON без поля expertise\n"
        "22) НЕДОПУСТИМО генерировать JSON с пустым массивом expertise\n"
        "23) НЕДОПУСТИМО генерировать JSON с неполным объектом в expertise\n\n"
        "JSON:"
    ).format(niche_name=niche_name)

    for attempt in range(3):
        try:
            response = pipe(prompt, max_new_tokens=500, do_sample=True, temperature=0.8)[0]["generated_text"]
            
            data = extract_json_from_response(response)
            if not data:
                logger.warning("Не удалось извлечь JSON из ответа")
                logger.warning("Генерируем новый JSON...")
                continue
                
            print("\n=== Сырой JSON ===")
            print(response)
            print("\n=== Распарсенный JSON ===")
            print(json.dumps(data, ensure_ascii=False, indent=2))

            if len(data) == 1 and isinstance(next(iter(data.values())), dict):
                data = next(iter(data.values()))

            required_fields = ["name", "description", "nicheId", "enrollPrice", "gainedReputation", "expertise"]
            missing_fields = [field for field in required_fields if field not in data]
            if missing_fields:
                logger.warning(f"Отсутствуют обязательные поля: {missing_fields}")
                logger.warning("Генерируем новый JSON...")
                continue

            if data["nicheId"] != niche_name:
                logger.warning(f"Несоответствие nicheId: получено '{data['nicheId']}', ожидалось '{niche_name}'")
                logger.warning("Генерируем новый JSON...")
                continue

            if not isinstance(data["enrollPrice"], int) or not (1000 <= data["enrollPrice"] <= 9000):
                logger.warning("Неверный enrollPrice")
                logger.warning("Генерируем новый JSON...")
                continue

            if not isinstance(data["gainedReputation"], int) or not (1 <= data["gainedReputation"] <= 10):
                logger.warning("Неверный gainedReputation")
                logger.warning("Генерируем новый JSON...")
                continue

            if not isinstance(data["expertise"], list) or not data["expertise"]:
                logger.warning("expertise пуст или не список")
                logger.warning("Генерируем новый JSON...")
                continue

            expertise = data["expertise"]
            if len(expertise) != 1:
                logger.warning("expertise должен содержать ровно один элемент")
                logger.warning("Генерируем новый JSON...")
                continue

            expertise_item = expertise[0]
            if not isinstance(expertise_item, dict):
                logger.warning("элемент expertise должен быть объектом")
                logger.warning("Генерируем новый JSON...")
                continue

            if "nicheId" not in expertise_item or "change" not in expertise_item:
                logger.warning("элемент expertise должен содержать поля nicheId и change")
                logger.warning("Генерируем новый JSON...")
                continue

            if expertise_item["nicheId"] != niche_name:
                logger.warning("nicheId в expertise не соответствует требуемому")
                logger.warning("Генерируем новый JSON...")
                continue

            if not isinstance(expertise_item["change"], int) or not (1 <= expertise_item["change"] <= 10):
                logger.warning("change в expertise должен быть числом от 1 до 10")
                logger.warning("Генерируем новый JSON...")
                continue

            if not is_russian_text(data["description"]):
                data["description"] = translate_to_russian(data["description"])
            data["description"] = clean_text(data["description"])

            return ConferenceProfile(**data)

        except Exception as e:
            logger.error(f"Ошибка генерации конференции (попытка {attempt + 1}): {e}")
            continue

    raise ValueError("Не удалось сгенерировать корректный профиль конференции после 3 попыток")

def generate_conferences(request: GenerateConferencesRequest) -> list[ConferenceProfile]:
    niches = list(NICHES.values()) if request.niches is None else request.niches
    results = []
    for _ in range(request.count):
        try:
            conference = generate_conference(request)
            results.append(conference)
        except Exception as e:
            logger.error(f"Ошибка при генерации конференции: {e}")
            continue
    if not results:
        raise ValueError("Не удалось сгенерировать ни одного корректного профиля конференции")
    return results

def test_generate_it_conferences():
    """Тестовая генерация 3-х IT конференций."""
    print("\n=== Начинаем генерацию 3-х IT конференций ===")
    results = []
    
    for i in range(3):
        print(f"\nГенерация конференции {i+1}/3...")
        try:
            # Создаем запрос с явным указанием ниши IT
            request = GenerateConferenceRequest(niche="IT")
            conference = generate_conference(request)
            results.append(conference)
            print(f"\nУспешно сгенерирована конференция {i+1}:")
            print(json.dumps(conference.dict(), ensure_ascii=False, indent=2))
        except Exception as e:
            print(f"Ошибка при генерации конференции {i+1}: {e}")
            i -= 1  # Повторяем попытку
            continue
    
    print("\n=== Результаты генерации ===")
    for i, conf in enumerate(results, 1):
        print(f"\nКонференция {i}:")
        print(json.dumps(conf.dict(), ensure_ascii=False, indent=2))
    
    return results

if __name__ == "__main__":
    print("Начинаем генерацию конференции...")
    try:
        # Тестовая генерация 3-х IT конференций
        test_generate_it_conferences()
    except Exception as e:
        print(f"Ошибка: {e}")