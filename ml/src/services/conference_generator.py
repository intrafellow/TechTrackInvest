"""src/services/conference_generator.py
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Сервис для генерации технологических конференций с использованием LLM.
"""
from __future__ import annotations

import logging
from functools import lru_cache
import random
import json
from uuid import uuid4
from deep_translator import GoogleTranslator
import re

import torch
from transformers import pipeline, Pipeline

from src.models import ConferenceProfile, GenerateConferencesRequest, GenerateConferenceRequest

logger = logging.getLogger("services.conference_generator")

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

NICHES = {
    "1": "IT",
    "2": "GreenTech",
    "3": "MedTech",
    "4": "SpaceTech"
}

# Кэш для хранения уже сгенерированных названий
_generated_names = set()

def _is_name_unique(name: str) -> bool:
    """Проверяет, не было ли уже сгенерировано такое название."""
    if name in _generated_names:
        return False
    _generated_names.add(name)
    return True

def _clear_name_cache():
    """Очищает кэш сгенерированных названий."""
    _generated_names.clear()

# ---------------------------------------------------------------------------
# Helper functions
# ---------------------------------------------------------------------------

def is_russian_text(text: str) -> bool:
    """Проверяет, является ли текст преимущественно русским."""
    # Подсчитываем количество русских букв
    russian_chars = sum(1 for c in text if ord('а') <= ord(c.lower()) <= ord('я'))
    # Подсчитываем общее количество букв
    total_chars = sum(1 for c in text if c.isalpha())
    # Если нет букв вообще, считаем что это не текст
    if total_chars == 0:
        return False
    # Если более 70% букв - русские, считаем что текст на русском
    return (russian_chars / total_chars) > 0.7

def clean_text(text: str) -> str:
    """Очищает текст от нежелательных символов."""
    # Разрешенные знаки препинания
    allowed_punctuation = '.,!?;:()[]{}«»""-–— '
    
    # Оставляем только русские буквы, цифры и разрешенные знаки препинания
    cleaned = ''.join(c for c in text if (
        ord('а') <= ord(c.lower()) <= ord('я') or  # русские буквы
        c.isdigit() or  # цифры
        c in allowed_punctuation  # разрешенные знаки препинания
    ))
    
    # Убираем множественные пробелы
    cleaned = ' '.join(cleaned.split())
    
    return cleaned

def translate_to_russian(text: str) -> str:
    """Переводит текст на русский язык используя Google Translate."""
    try:
        # Если текст уже преимущественно на русском, возвращаем его как есть
        if is_russian_text(text):
            return text
            
        # Разбиваем текст на предложения для лучшего перевода
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
        
        # Собираем текст обратно
        result = '. '.join(translated_sentences)
        if result and not result.endswith('.'):
            result += '.'
            
        return result
    except Exception as e:
        logger.error(f"Ошибка при переводе: {e}")
        return text

# ---------------------------------------------------------------------------
# LLM initialisation (lazy singleton)
# ---------------------------------------------------------------------------

_MODEL_NAME = "Qwen/Qwen2.5-0.5B-Instruct"

@lru_cache(maxsize=1)
def _get_generator() -> Pipeline:
    """Загрузить text‑generation pipeline один раз за процесс."""
    logger.info("Loading LLM: %s", _MODEL_NAME)
    return pipeline(
        "text-generation",
        model=_MODEL_NAME,
        device_map="cpu",
        torch_dtype=torch.float32,
    )

def warmup() -> None:
    """Форсированная инициализация LLM при старте FastAPI."""
    _get_generator()

# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def _fix_enroll_price(data: dict) -> dict:
    """Исправляет значение enrollPrice, если оно некорректное."""
    if not isinstance(data["enrollPrice"], int) or not (1000 <= data["enrollPrice"] <= 9000):
        # Генерируем случайное значение в допустимом диапазоне
        data["enrollPrice"] = random.randint(1000, 9000)
    return data

def generate_conference(request: GenerateConferenceRequest) -> ConferenceProfile:
    """Генерирует технологическую конференцию.
    
    Args:
        request: Параметры запроса на генерацию конференции.
            niche: Ниша для генерации конференции ("IT", "GreenTech", "MedTech", "SpaceTech").
                  Если не указана, выбирается случайная ниша.
    
    Returns:
        ConferenceProfile: Сгенерированный профиль конференции.
    """
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
		"24) НЕДОПУСТИМО генерировать JSON с ключом id, nicenId и тд, КЛЮЧ ОБЯЗАН НАЗЫВАТЬСЯ nicheId\n"
		"25) НЕДОПУСТИМО генерировать JSON с масиивом expertise, в котором нет либо nicheIde, либо change\n"
        "JSON:"
    ).format(niche_name=niche_name)
    
    for attempt in range(3):  # Максимум 3 попытки
        try:
            response = pipe(prompt, max_new_tokens=500, do_sample=True, temperature=0.8)[0]["generated_text"]
            
            # Логируем сырой ответ от модели
            logger.info("Сырой ответ от модели:")
            logger.info(response)
            
            # Ищем JSON в ответе
            start = response.find("{")
            if start == -1:
                logger.warning("JSON не найден в ответе")
                continue
                
            # Ищем конец первого JSON объекта
            end = start + 1
            brace_count = 1
            while brace_count > 0 and end < len(response):
                if response[end] == "{":
                    brace_count += 1
                elif response[end] == "}":
                    brace_count -= 1
                end += 1
                
            if brace_count > 0:
                logger.warning("Неполный JSON в ответе")
                continue
                
            json_str = response[start:end]
            
            # Логируем извлеченный JSON
            logger.info("Извлеченный JSON:")
            logger.info(json_str)
            
            # Удаляем незавершенные поля (содержащие переносы строк)
            json_str = re.sub(r',\s*"[^"]+"\s*:\s*"[^"]*$', '', json_str)
            json_str = re.sub(r',\s*"[^"]+"\s*:\s*\{[^}]*$', '', json_str)
            
            # Удаляем запятые перед закрывающими скобками
            json_str = re.sub(r",(\s*[}\]])", r"\1", json_str)
            
            try:
                data = json.loads(json_str)
                # Логируем распарсенный JSON
                logger.info("Распарсенный JSON:")
                logger.info(json.dumps(data, ensure_ascii=False, indent=2))
            except json.JSONDecodeError as e:
                logger.error(f"Ошибка парсинга JSON: {e}")
                logger.error("Проблемный блок:")
                logger.error(json_str)
                continue
            
            # Если JSON вложенный, извлекаем внутренний объект
            if len(data) == 1 and isinstance(next(iter(data.values())), dict):
                data = next(iter(data.values()))
            
            # Проверяем наличие всех обязательных полей
            required_fields = [
                "name", "description", "nicheId", "enrollPrice",
                "gainedReputation", "expertise"
            ]
            missing_fields = [field for field in required_fields if field not in data]
            if missing_fields:
                logger.warning(f"Отсутствуют обязательные поля: {missing_fields}")
                logger.warning("Текущий JSON:")
                logger.warning(json.dumps(data, ensure_ascii=False, indent=2))
                logger.warning("Генерируем новый JSON...")
                continue
                
            # Проверяем значение nicheId
            if data["nicheId"] != niche_name:
                logger.warning(f"Несоответствие nicheId: получено '{data['nicheId']}', ожидалось '{niche_name}'")
                logger.warning("Текущий JSON:")
                logger.warning(json.dumps(data, ensure_ascii=False, indent=2))
                logger.warning("Генерируем новый JSON...")
                continue
                
            # Проверяем значение enrollPrice
            if not isinstance(data["enrollPrice"], int) or not (1000 <= data["enrollPrice"] <= 9000):
                logger.warning(f"Недопустимое значение enrollPrice: {data['enrollPrice']}")
                data = _fix_enroll_price(data)
                logger.info(f"Исправлено значение enrollPrice на: {data['enrollPrice']}")
                
            # Проверяем значение gainedReputation
            if not isinstance(data["gainedReputation"], int) or not (1 <= data["gainedReputation"] <= 10):
                logger.warning(f"Недопустимое значение gainedReputation: {data['gainedReputation']}")
                logger.warning("Текущий JSON:")
                logger.warning(json.dumps(data, ensure_ascii=False, indent=2))
                logger.warning("Генерируем новый JSON...")
                continue
                
            # Проверяем expertise
            if not isinstance(data["expertise"], list) or not data["expertise"]:
                logger.warning("expertise пуст или не список")
                logger.warning("Текущий JSON:")
                logger.warning(json.dumps(data, ensure_ascii=False, indent=2))
                logger.warning("Генерируем новый JSON...")
                continue
                
            expertise = data["expertise"]
            if len(expertise) != 1:
                logger.warning("expertise должен содержать ровно один элемент")
                logger.warning("Текущий JSON:")
                logger.warning(json.dumps(data, ensure_ascii=False, indent=2))
                logger.warning("Генерируем новый JSON...")
                continue
                
            expertise_item = expertise[0]
            if not isinstance(expertise_item, dict):
                logger.warning("элемент expertise должен быть объектом")
                logger.warning("Текущий JSON:")
                logger.warning(json.dumps(data, ensure_ascii=False, indent=2))
                logger.warning("Генерируем новый JSON...")
                continue
                
            if "nicheId" not in expertise_item or "change" not in expertise_item:
                logger.warning("элемент expertise должен содержать поля nicheId и change")
                logger.warning("Текущий JSON:")
                logger.warning(json.dumps(data, ensure_ascii=False, indent=2))
                logger.warning("Генерируем новый JSON...")
                continue
                
            if expertise_item["nicheId"] != niche_name:
                logger.warning(f"Несоответствие nicheId в expertise: получено '{expertise_item['nicheId']}', ожидалось '{niche_name}'")
                logger.warning("Генерируем новый JSON...")
                continue
                
            if not isinstance(expertise_item["change"], int) or not (1 <= expertise_item["change"] <= 10):
                logger.warning("change в expertise должен быть числом от 1 до 10")
                logger.warning("Генерируем новый JSON...")
                continue

            # Проверяем уникальность названия
            if not _is_name_unique(data["name"]):
                logger.warning(f"Название '{data['name']}' уже было сгенерировано ранее")
                logger.warning("Генерируем новый JSON...")
                continue

            # Проверяем и переводим description если нужно
            if not is_russian_text(data["description"]):
                logger.info("Переводим поле description на русский язык...")
                original_description = data["description"]
                data["description"] = translate_to_russian(data["description"])
                if not is_russian_text(data["description"]):
                    logger.warning("Не удалось перевести description на русский язык")
                    logger.warning(f"Оригинальный текст: {original_description}")
                    logger.warning(f"Переведенный текст: {data['description']}")
                    continue
            # Очищаем текст от нежелательных символов
            data["description"] = clean_text(data["description"])
            
            # Проверяем соответствие тематике для каждой ниши
            niche_keywords = {
                "IT": ["технология", "программирование", "разработка", "софт", "аппарат", "информация", "данные", "система", "интернет", "цифровой", "компьютер", "сеть", "безопасность", "искусственный интеллект", "машинное обучение"],
                "GreenTech": ["экология", "зеленый", "устойчивый", "возобновляемый", "энергия", "природа", "окружающая среда", "климат", "чистый", "энергоэффективность", "переработка", "отходы", "био", "экологичный"],
                "MedTech": ["медицина", "здоровье", "диагностика", "лечение", "пациент", "врач", "клиника", "анализ", "исследование", "терапия", "профилактика", "реабилитация", "биомедицина", "генетика"],
                "SpaceTech": ["космос", "спутник", "орбита", "ракета", "космический", "астрономия", "галактика", "звезда", "планета", "навигация", "данные", "технология", "исследование", "анализ"]
            }
            
            if niche_name in niche_keywords:
                keywords = niche_keywords[niche_name]
                if not any(keyword in data["description"].lower() for keyword in keywords):
                    logger.warning(f"Предупреждение: описание может не полностью соответствовать нише {niche_name}, но продолжаем...")
            
            # Сортируем ключи в нужном порядке
            data = _sort_json_keys(data)
            
            # Добавляем пустой id
            data["id"] = ""
            
            return ConferenceProfile(**data)
            
        except Exception as e:
            logger.error(f"Ошибка при генерации конференции (попытка {attempt + 1}): {e}")
            continue
            
    raise ValueError("Не удалось сгенерировать корректный профиль конференции после 3 попыток")

def generate_conferences(request: GenerateConferencesRequest) -> list[ConferenceProfile]:
    """Генерирует несколько профилей конференций.
    
    Args:
        request: Параметры запроса на генерацию конференций.
    
    Returns:
        list[ConferenceProfile]: Список сгенерированных профилей конференций.
    """
    results = []
    for _ in range(request.quantity):
        try:
            conference = generate_conference(GenerateConferenceRequest(niche=request.niche))
            results.append(conference)
        except Exception as e:
            logger.error(f"Ошибка при генерации конференции для ниши {request.niche}: {e}")
            continue
            
    if not results:
        raise ValueError("Не удалось сгенерировать ни одного корректного профиля конференции")
        
    return results 