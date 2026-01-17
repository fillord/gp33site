import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base

# === ГЛАВНОЕ ИСПРАВЛЕНИЕ ===
# Получаем точный путь к папке, где лежит этот скрипт (папка backend)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# Указываем, что база лежит именно здесь
DB_PATH = os.path.join(BASE_DIR, "gp33.db")

# Создаем URL для подключения
DATABASE_URL = f"sqlite+aiosqlite:///{DB_PATH}"
# ============================

engine = create_async_engine(DATABASE_URL, echo=False)

async_session = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

Base = declarative_base()

async def get_db():
    async with async_session() as session:
        yield session

async def init_models():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)