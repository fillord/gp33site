from sqlalchemy import Column, Integer, String, Boolean, Text, ForeignKey, DateTime
from database import Base
from sqlalchemy.orm import relationship
from datetime import datetime

class Review(Base):
    __tablename__ = "reviews"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    text = Column(Text)
    textKz = Column(Text, nullable=True)
    date = Column(String)
    approved = Column(Boolean, default=False)

class News(Base):
    __tablename__ = "news"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    titleKz = Column(String)
    text = Column(Text)
    textKz = Column(Text)
    date = Column(String)
    image = Column(String, nullable=True)

class Video(Base):
    __tablename__ = "videos"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    titleKz = Column(String)
    url = Column(String)

class Schedule(Base):
    __tablename__ = "schedule"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    role = Column(String)
    cabinet = Column(String)
    dept = Column(String, nullable=True)
    mon = Column(String)
    tue = Column(String)
    wed = Column(String)
    thu = Column(String)
    fri = Column(String)

class Vacancy(Base):
    __tablename__ = "vacancies"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)       # Заголовок (напр. "Врач-терапевт")
    text = Column(Text)          # Описание
    salary = Column(String)      # Зарплата (напр. "от 150 000 тг")
    date = Column(String)        # Дата публикации

class Appeal(Base):
    __tablename__ = "appeals"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    phone = Column(String)           # Телефон (виден только админу)
    category = Column(String)        # 'thanks', 'complaint', 'proposal'
    text = Column(Text)
    date = Column(String)
    approved = Column(Boolean, default=False) # По умолчанию скрыто

class Document(Base):
    __tablename__ = "documents"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)       # Отображаемое имя (например "Отчет за 2023")
    file_path = Column(String)   # Путь к файлу (/uploads/docs/file.pdf)
    file_type = Column(String)   # Расширение (pdf, docx, xlsx)
    category = Column(String)    # Ключ страницы (about_income, corp_docs и т.д.)
    date = Column(String)        # Дата загрузки

class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id = Column(Integer, primary_key=True, index=True)
    session_token = Column(String, unique=True, index=True)
    user_name = Column(String)
    user_phone = Column(String)
    status = Column(String, default="open")
    created_at = Column(DateTime, default=datetime.now)
    
    # НОВЫЕ КОЛОНКИ:
    manager_id = Column(Integer, nullable=True) # ID менеджера, который принял чат
    manager_name = Column(String, nullable=True) # Имя менеджера

    messages = relationship("ChatMessage", back_populates="session", cascade="all, delete-orphan")

class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("chat_sessions.id"))
    sender = Column(String) # "client" или "manager"
    text = Column(Text)
    timestamp = Column(DateTime, default=datetime.now)

    session = relationship("ChatSession", back_populates="messages")

class ChatManager(Base):
    __tablename__ = "chat_managers"

    id = Column(Integer, primary_key=True, index=True)
    telegram_id = Column(String, unique=True, index=True, nullable=True) # Теперь не обязателен
    username = Column(String, unique=True, index=True, nullable=True) # ЛОГИН
    password = Column(String, nullable=True) # ПАРОЛЬ
    name = Column(String)
    role = Column(String, default="manager")