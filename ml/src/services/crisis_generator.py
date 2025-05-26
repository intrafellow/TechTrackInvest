"""src/services/crisis_generator.py
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Сервис для генерации кризисных ситуаций с использованием LLM.
"""
from __future__ import annotations

import logging
from functools import lru_cache
import random
import json
from uuid import uuid4

import torch
from transformers import pipeline, Pipeline

from src.models import (
    CrisisProfile,
    CrisisType,
)

logger = logging.getLogger("services.crisis_generator")

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

def generate_crisis() -> CrisisProfile:
    """Генерирует кризисную ситуацию."""
    pipe = _get_generator()
    
    # Выбираем случайную нишу для локального кризиса
    niche_id = random.choice(list(NICHES.keys()))
    niche_name = NICHES[niche_id]
    
    # Случайно выбираем тип кризиса (глобальный или локальный)
    crisis_type = random.choice([CrisisType.GLOBAL, CrisisType.LOCAL])
    
    prompt = (
        "Привет! Ты - Опытнейший и очень успешный фаундер стартапов, все твои идеи обречены на успех, "
        "если не случится что-то крайне глобальное и непредвиденное событие, или даже их череда. "
        "Твоя задача - создать реалистичную кризисную ситуацию, которая может повлиять на стартапы.\n\n"
        "Сгенерируй кризисную ситуацию в формате JSON. ВАЖНО: все поля обязательны!\n"
        "Поля JSON:\n"
        "- id: уникальный идентификатор в формате 'crisis-{type}-{number}'\n"
        "- name: название кризиса на русском языке\n"
        "- description: подробное описание кризиса на русском языке\n"
        "- type: тип кризиса (GLOBAL/LOCAL)\n"
        "- danger: уровень опасности (целое число от 1 до 5)\n"
        "- niche: ниша рынка (для локального кризиса, должна быть {niche_name})\n"
        "- possibleSolutions: список возможных решений в формате:\n"
        "  [\n"
        "    {\n"
        "      \"description\": \"описание решения на русском языке\",\n"
        "      \"effect\": {\n"
        "        \"budget\": изменение бюджета (целое число),\n"
        "        \"reputation\": изменение репутации (целое число)\n"
        "      }\n"
        "    }\n"
        "  ]\n\n"
        "КРИТИЧЕСКИ ВАЖНО:\n"
        "1) Все поля обязательны\n"
        "2) Все текстовые поля должны быть на русском языке\n"
        "3) Для глобального кризиса поле niche должно быть пустым\n"
        "4) Для локального кризиса поле niche должно быть равно '{niche_name}'\n"
        "5) Тип кризиса должен быть строго GLOBAL или LOCAL\n"
        "6) Уровень опасности должен быть от 1 до 5\n"
        "7) Каждое решение должно иметь описание и эффект\n"
        "8) Эффект должен содержать изменения бюджета и репутации\n"
        "9) Все числовые значения должны быть целыми числами\n"
        "10) Описания должны быть реалистичными и соответствовать типу кризиса\n\n"
        "JSON:"
    ).format(
        niche_name=niche_name,
        type=crisis_type.value.lower(),
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
                "id", "name", "description", "type", "danger",
                "niche", "possibleSolutions"
            ]
            missing_fields = [field for field in required_fields if field not in data]
            if missing_fields:
                logger.warning(f"Отсутствуют обязательные поля: {missing_fields}")
                continue
                
            # Проверяем значение type
            if data["type"].upper() not in [t.value for t in CrisisType]:
                logger.warning(f"Недопустимое значение type: {data['type']}")
                continue
            data["type"] = data["type"].upper()
                
            # Проверяем значение danger
            if not isinstance(data["danger"], int) or data["danger"] < 1 or data["danger"] > 5:
                logger.warning(f"Недопустимое значение danger: {data['danger']}")
                continue
                
            # Проверяем значение niche
            if data["type"] == CrisisType.GLOBAL.value:
                if data["niche"]:
                    logger.warning("Глобальный кризис не должен иметь нишу")
                    continue
            else:  # LOCAL
                if data["niche"] != niche_name:
                    logger.warning(f"Несоответствие ниши: {data['niche']} != {niche_name}")
                    continue
                    
            # Проверяем possibleSolutions
            if not isinstance(data["possibleSolutions"], list) or not data["possibleSolutions"]:
                logger.warning("Отсутствуют возможные решения")
                continue
                
            for solution in data["possibleSolutions"]:
                if not isinstance(solution, dict):
                    logger.warning("Некорректный формат решения")
                    continue
                    
                if "description" not in solution or "effect" not in solution:
                    logger.warning("Отсутствуют обязательные поля в решении")
                    continue
                    
                effect = solution["effect"]
                if not isinstance(effect, dict) or "budget" not in effect or "reputation" not in effect:
                    logger.warning("Некорректный формат эффекта")
                    continue
                    
                if not isinstance(effect["budget"], int) or not isinstance(effect["reputation"], int):
                    logger.warning("Эффекты должны быть целыми числами")
                    continue
            
            return CrisisProfile(**data)
            
        except Exception as e:
            logger.error(f"Ошибка при генерации кризиса (попытка {attempt + 1}): {e}")
            continue
            
    raise ValueError("Не удалось сгенерировать корректный профиль кризиса после 3 попыток") 