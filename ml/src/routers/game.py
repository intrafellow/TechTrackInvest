"""src/routers/game.py
~~~~~~~~~~~~~~~~~~~~
FastAPI‑роутер: методы генерации контента для TechTrek.

* POST `/game/generate_startup`   — сгенерировать профиль стартапа
* POST `/game/generate_startups`  — сгенерировать несколько профилей стартапов
* POST `/game/generate_crisis`    — сгенерировать кризис
* POST `/game/generate_conference` — сгенерировать конференцию
"""
from __future__ import annotations

import logging
from uuid import UUID

from fastapi import APIRouter, HTTPException
from src.models import (
    StartupProfile,
    CrisisProfile,
    ConferenceProfile,
    GenerateStartupRequest,
    GenerateStartupsRequest,
    GenerateConferenceRequest,
    GenerateConferencesRequest
)
from src.services import startup_generator, conference_generator, llm_service

logger = logging.getLogger("routers.game")

router = APIRouter(prefix="/game", tags=["game"])

# ---------------------------------------------------------------------------
# Генерация контента
# ---------------------------------------------------------------------------

@router.post("/generate_startup", response_model=StartupProfile)
async def generate_startup(request: GenerateStartupRequest):
    """Генерирует профиль стартапа.
    
    Args:
        request: Параметры запроса на генерацию стартапа.
            niche: Ниша для генерации стартапа ("IT", "GreenTech", "MedTech", "SpaceTech").
                  Если не указана, выбирается случайная ниша.
    """
    try:
        return startup_generator.generate_startup(request)
    except Exception as exc:
        raise HTTPException(500, f"Ошибка генерации стартапа: {exc}") from exc

@router.post("/generate_startups", response_model=list[StartupProfile])
async def generate_startups(request: GenerateStartupsRequest):
    """Генерирует несколько профилей стартапов.
    
    Args:
        request: Параметры запроса на генерацию стартапов.
            quantity: Количество стартапов для генерации (от 1 до 10).
            niche: Ниша для генерации. Если не указана, выбирается случайная ниша.
    
    Returns:
        list[StartupProfile]: Список сгенерированных профилей стартапов.
    """
    try:
        return startup_generator.generate_startups(request)
    except Exception as exc:
        raise HTTPException(500, f"Ошибка генерации стартапов: {exc}") from exc

@router.post("/generate_crisis", response_model=CrisisProfile)
async def generate_crisis():
    """Генерирует кризисную ситуацию."""
    try:
        return llm_service.generate_crisis()
    except Exception as exc:
        raise HTTPException(500, f"Ошибка генерации кризиса: {exc}") from exc

@router.post("/generate_conference", response_model=ConferenceProfile)
async def generate_conference(request: GenerateConferenceRequest):
    """Генерирует профиль конференции.
    
    Args:
        request: Параметры запроса на генерацию конференции.
            niche: Ниша для генерации конференции ("IT", "GreenTech", "MedTech", "SpaceTech").
                  Если не указана, выбирается случайная ниша.
    """
    try:
        return conference_generator.generate_conference(request)
    except Exception as exc:
        raise HTTPException(500, f"Ошибка генерации конференции: {exc}") from exc

@router.post("/generate_conferences", response_model=list[ConferenceProfile])
async def generate_conferences(request: GenerateConferencesRequest):
    """Генерирует несколько профилей конференций.
    
    Args:
        request: Параметры запроса на генерацию конференций.
            count: Количество конференций для генерации (от 1 до 10).
            niches: Список ниш для генерации. Если не указан, используются все доступные ниши.
    """
    try:
        return conference_generator.generate_conferences(request)
    except Exception as exc:
        raise HTTPException(500, f"Ошибка генерации конференций: {exc}") from exc
