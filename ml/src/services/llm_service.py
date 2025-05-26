"""src/services/llm_service.py
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Обёртка над HuggingFace `pipeline` для модели **Qwen/Qwen2.5‑0.5B‑Instruct**.

Публичные функции
-----------------
* `warmup()` – форсированная загрузка модели при старте API.
* `generate_startup()` – генерация профиля стартапа
* `generate_crisis()` – генерация кризисной ситуации
* `generate_conference()` – генерация конференции
"""
from __future__ import annotations

import logging
from functools import lru_cache
import random
from uuid import uuid4
import json
from deep_translator import GoogleTranslator

import torch
from transformers import pipeline, Pipeline

from src.models import (
    SYSTEM_PROMPT_BASE,
    StartupProfile,
    CrisisProfile,
    ConferenceProfile,
    Stage,
    CrisisType,
)

from src.services.startup_generator import generate_startup
from src.services.crisis_generator import generate_crisis
from src.services.conference_generator import generate_conference

logger = logging.getLogger("services.llm")

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

NICHES = {
    "1": "IT",
    "2": "GreenTech",
    "3": "MedTech",
    "4": "SpaceTech"
}

NICHE_EXAMPLES = {
    "IT": {
		"id": "startup-IT-23",
        "name": "CloudTech Solutions",
        "description": "Платформа для управления облачной инфраструктурой",
        "offer": "Система автоматизации и оптимизации облачных вычислений",
        "price": 1500000,
        "lastMonthRevenue": 250000,
        "expenses": 120000,
        "team": 15,
        "budget": 3000000,
        "product": 85,
        "reputation": 75,
        "level": 3,
        "stage": "MARKET",
		"niche": "IT"
    },
    "GreenTech": {
		"id": "startup-GreenTech-22",
        "name": "EcoTech Innovations",
        "description": "Система мониторинга экологических показателей",
        "offer": "Комплексное решение для управления экологическими проектами",
        "price": 2000000,
        "lastMonthRevenue": 180000,
        "expenses": 150000,
        "team": 12,
        "budget": 2500000,
        "product": 70,
        "reputation": 80,
        "level": 2,
        "stage": "MVP",
		"niche": "GreenTech"
    },
    "MedTech": {
		"id": "startup-MedTech-54",
        "name": "HealthTech Systems",
        "description": "Платформа для телемедицинских консультаций",
        "offer": "Система удаленного мониторинга состояния здоровья",
        "price": 3000000,
        "lastMonthRevenue": 400000,
        "expenses": 200000,
        "team": 20,
        "budget": 5000000,
        "product": 90,
        "reputation": 85,
        "level": 4,
        "stage": "SCALE",
		"niche": "MedTech"

    },
    "SpaceTech": {
		"id": "startup-SpaceTech-46",
        "name": "OrbitTech Solutions",
        "description": "Система управления спутниковыми данными",
        "offer": "Платформа для анализа космических данных",
        "price": 5000000,
        "lastMonthRevenue": 600000,
        "expenses": 300000,
        "team": 25,
        "budget": 8000000,
        "product": 75,
        "reputation": 70,
        "level": 3,
        "stage": "MARKET",
		"niche": "SpaceTech"
    }
}

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

def _sort_json_keys(data: dict) -> dict:
    """Сортирует ключи JSON в нужном порядке."""
    key_order = [
        "_id",
        "name",
        "description",
        "price",
        "uniqueProductOffer",
        "lastMonthRevenue",
        "expenses",
        "team",
        "budget",
        "product",
        "reputation",
        "level",
        "stage",
        "niche"
    ]
    return {k: data[k] for k in key_order if k in data}

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
# Public API: Content Generation
# ---------------------------------------------------------------------------

def generate_startup() -> StartupProfile:
    """Генерирует профиль стартапа."""
    pipe = _get_generator()
    
    # Выбираем случайную нишу
    niche_id = random.choice(list(NICHES.keys()))
    niche_name = NICHES[niche_id]
    startup_number = random.randint(1, 100)
    
    # Получаем список допустимых значений для stage
    valid_stages = [stage.value for stage in Stage]
    
    prompt = (
        "Привет! Ты - Опытнейший и очень успешный фаундер стартапов, все твои идеи обречены на успех, "
        "если не случится что-то крайне глобальное и непредвиденное событие, или даже их череда. "
        "Твоя задача:\n"
        "1) Генерировать реалистичные профили стартапов из наших ниш\n"
        "2) Создавать интересные кризисные ситуации с возможными решениями\n"
        "3) Придумывать технологические конференции с балансными наградами\n"
        "4) Убедиться, что все числовые значения реалистичны и сбалансированы\n"
        "5) Генерировать данные в строго заданном JSON формате\n"
        "6) Создавать уникальные и интересные описания\n\n"
        "Сгенерируй профиль технологического стартапа в формате JSON. ВАЖНО: все поля обязательны!\n"
        "Поля JSON:\n"
        "- _id: уникальный идентификатор в формате 'startup-{niche_name}-{number}'\n"
        "- name: название стартапа на английском языке, соответствующее нише {niche_name}\n"
        "- description: краткое описание на русском языке, соответствующее нише {niche_name}\n"
        "- price: стоимость в рублях (целое число)\n"
        "- uniqueProductOffer: уникальное торговое предложение на русском языке, соответствующее нише {niche_name}\n"
        "- lastMonthRevenue: доход за последний месяц (целое число)\n"
        "- expenses: общая сумма ежемесячных расходов (целое число)\n"
        "- team: общее количество сотрудников (целое число)\n"
        "- budget: текущий бюджет (целое число)\n"
        "- product: готовность продукта (целое число от 0 до 100)\n"
        "- reputation: репутация (целое число от 0 до 100)\n"
        "- level: уровень (целое число от 1 до 5)\n"
        "- stage: стадия (строго одно из значений: {valid_stages})\n"
        "- niche: ниша рынка (должна быть СТРОГО {niche_name}, другие ниши НЕДОПУСТИМЫ)\n\n"
        "КРИТИЧЕСКИ ВАЖНО:\n"
        "1) Все поля обязательны, нельзя пропускать ни одного поля\n"
        "2) Все числовые поля должны быть простыми целыми числами, без вложенных объектов или массивов\n"
        "3) Поле name должно быть на английском языке и соответствовать нише {niche_name}\n"
        "4) Поля description и uniqueProductOffer ОБЯЗАТЕЛЬНО должны быть на русском языке и соответствовать нише {niche_name}\n"
        "5) Используйте ТОЛЬКО кириллицу для русских текстов\n"
        "6) Проверьте, что все поля присутствуют в JSON перед отправкой\n"
        "7) Поле stage должно быть строго одним из значений: {valid_stages}\n"
        "8) Все текстовые поля должны соответствовать нише {niche_name}\n"
        "9) Поле niche должно быть СТРОГО равно '{niche_name}', другие ниши НЕДОПУСТИМЫ\n"
        "10) Поле _id должно начинаться с 'startup-{niche_name}-'\n"
        "11) НЕ используйте английский язык в полях description и uniqueProductOffer\n"
        "12) НЕ копируйте примеры из NICHE_EXAMPLES, создавайте уникальный контент\n"
        "13) НЕ используйте другие ниши кроме {niche_name}\n"
        "14) Создавайте АБСОЛЮТНО УНИКАЛЬНЫЙ контент, не используйте примеры как шаблон\n"
        "15) В полях description и uniqueProductOffer ЗАПРЕЩЕНО использовать английский язык\n"
        "16) В полях description и uniqueProductOffer ОБЯЗАТЕЛЬНО используйте ТОЛЬКО русский язык\n"
        "17) В полях description и uniqueProductOffer НЕДОПУСТИМО использовать латинские буквы\n"
        "18) В полях description и uniqueProductOffer ЗАПРЕЩЕНО использовать иероглифы и другие не-кириллические символы\n"
        "19) В полях description и uniqueProductOffer ДОПУСТИМЫ ТОЛЬКО русские буквы, цифры и знаки препинания\n"
        "20) В полях description и uniqueProductOffer НЕДОПУСТИМО использовать транслитерацию\n\n"
        "Примеры для ниши {niche_name} (НЕ КОПИРУЙТЕ ИХ, они только для понимания формата):\n"
        "- name: {examples[name]}\n"
        "- description: {examples[description]}\n"
        "- uniqueProductOffer: {examples[offer]}\n"
        "- price: {examples[price]}\n"
        "- lastMonthRevenue: {examples[lastMonthRevenue]}\n"
        "- expenses: {examples[expenses]}\n"
        "- team: {examples[team]}\n"
        "- budget: {examples[budget]}\n"
        "- product: {examples[product]}\n"
        "- reputation: {examples[reputation]}\n"
        "- level: {examples[level]}\n"
        "- stage: {examples[stage]}\n"
        "- niche: {niche_name}\n"
        "JSON:"
    ).format(
        niche_name=niche_name,
        number=startup_number,
        valid_stages=", ".join(valid_stages),
        examples=NICHE_EXAMPLES[niche_name]
    )
    
    for attempt in range(3):  # Максимум 3 попытки
        try:
            response = pipe(prompt, max_new_tokens=500, do_sample=True, temperature=0.7)[0]["generated_text"]
            
            # Ищем JSON в ответе
            start = response.find("{")
            if start == -1:
                continue
                
            end = response.rfind("}") + 1
            if end == 0:
                continue
                
            json_str = response[start:end]
            data = json.loads(json_str)
            
            # Если JSON вложенный, извлекаем внутренний объект
            if len(data) == 1 and isinstance(next(iter(data.values())), dict):
                data = next(iter(data.values()))
            
            # Проверяем наличие всех обязательных полей
            required_fields = [
                "_id", "name", "description", "price", "uniqueProductOffer",
                "lastMonthRevenue", "expenses", "team", "budget", "product",
                "reputation", "level", "stage", "niche"
            ]
            missing_fields = [field for field in required_fields if field not in data]
            if missing_fields:
                logger.warning(f"Отсутствуют обязательные поля: {missing_fields}")
                continue
                
            # Проверяем значение stage
            if data["stage"].upper() not in valid_stages:
                logger.warning(f"Недопустимое значение stage: {data['stage']}")
                continue
            data["stage"] = data["stage"].upper()
                
            # Проверяем значение niche
            if data["niche"] != niche_name:
                logger.warning(f"Несоответствие ниши: {data['niche']} != {niche_name}")
                continue
                
            # Проверяем и переводим description если нужно
            if not is_russian_text(data["description"]):
                data["description"] = translate_to_russian(data["description"])
                if not is_russian_text(data["description"]):
                    logger.warning("Не удалось перевести description на русский язык")
                    continue
            data["description"] = clean_text(data["description"])
                    
            # Проверяем и переводим uniqueProductOffer если нужно
            if not is_russian_text(data["uniqueProductOffer"]):
                data["uniqueProductOffer"] = translate_to_russian(data["uniqueProductOffer"])
                if not is_russian_text(data["uniqueProductOffer"]):
                    logger.warning("Не удалось перевести uniqueProductOffer на русский язык")
                    continue
            data["uniqueProductOffer"] = clean_text(data["uniqueProductOffer"])
                
            # Проверяем на копирование из примеров
            is_copied = False
            for niche in NICHES.values():
                examples = NICHE_EXAMPLES[niche]
                if (data["name"] == examples["name"] or
                    data["description"] == examples["description"] or
                    data["uniqueProductOffer"] == examples["offer"]):
                    logger.warning(f"Обнаружено копирование из примеров для ниши {niche}")
                    is_copied = True
                    break
                    
            if is_copied:
                continue
                
            # Сортируем ключи в нужном порядке
            data = _sort_json_keys(data)
            
            return StartupProfile(**data)
            
        except Exception as e:
            logger.error(f"Ошибка при генерации стартапа (попытка {attempt + 1}): {e}")
            continue
            
    raise ValueError("Не удалось сгенерировать корректный профиль стартапа после 3 попыток")

def generate_crisis() -> CrisisProfile:
    """Генерирует кризисную ситуацию."""
    pipe = _get_generator()
    
    # Выбираем случайную нишу для локального кризиса
    niche_id = random.choice(list(NICHES.keys()))
    niche_name = NICHES[niche_id]
    
    prompt = (
        f"{SYSTEM_PROMPT_BASE}\n\n"
        "Сгенерируй кризисную ситуацию в формате JSON со следующими полями:\n"
        "- id: уникальный идентификатор\n"
        "- name: название кризиса\n"
        "- description: описание ситуации\n"
        "- type: тип кризиса (global/local)\n"
        "- danger: уровень опасности (1-5)\n"
        "- niche: ниша (для локального кризиса, должна быть {niche_name})\n"
        "- possibleSolutions: список возможных решений\n\n"
        "JSON:"
    ).format(niche_name=niche_name)
    
    response = pipe(prompt, max_new_tokens=500, do_sample=True, temperature=0.7)[0]["generated_text"]
    # TODO: Парсинг JSON из response
    # Временная заглушка для демонстрации
    return CrisisProfile(
        id=str(uuid4()),
        name="Кризис финансирования",
        description="Внезапное сокращение инвестиций в сектор",
        type=CrisisType.GLOBAL,
        danger=3,
        possibleSolutions=[
            {
                "description": "Оптимизация расходов",
                "effect": {"budget": -20, "reputation": 5}
            }
        ]
    )

def generate_conference() -> ConferenceProfile:
    """Генерирует конференцию."""
    pipe = _get_generator()
    
    # Выбираем случайную нишу
    niche_id = random.choice(list(NICHES.keys()))
    niche_name = NICHES[niche_id]
    
    prompt = (
        f"{SYSTEM_PROMPT_BASE}\n\n"
        "Сгенерируй технологическую конференцию в формате JSON со следующими полями:\n"
        "- id: уникальный идентификатор\n"
        "- name: название конференции\n"
        "- description: описание\n"
        "- nicheId: ID ниши (должен быть {niche_id})\n"
        "- enrollPrice: стоимость участия\n"
        "- gainedReputation: получаемая репутация\n"
        "- expertiseChanges: изменения в экспертизе\n\n"
        "JSON:"
    ).format(niche_id=niche_id)
    
    response = pipe(prompt, max_new_tokens=500, do_sample=True, temperature=0.7)[0]["generated_text"]
    # TODO: Парсинг JSON из response
    # Временная заглушка для демонстрации
    return ConferenceProfile(
        id=str(uuid4()),
        name="TechSummit 2024",
        description="Главная конференция по технологическим инновациям",
        nicheId=niche_id,
        enrollPrice=50000,
        gainedReputation=30,
        expertiseChanges=[
            {"expertise": "AI", "value": 10},
            {"expertise": "Cloud", "value": 5}
        ]
    )

__all__ = [
    "warmup",
    "generate_startup",
    "generate_crisis",
    "generate_conference",
]