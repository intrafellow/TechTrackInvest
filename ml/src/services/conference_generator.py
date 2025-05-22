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

import torch
from transformers import pipeline, Pipeline

from src.models import ConferenceProfile

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

def generate_conference() -> ConferenceProfile:
    """Генерирует технологическую конференцию."""
    pipe = _get_generator()
    
    # Выбираем случайную нишу
    niche_id = random.choice(list(NICHES.keys()))
    niche_name = NICHES[niche_id]
    
    prompt = (
        "Привет! Ты - Опытнейший и очень успешный фаундер стартапов, все твои идеи обречены на успех, "
        "если не случится что-то крайне глобальное и непредвиденное событие, или даже их череда. "
        "Твоя задача - создать реалистичную технологическую конференцию, которая может быть полезна для стартапов.\n\n"
        "Сгенерируй конференцию в формате JSON. ВАЖНО: все поля обязательны!\n"
        "Поля JSON:\n"
        "- id: уникальный идентификатор в формате 'conference-{niche_id}-{number}'\n"
        "- name: название конференции на русском языке\n"
        "- description: подробное описание конференции на русском языке\n"
        "- nicheId: ID ниши (должен быть {niche_id})\n"
        "- enrollPrice: стоимость участия (целое число)\n"
        "- gainedReputation: получаемая репутация (целое число от 0 до 100)\n"
        "- expertiseChanges: список изменений в экспертизе в формате:\n"
        "  [\n"
        "    {\n"
        "      \"expertise\": \"название экспертизы на русском языке\",\n"
        "      \"value\": изменение значения (целое число от -100 до 100)\n"
        "    }\n"
        "  ]\n\n"
        "КРИТИЧЕСКИ ВАЖНО:\n"
        "1) Все поля обязательны\n"
        "2) Все текстовые поля должны быть на русском языке\n"
        "3) Поле nicheId должно быть строго равно '{niche_id}'\n"
        "4) Стоимость участия должна быть реалистичной (от 10000 до 1000000 рублей)\n"
        "5) Получаемая репутация должна быть от 0 до 100\n"
        "6) Каждое изменение экспертизы должно иметь название и значение\n"
        "7) Значение изменения экспертизы должно быть от -100 до 100\n"
        "8) Все числовые значения должны быть целыми числами\n"
        "9) Описания должны быть реалистичными и соответствовать нише {niche_name}\n"
        "10) Названия экспертиз должны соответствовать нише {niche_name}\n\n"
        "JSON:"
    ).format(
        niche_id=niche_id,
        niche_name=niche_name,
        number=random.randint(1, 100)
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
                "id", "name", "description", "nicheId", "enrollPrice",
                "gainedReputation", "expertiseChanges"
            ]
            missing_fields = [field for field in required_fields if field not in data]
            if missing_fields:
                logger.warning(f"Отсутствуют обязательные поля: {missing_fields}")
                continue
                
            # Проверяем значение nicheId
            if data["nicheId"] != niche_id:
                logger.warning(f"Несоответствие ниши: {data['nicheId']} != {niche_id}")
                continue
                
            # Проверяем значение enrollPrice
            if not isinstance(data["enrollPrice"], int) or data["enrollPrice"] < 10000 or data["enrollPrice"] > 1000000:
                logger.warning(f"Недопустимое значение enrollPrice: {data['enrollPrice']}")
                continue
                
            # Проверяем значение gainedReputation
            if not isinstance(data["gainedReputation"], int) or data["gainedReputation"] < 0 or data["gainedReputation"] > 100:
                logger.warning(f"Недопустимое значение gainedReputation: {data['gainedReputation']}")
                continue
                
            # Проверяем expertiseChanges
            if not isinstance(data["expertiseChanges"], list) or not data["expertiseChanges"]:
                logger.warning("Отсутствуют изменения экспертизы")
                continue
                
            for change in data["expertiseChanges"]:
                if not isinstance(change, dict):
                    logger.warning("Некорректный формат изменения экспертизы")
                    continue
                    
                if "expertise" not in change or "value" not in change:
                    logger.warning("Отсутствуют обязательные поля в изменении экспертизы")
                    continue
                    
                if not isinstance(change["value"], int) or change["value"] < -100 or change["value"] > 100:
                    logger.warning("Значение изменения экспертизы должно быть от -100 до 100")
                    continue
            
            return ConferenceProfile(**data)
            
        except Exception as e:
            logger.error(f"Ошибка при генерации конференции (попытка {attempt + 1}): {e}")
            continue
            
    raise ValueError("Не удалось сгенерировать корректный профиль конференции после 3 попыток") 