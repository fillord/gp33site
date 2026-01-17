import asyncio
from database import init_models

if __name__ == "__main__":
    # Запускаем создание таблиц
    asyncio.run(init_models())
    print("✅ Таблицы (reviews, news, videos, schedule) успешно созданы в gp33.db!")