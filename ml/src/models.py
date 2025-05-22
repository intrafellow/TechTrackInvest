"""src/adapted_models.py
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Domain & API models for TechTrackInvest ML‑API.

* Pydantic data‑classes для генерации стартапов, кризисов и мероприятий.
* Enum‑helpers.
* `SYSTEM_PROMPT_BASE` — базовый system‑промпт (RU) для генерации.
"""
from __future__ import annotations

from enum import Enum
from typing import Optional, List
from uuid import UUID

from pydantic import BaseModel

# ---------------------------------------------------------------------------
# System prompt (RU)
# ---------------------------------------------------------------------------

SYSTEM_PROMPT_BASE = (
    "Ты — AI-генератор данных для игры про технологические стартапы. Твоя задача:\n"
    "1) Генерировать реалистичные профили технологических стартапов\n"
    "2) Создавать интересные кризисные ситуации с возможными решениями\n"
    "3) Придумывать технологические конференции с балансными наградами\n"
    "4) Убедиться, что все числовые значения реалистичны и сбалансированы\n"
    "5) Генерировать данные в строго заданном JSON формате\n"
    "6) Создавать уникальные и интересные описания"
)

# ---------------------------------------------------------------------------
# Enums
# ---------------------------------------------------------------------------

class Stage(str, Enum):
    IDEA = "IDEA"
    MVP = "MVP"
    MARKET = "MARKET"
    SCALE = "SCALE"

class CrisisType(str, Enum):
    GLOBAL = "global"  # Кризис, затрагивающий все сферы
    LOCAL = "local"    # Кризис, затрагивающий конкретную сферу

# ---------------------------------------------------------------------------
# Main models
# ---------------------------------------------------------------------------

class StartupProfile(BaseModel):
    """Профиль стартапа."""
    id: str  # В формате 'startup-{niche}-{number}'
    name: str  # На английском языке
    description: str  # На русском языке
    price: int
    uniqueProductOffer: str  # На русском языке
    lastMonthRevenue: int
    expenses: int
    team: int
    budget: int
    product: int
    reputation: int
    level: int
    stage: Stage
    niche: str  # Одна из: "IT", "SpaceTech", "GreenTech", "MedTech"

class Solution(BaseModel):
    """Решение кризиса."""
    description: str
    effect: dict  # Упрощаем структуру эффекта

class CrisisProfile(BaseModel):
    """Профиль кризиса."""
    id: str
    name: str
    description: str
    type: CrisisType  # Тип кризиса: глобальный или локальный
    danger: int       # Уровень опасности (1-5)
    niche: Optional[str] = None  # Ниша для локального кризиса
    possibleSolutions: List[Solution]

class ConferenceProfile(BaseModel):
    """Профиль конференции."""
    id: str
    name: str
    description: str
    nicheId: str
    enrollPrice: int
    gainedReputation: int
    expertiseChanges: List[dict]  # Упрощаем структуру изменений экспертизы 