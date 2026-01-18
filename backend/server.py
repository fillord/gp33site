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
from datetime import datetime # Не забудьте импорт
from fastapi.responses import FileResponse
# Импорты БД
from database import init_models, get_db
# Импортируем Appeal
from models import Review as ReviewModel, News as NewsModel, Video as VideoModel, Schedule as ScheduleModel, Vacancy as VacancyModel, Appeal as AppealModel
from models import Document as DocumentModel

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
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
BOT_TOKEN = os.getenv("BOT_TOKEN")
ADMIN_CHAT_ID = os.getenv("ADMIN_CHAT_ID")
UPLOADS_DIR = os.path.join(BASE_DIR, "uploads")

if not os.path.exists(UPLOADS_DIR):
    os.makedirs(UPLOADS_DIR)

app.mount("/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")

# При старте создаем таблицы в БД
@app.on_event("startup")
async def startup():
    await init_models()

# === СХЕМЫ ===
class ReviewSchema(BaseModel):
    name: str
    text: str
    textKz: Optional[str] = ""
    date: str

class FeedbackSchema(BaseModel):
    name: str
    phone: str
    message: str
    category: str

# === API ===

# 1. ОТЗЫВЫ
@app.get("/api/reviews")
async def get_reviews(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ReviewModel).where(ReviewModel.approved == True))
    return result.scalars().all()

@app.post("/api/reviews")
async def create_review(review: ReviewSchema, db: AsyncSession = Depends(get_db)):
    # Логика отзывов (старая)
    new_review = ReviewModel(
        name=review.name, text=review.text, textKz=review.textKz, date=review.date, approved=False
    )
    db.add(new_review)
    await db.commit()
    await db.refresh(new_review)
    
    msg_text = f"📝 Новый отзыв #{new_review.id}\n👤 {review.name}\n💬 {review.text}"
    keyboard = {"inline_keyboard": [[
            {"text": "✅ Одобрить", "callback_data": f"approve_{new_review.id}"},
            {"text": "❌ Удалить", "callback_data": f"reject_{new_review.id}"}
    ]]}
    try:
        requests.post(f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage",
                    json={"chat_id": ADMIN_CHAT_ID, "text": msg_text, "reply_markup": keyboard}, timeout=5)
    except Exception as e:
        print(f"Ошибка ТГ: {e}")
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

# 5. ВАКАНСИИ
@app.get("/api/vacancies")
async def get_vacancies(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(VacancyModel).order_by(VacancyModel.id.desc()))
    return result.scalars().all()

# === 6. ОТПРАВКА ОБРАЩЕНИЙ В TELEGRAM (НОВОЕ) ===
# "thanks", "complaint", "proposal"

# 2. ОТПРАВКА ОБРАЩЕНИЯ (Сохранение + ТГ)
@app.post("/api/feedback")
async def send_feedback(data: FeedbackSchema, db: AsyncSession = Depends(get_db)):
    # 1. Сохраняем
    new_appeal = AppealModel(
        name=data.name,
        phone=data.phone,
        category=data.category,
        text=data.message,
        date=datetime.now().strftime("%d.%m.%Y"),
        approved=False
    )
    db.add(new_appeal)
    await db.commit()
    await db.refresh(new_appeal)

    # 2. Текст для админа
    cat_ru = {
        "thanks": "🙏 Благодарность",
        "complaint": "😡 Жалоба",
        "proposal": "💡 Предложение"
    }.get(data.category, data.category)

    msg_text = (
        f"🚨 <b>НОВОЕ ОБРАЩЕНИЕ #{new_appeal.id}</b>\n"
        f"📌 <b>Тип:</b> {cat_ru}\n"
        f"👤 <b>Имя:</b> {data.name}\n"
        f"📞 <b>Телефон:</b> {data.phone}\n"
        f"📝 <b>Сообщение:</b>\n{data.message}"
    )

    # 3. Кнопки
    # ВАЖНО: Используем 'delete_appeals_{id}', чтобы совпадало с логикой бота
    reply_markup = None
    if data.category != "proposal":
        reply_markup = {
            "inline_keyboard": [[
                {"text": "✅ Опубликовать", "callback_data": f"pub_{new_appeal.id}"},
                {"text": "❌ Отклонить", "callback_data": f"delete_appeals_{new_appeal.id}"} 
            ]]
        }

    # 4. Отправка
    try:
        payload = {
            "chat_id": ADMIN_CHAT_ID,
            "text": msg_text,
            "parse_mode": "HTML"
        }
        if reply_markup:
            payload["reply_markup"] = reply_markup
            
        requests.post(f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage", json=payload, timeout=5)
    except Exception as e:
        print(f"Ошибка отправки в ТГ: {e}")

    return {"status": "ok", "id": new_appeal.id}

@app.get("/api/appeals")
async def get_appeals(category: str, db: AsyncSession = Depends(get_db)):
    # Только одобренные
    query = select(AppealModel).where(
        AppealModel.category == category,
        AppealModel.approved == True
    ).order_by(AppealModel.id.desc())
    
    result = await db.execute(query)
    return result.scalars().all()

@app.get("/api/documents")
async def get_documents(category: str, db: AsyncSession = Depends(get_db)):
    """
    Возвращает список документов для конкретной страницы (категории)
    """
    query = select(DocumentModel).where(
        DocumentModel.category == category
    ).order_by(DocumentModel.id.desc())
    
    result = await db.execute(query)
    return result.scalars().all()

@app.get("/api/download/{doc_id}")
async def download_document(doc_id: int, db: AsyncSession = Depends(get_db)):
    """
    Скачивание документа с восстановлением оригинального имени файла
    """
    # 1. Ищем документ в БД
    query = select(DocumentModel).where(DocumentModel.id == doc_id)
    result = await db.execute(query)
    doc = result.scalar_one_or_none()

    if not doc:
        return {"error": "Document not found"}

    # 2. Формируем полный путь к файлу на диске
    # doc.file_path хранится как "/uploads/docs/..."
    # Нам нужно убрать первый слеш и соединить с BASE_DIR
    relative_path = doc.file_path.lstrip("/")
    file_full_path = os.path.join(BASE_DIR, relative_path)

    if not os.path.exists(file_full_path):
        return {"error": "File not found on disk"}

    # 3. Формируем красивое имя файла для пользователя
    # Если в базе расширение храните как "PDF" (без точки), добавляем точку
    ext = doc.file_type.lower()
    if not ext.startswith("."):
        ext = f".{ext}"
        
    # Имя файла = Заголовок из БД + расширение
    # Функция quote помогает, если в названии есть кириллица или спецсимволы
    from urllib.parse import quote
    filename = f"{doc.title}{ext}"
    
    # 4. Отдаем файл с заголовком Content-Disposition
    return FileResponse(
        path=file_full_path, 
        filename=filename, 
        media_type='application/octet-stream'
    )

# Убедитесь, что папка для документов создается
DOCS_DIR = os.path.join(UPLOADS_DIR, "docs")
if not os.path.exists(DOCS_DIR):
    os.makedirs(DOCS_DIR)