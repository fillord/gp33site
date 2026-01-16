import json
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles # <--- НОВОЕ
from pydantic import BaseModel
from typing import Optional
import requests

app = FastAPI()

# Разрешаем React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

load_dotenv()

# Теперь достаем их через os.getenv
BOT_TOKEN = os.getenv("BOT_TOKEN")
ADMIN_CHAT_ID = os.getenv("ADMIN_CHAT_ID")

DATA_FILE = "backend/database.json"
UPLOADS_DIR = "backend/uploads"

if not BOT_TOKEN:
    print("Ошибка: BOT_TOKEN не найден в .env файле!")

if not os.path.exists(UPLOADS_DIR):
    os.makedirs(UPLOADS_DIR)

# === РАЗДАЧА ФАЙЛОВ ===
# Теперь файлы из папки backend/uploads доступны по адресу http://localhost:8000/uploads/...
app.mount("/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")

# Если файла нет или он пустой, создаем структуру
def init_db():
    if not os.path.exists(DATA_FILE):
        with open(DATA_FILE, "w", encoding="utf-8") as f:
            json.dump({"reviews": [], "news": [], "videos": []}, f)
    else:
        # Проверка целостности (если был старый файл только с отзывами)
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            try:
                data = json.load(f)
                if isinstance(data, list): # Если это старый формат (просто список)
                    new_data = {"reviews": data, "news": [], "videos": []}
                    with open(DATA_FILE, "w", encoding="utf-8") as f2:
                        json.dump(new_data, f2, ensure_ascii=False)
            except:
                pass

init_db()

# === МОДЕЛИ ДАННЫХ ===
class Review(BaseModel):
    id: Optional[int] = None
    name: str
    text: str
    textKz: Optional[str] = ""
    date: str
    approved: bool = False

# === ФУНКЦИИ ===
def load_db():
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def save_db(data):
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

# === API ДЛЯ САЙТА ===

# 1. ОТЗЫВЫ
@app.get("/api/reviews")
def get_reviews():
    return [r for r in load_db()["reviews"] if r.get("approved")]

@app.post("/api/reviews")
def create_review(review: Review):
    db = load_db()
    new_id = (max([r["id"] for r in db["reviews"]]) if db["reviews"] else 0) + 1
    
    new_review = review.dict()
    new_review["id"] = new_id
    new_review["approved"] = False
    
    db["reviews"].append(new_review)
    save_db(db)
    
    # Уведомляем админа в ТГ
    msg_text = f"📝 Новый отзыв #{new_id}\n👤 {review.name}\n💬 {review.text}"
    keyboard = {"inline_keyboard": [[
            {"text": "✅ Одобрить", "callback_data": f"approve_{new_id}"},
            {"text": "❌ Удалить", "callback_data": f"reject_{new_id}"}
    ]]}
    requests.post(f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage",
                  json={"chat_id": ADMIN_CHAT_ID, "text": msg_text, "reply_markup": keyboard})
    return {"status": "ok"}

# 2. НОВОСТИ
@app.get("/api/news")
def get_news():
    # Возвращаем список новостей (самые новые сверху)
    return load_db()["news"][::-1]

# 3. ВИДЕО
@app.get("/api/videos")
def get_videos():
    return load_db()["videos"][::-1]

# === API ГРАФИК ===
@app.get("/api/schedule")
def get_schedule():
    db = load_db()
    # Если графика нет, вернем пустой список
    return db.get("schedule", [])