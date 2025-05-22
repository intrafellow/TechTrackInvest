"""src/main.py
~~~~~~~~~~~~~~~~
Точка входа FastAPI‑приложения **TechTrackInvest ML‑API**.

Запуск:
    uvicorn src.main:app --reload --port 8000
"""
from __future__ import annotations

import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.routers import game

# ---------------------------------------------------------------------------
# Логирование
# ---------------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="[%(asctime)s] %(levelname)s %(name)s: %(message)s",
)
logger = logging.getLogger("techtrackinvest.api")

# ---------------------------------------------------------------------------
# Приложение
# ---------------------------------------------------------------------------
app = FastAPI(
    title="TechTrackInvest — ML API",
    version="0.1.0",
    description="Backend‑сервис для генерации контента для игры про технологические стартапы.",
)

# CORS — настройка для работы с фронтендом
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # URL фронтенда
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Роуты
# ---------------------------------------------------------------------------
app.include_router(game.router)

# ---------------------------------------------------------------------------
# Health‑check
# ---------------------------------------------------------------------------
@app.get("/health", tags=["meta"])
async def health() -> dict[str, str]:
    return {"status": "ok"}
