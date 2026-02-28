import os
import json
import uuid
import jwt
import requests
from fastapi import FastAPI, Depends, WebSocket, WebSocketDisconnect, Header, HTTPException
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
from models import Document as DocumentModel, ChatSession, ChatMessage, ChatManager

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
    category: Optional[str] = "Обращение"

SECRET_KEY = "23862369789" # Секретный ключ для шифрования
ALGORITHM = "HS256"

class ManagerLoginSchema(BaseModel):
    username: str
    password: str

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

    category_map = {
        "thanks": "🙏 Благодарность", "complaint": "😡 Жалоба", "proposal": "💡 Предложение",
        "Blagodarnost": "🙏 Благодарность", "Jaloba": "😡 Жалоба", "Predlozhenie": "💡 Предложение",
        "Служба Поддержки": "🚑 Служба Поддержки", "support": "🚑 Служба Поддержки"
    }
    cat_ru = category_map.get(data.category, data.category)

    msg_text = (
        f"🚨 <b>НОВОЕ ОБРАЩЕНИЕ #{new_appeal.id}</b>\n"
        f"📌 <b>Тип:</b> {cat_ru}\n"
        f"👤 <b>Имя:</b> {data.name}\n"
        f"📞 <b>Телефон:</b> {data.phone}\n"
        f"📝 <b>Сообщение:</b>\n{data.message}"
    )

    # 👇 3. УМНЫЕ КНОПКИ ДЛЯ РАЗНЫХ ТИПОВ 👇
    reply_markup = None
    
    if data.category in ["Служба Поддержки", "support"]:
        # Для службы поддержки: "Сделано" (отправит в архив) и "Удалить"
        reply_markup = {
            "inline_keyboard": [[
                {"text": "✅ Сделано (В архив)", "callback_data": f"resolve_{new_appeal.id}"},
                {"text": "🗑 Удалить", "callback_data": f"delete_appeals_{new_appeal.id}"} 
            ]]
        }
    elif data.category not in ["proposal", "Predlozhenie"]:
        # Для благодарностей и жалоб: классические "Опубликовать / Отклонить"
        reply_markup = {
            "inline_keyboard": [[
                {"text": "✅ Опубликовать", "callback_data": f"pub_{new_appeal.id}"},
                {"text": "❌ Отклонить", "callback_data": f"delete_appeals_{new_appeal.id}"} 
            ]]
        }

    # 4. Отправка
    try:
        payload = {"chat_id": ADMIN_CHAT_ID, "text": msg_text, "parse_mode": "HTML"}
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

# === WEBSOCKETS CHAT MANAGER ===
class ConnectionManager:
    def __init__(self):
        # Храним активные соединения: { session_token: [websocket_client, websocket_manager] }
        self.active_connections: dict[str, list[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, session_token: str):
        await websocket.accept()
        if session_token not in self.active_connections:
            self.active_connections[session_token] = []
        self.active_connections[session_token].append(websocket)

    def disconnect(self, websocket: WebSocket, session_token: str):
        if session_token in self.active_connections:
            self.active_connections[session_token].remove(websocket)
            if not self.active_connections[session_token]:
                del self.active_connections[session_token]

    async def broadcast_to_session(self, session_token: str, message: dict):
        if session_token in self.active_connections:
            for connection in self.active_connections[session_token]:
                await connection.send_text(json.dumps(message))

chat_manager = ConnectionManager()

# Эндпоинт для старта новой сессии клиентом
class StartChatSchema(BaseModel):
    name: str
    phone: str

@app.post("/api/chat/start")
async def start_chat(data: StartChatSchema, db: AsyncSession = Depends(get_db)):
    session_token = str(uuid.uuid4())
    
    new_session = ChatSession(
        session_token=session_token,
        user_name=data.name,
        user_phone=data.phone,
        status="open"
    )
    db.add(new_session)
    await db.commit()
    
    msg_text = f"🚨 <b>НОВЫЙ ЧАТ С САЙТА</b>\n👤 Имя: {data.name}\n📞 Тел: {data.phone}"
    keyboard = {
        "inline_keyboard": [[
            {"text": "💬 Открыть чат", "web_app": {"url": f"https://almgp33.kz/manager/chat/{session_token}"}}
        ]]
    }
    
    # 1. Получаем всех зарегистрированных менеджеров из БД
    mgr_result = await db.execute(select(ChatManager))
    managers = mgr_result.scalars().all()
    
    # 2. Собираем уникальный список Telegram ID (Менеджеры + Главный Админ)
    chat_ids = set([m.telegram_id for m in managers if m.telegram_id])
    if ADMIN_CHAT_ID:
        chat_ids.add(ADMIN_CHAT_ID)
        
    # 3. Рассылаем уведомление ВСЕМ сотрудникам
    for tg_id in chat_ids:
        try:
            requests.post(f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage", json={
                "chat_id": tg_id,
                "text": msg_text,
                "parse_mode": "HTML",
                "reply_markup": keyboard
            }, timeout=5)
        except Exception as e:
            print(f"Ошибка отправки менеджеру {tg_id}: {e}")

    return {"session_token": session_token}

@app.websocket("/ws/chat/{session_token}")
async def websocket_chat(websocket: WebSocket, session_token: str, db: AsyncSession = Depends(get_db)):
    # 1. Проверяем, существует ли сессия
    result = await db.execute(select(ChatSession).where(ChatSession.session_token == session_token))
    session = result.scalar_one_or_none()
    
    if not session or session.status == "closed":
        await websocket.close(code=1008) # Закрываем соединение, если чат завершен
        return

    # 2. Подключаем клиента
    await chat_manager.connect(websocket, session_token)
    try:
        while True:
            # Ждем сообщение
            data = await websocket.receive_text()
            message_data = json.loads(data) 
            
            # 👇 НОВАЯ МАГИЯ UX: Проверяем тип события 👇
            if message_data.get("type") in ["typing", "read"]:
                # Пересылаем статус (печатает или прочитал) собеседнику
                await chat_manager.broadcast_to_session(session_token, {
                    "type": message_data.get("type"),
                    "sender": message_data.get("sender")
                })
                continue

            # Старая логика: сохраняем РЕАЛЬНОЕ сообщение в БД
            new_msg = ChatMessage(
                session_id=session.id,
                sender=message_data.get("sender", "client"),
                text=message_data.get("text", "")
            )
            db.add(new_msg)
            await db.commit()
            
            # Рассылаем всем готовое сообщение
            await chat_manager.broadcast_to_session(session_token, {
                "type": "message", # Указываем, что это текст, а не анимация
                "sender": new_msg.sender,
                "text": new_msg.text,
                "timestamp": new_msg.timestamp.strftime("%H:%M")
            })
    except WebSocketDisconnect:
        chat_manager.disconnect(websocket, session_token)

# Эндпоинт для получения истории (если пациент обновил страницу)
@app.get("/api/chat/history/{session_token}")
async def get_chat_history(session_token: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ChatSession).where(ChatSession.session_token == session_token))
    session = result.scalar_one_or_none()
    
    if not session:
        return {"error": "Session not found", "messages": []}
        
    msg_result = await db.execute(select(ChatMessage).where(ChatMessage.session_id == session.id).order_by(ChatMessage.id))
    messages = msg_result.scalars().all()
    
    return {
        "status": session.status,
        "messages": [{"sender": m.sender, "text": m.text, "timestamp": m.timestamp.strftime("%H:%M")} for m in messages]
    }

# Эндпоинт для закрытия чата менеджером
@app.post("/api/chat/close/{session_token}")
async def close_chat(session_token: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ChatSession).where(ChatSession.session_token == session_token))
    session = result.scalar_one_or_none()
    
    if not session:
        return {"error": "Session not found"}
        
    session.status = "closed"
    await db.commit()
    
    # Отправляем системное сообщение в сокет, чтобы клиент понял, что чат закрыт
    await chat_manager.broadcast_to_session(session_token, {
        "sender": "system",
        "text": "Менеджер завершил диалог. Вопрос решен.",
        "timestamp": datetime.now().strftime("%H:%M")
    })
    
    return {"status": "closed"}

# 1. ЗАЩИЩЕННАЯ АВТОРИЗАЦИЯ
@app.post("/api/manager/auth")
async def manager_auth(data: ManagerLoginSchema, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(ChatManager).where(
            ChatManager.username == data.username, 
            ChatManager.password == data.password
        )
    )
    manager = result.scalar_one_or_none()
    
    if not manager:
        raise HTTPException(status_code=401, detail="Неверный логин или пароль")
        
    # Генерируем настоящий JWT токен
    token = jwt.encode(
        {"sub": str(manager.id), "role": manager.role, "name": manager.name}, 
        SECRET_KEY, 
        algorithm=ALGORITHM
    )
    
    return {
        "token": token,
        "name": manager.name,
        "role": manager.role
    }

# 2. ЗАЩИЩЕННОЕ ПОЛУЧЕНИЕ ЧАТОВ (Только с токеном)
@app.get("/api/manager/chats/active")
async def get_active_chats(authorization: str = Header(None), db: AsyncSession = Depends(get_db)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Отсутствует токен")
    
    token = authorization.split(" ")[1]
    try:
        jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except:
        raise HTTPException(status_code=401, detail="Неверный токен")

    result = await db.execute(select(ChatSession).where(ChatSession.status == "open").order_by(ChatSession.created_at.desc()))
    sessions = result.scalars().all()
    
    chat_list = []
    for s in sessions:
        # 👇 Считаем, сколько всего сообщений написал пациент в этом чате
        msg_res = await db.execute(select(ChatMessage).where(ChatMessage.session_id == s.id, ChatMessage.sender == "client"))
        client_msg_count = len(msg_res.scalars().all())
        
        chat_list.append({
            "session_token": s.session_token,
            "name": s.user_name,
            "phone": s.user_phone,
            "time": s.created_at.strftime("%H:%M"),
            "manager_id": s.manager_id,
            "manager_name": s.manager_name,
            "msg_count": client_msg_count # <--- ПЕРЕДАЕМ ЭТУ ЦИФРУ В REACT
        })
        
    return chat_list

# 3. ПРИНЯТЬ ЧАТ В РАБОТУ
@app.post("/api/manager/chats/{session_token}/accept")
async def accept_chat(session_token: str, authorization: str = Header(None), db: AsyncSession = Depends(get_db)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401)
    
    token_str = authorization.split(" ")[1]
    try:
        payload = jwt.decode(token_str, SECRET_KEY, algorithms=[ALGORITHM])
        manager_id = int(payload.get("sub"))
        manager_name = payload.get("name")
    except Exception:
        raise HTTPException(status_code=401)

    result = await db.execute(select(ChatSession).where(ChatSession.session_token == session_token))
    session = result.scalar_one_or_none()
    
    if not session:
        raise HTTPException(status_code=404, detail="Чат не найден")
        
    # Блокировка: если чат уже занят ДРУГИМ менеджером
    if session.manager_id and session.manager_id != manager_id:
        raise HTTPException(status_code=400, detail=f"Чат уже принял(а) {session.manager_name}")

    # Присваиваем чат текущему менеджеру
    session.manager_id = manager_id
    session.manager_name = manager_name
    await db.commit()
    
    # Уведомляем пациента в сокет
    from datetime import datetime
    await chat_manager.broadcast_to_session(session_token, {
        "sender": "system",
        "text": "К диалогу подключился специалист. Пожалуйста, ожидайте ответа.",
        "timestamp": datetime.now().strftime("%H:%M")
    })
    
    return {"status": "success"}

# 4. ПОЛУЧЕНИЕ ИСТОРИИ ВСЕХ ЧАТОВ ДЛЯ АДМИНА
@app.get("/api/admin/chats/history")
async def get_all_chats_history(authorization: str = Header(None), db: AsyncSession = Depends(get_db)):
    # 1. Проверяем наличие токена
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Отсутствует токен")
    
    # 2. Расшифровываем токен и проверяем роль
    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("role") != "admin":
            raise HTTPException(status_code=403, detail="Доступ запрещен. Только для администраторов.")
    except Exception:
        raise HTTPException(status_code=401, detail="Неверный токен")

    # 3. Если всё ок, отдаем историю
    result = await db.execute(select(ChatSession).order_by(ChatSession.created_at.desc()))
    sessions = result.scalars().all()
    
    return [{
        "session_token": s.session_token,
        "name": s.user_name,
        "phone": s.user_phone,
        "status": s.status,
        "manager_name": s.manager_name or "Не назначен",
        "date": s.created_at.strftime("%d.%m.%Y"),
        "time": s.created_at.strftime("%H:%M")
    } for s in sessions]

# Убедитесь, что папка для документов создается
DOCS_DIR = os.path.join(UPLOADS_DIR, "docs")
if not os.path.exists(DOCS_DIR):
    os.makedirs(DOCS_DIR)