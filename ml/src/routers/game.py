"""src/routers/game.py
~~~~~~~~~~~~~~~~~~~~
FastAPI‑роутер: методы генерации контента для TechTrek.

* POST `/game/generate_startup`   — сгенерировать профиль стартапа
* POST `/game/generate_crisis`    — сгенерировать кризис
* POST `/game/generate_conference` — сгенерировать конференцию
"""
from __future__ import annotations

import logging
from uuid import UUID

from fastapi import APIRouter, HTTPException
from src.models import StartupProfile, CrisisProfile, ConferenceProfile
from src.services import llm_service

logger = logging.getLogger("routers.game")

router = APIRouter(prefix="/game", tags=["game"])

# ---------------------------------------------------------------------------
# Генерация контента
# ---------------------------------------------------------------------------

@router.post("/generate_startup", response_model=StartupProfile)
async def generate_startup():
    """Генерирует профиль стартапа."""
    try:
        return llm_service.generate_startup()
    except Exception as exc:
        raise HTTPException(500, f"Ошибка генерации стартапа: {exc}") from exc

@router.post("/generate_crisis", response_model=CrisisProfile)
async def generate_crisis():
    """Генерирует кризисную ситуацию."""
    try:
        return llm_service.generate_crisis()
    except Exception as exc:
        raise HTTPException(500, f"Ошибка генерации кризиса: {exc}") from exc

@router.post("/generate_conference", response_model=ConferenceProfile)
async def generate_conference():
    """Генерирует конференцию."""
    try:
        return llm_service.generate_conference()
    except Exception as exc:
        raise HTTPException(500, f"Ошибка генерации конференции: {exc}") from exc
