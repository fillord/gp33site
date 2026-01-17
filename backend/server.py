import os
import requests
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from dotenv import load_dotenv

# Импортируем наши новые модули
from database import init_models, get_db
from models import Review as ReviewModel, News as NewsModel, Video as VideoModel, Schedule as ScheduleModel

load_dotenv()

app = FastAPI()

# === БЕЗОПАСНОСТЬ (CORS) ===
# В продакшене замените "*" на реальный домен, например ["https://gp33.kz"]
ORIGINS = [
    "http://localhost:5173", # Vite (локальная разработка)
    "http://localhost:4173", # Vite preview
    "*" # Оставьте, если не знаете точный домен, но лучше убрать перед релизом
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BOT_TOKEN = os.getenv("BOT_TOKEN")
ADMIN_CHAT_ID = os.getenv("ADMIN_CHAT_ID")
UPLOADS_DIR = "backend/uploads"

if not os.path.exists(UPLOADS_DIR):
    os.makedirs(UPLOADS_DIR)

app.mount("/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")

# При старте создаем таблицы в БД
@app.on_event("startup")
async def startup():
    await init_models()

# === Pydantic модели (для валидации входящих данных) ===
class ReviewSchema(BaseModel):
    name: str
    text: str
    textKz: Optional[str] = ""
    date: str

# === API ===

# 1. ОТЗЫВЫ
@app.get("/api/reviews")
async def get_reviews(db: AsyncSession = Depends(get_db)):
    # Запрос: выбрать только одобренные
    result = await db.execute(select(ReviewModel).where(ReviewModel.approved == True))
    return result.scalars().all()

@app.post("/api/reviews")
async def create_review(review: ReviewSchema, db: AsyncSession = Depends(get_db)):
    # Создаем запись в БД
    new_review = ReviewModel(
        name=review.name,
        text=review.text,
        textKz=review.textKz,
        date=review.date,
        approved=False
    )
    db.add(new_review)
    await db.commit()
    await db.refresh(new_review)
    
    # Уведомляем админа в ТГ
    msg_text = f"📝 Новый отзыв #{new_review.id}\n👤 {review.name}\n💬 {review.text}"
    keyboard = {"inline_keyboard": [[
            {"text": "✅ Одобрить", "callback_data": f"approve_{new_review.id}"},
            {"text": "❌ Удалить", "callback_data": f"reject_{new_review.id}"}
    ]]}
    try:
        requests.post(f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage",
                    json={"chat_id": ADMIN_CHAT_ID, "text": msg_text, "reply_markup": keyboard}, timeout=5)
    except Exception as e:
        print(f"Ошибка отправки в ТГ: {e}")

    return {"status": "ok", "id": new_review.id}

# 2. НОВОСТИ
@app.get("/api/news")
async def get_news(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(NewsModel).order_by(NewsModel.id.desc()))
    return result.scalars().all()

# 3. ВИДЕО
@app.get("/api/videos")
async def get_videos(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(VideoModel).order_by(VideoModel.id.desc()))
    return result.scalars().all()

# 4. ГРАФИК
@app.get("/api/schedule")
async def get_schedule(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ScheduleModel))
    return result.scalars().all()