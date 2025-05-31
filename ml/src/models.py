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

from pydantic import BaseModel, Field

# ---------------------------------------------------------------------------
# System prompt (RU)
# ---------------------------------------------------------------------------

SYSTEM_PROMPT_BASE = (
    "Ты — опытный предприниматель и эксперт в технологическом бизнесе с многолетним опытом. "
    "Ты успешно основал и развил множество технологических стартапов, пережил различные кризисы "
    "и организовал десятки технологических конференций. Твоя экспертиза позволяет тебе:\n"
    "1) Создавать реалистичные профили технологических стартапов с учетом всех нюансов рынка\n"
    "2) Прогнозировать и моделировать кризисные ситуации, основываясь на реальном опыте, "
    "предлагая несколько вариантов решений с учетом их последствий\n"
    "3) Организовывать технологические конференции с продуманной структурой, "
    "балансными наградами и четкими критериями оценки\n"
    "4) Обеспечивать реалистичность и сбалансированность всех числовых показателей\n"
    "5) Генерировать данные в строго заданном JSON формате\n"
    "6) Создавать уникальные и интересные описания, основанные на реальном опыте\n\n"
    "При работе с кризисами ты учитываешь:\n"
    "- Глобальные и локальные факторы влияния\n"
    "- Возможные последствия для разных ниш\n"
    "- Реальные способы преодоления кризиса\n"
    "- Баланс между рисками и возможностями\n\n"
    "При организации конференций ты продумываешь:\n"
    "- Целевые ниши и аудиторию\n"
    "- Структуру и формат мероприятий\n"
    "- Систему оценки и наград\n"
    "- Влияние на репутацию и экспертизу участников"
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

class Niche(str, Enum):
    IT = "IT"
    SPACE_TECH = "SpaceTech"
    GREEN_TECH = "GreenTech"
    MED_TECH = "MedTech"

# ---------------------------------------------------------------------------
# Request models
# ---------------------------------------------------------------------------

class GenerateStartupRequest(BaseModel):
    """Запрос на генерацию одного стартапа."""
    niche: Optional[str] = Field(
        default=None,
        description="Ниша для генерации стартапа. Если не указана, выбирается случайная ниша."
    )

class GenerateStartupsRequest(BaseModel):
    """Запрос на генерацию нескольких стартапов."""
    quantity: int = Field(
        default=1,
        ge=1,
        le=10,
        description="Количество стартапов для генерации (от 1 до 10)"
    )
    niche: Optional[str] = Field(
        default=None,
        description="Ниша для генерации. Если не указана, выбирается случайная ниша."
    )

class GenerateConferenceRequest(BaseModel):
    """Запрос на генерацию одной конференции."""
    niche: Optional[str] = Field(
        default=None,
        description="Ниша для генерации конференции. Если не указана, выбирается случайная ниша."
    )

class GenerateConferencesRequest(BaseModel):
    """Запрос на генерацию нескольких конференций."""
    quantity: int = Field(
        default=1,
        ge=1,
        le=10,
        description="Количество конференций для генерации (от 1 до 10)"
    )
    niche: Optional[str] = Field(
        default=None,
        description="Ниша для генерации. Если не указана, выбирается случайная ниша."
    )

# ---------------------------------------------------------------------------
# Response models
# ---------------------------------------------------------------------------

class StartupProfile(BaseModel):
    """Профиль стартапа."""
    id: Optional[str] = ""  # Опциональный идентификатор
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
    id: Optional[str] = ""  # Опциональный идентификатор
    name: str
    description: str
    type: CrisisType  # Тип кризиса: глобальный или локальный
    danger: int       # Уровень опасности (1-5)
    niche: Optional[Niche] = None  # Ниша для локального кризиса
    possibleSolutions: List[Solution]

class ConferenceProfile(BaseModel):
    """Профиль конференции."""
    id: Optional[str] = ""  # Опциональный идентификатор
    name: str
    description: str
    nicheId: str
    enrollPrice: int
    gainedReputation: int
    expertise: List[dict]  # Список изменений экспертизы в формате {"nicheId": str, "change": int} 