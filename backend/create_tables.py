import asyncio
import os
from database import init_models, engine

if os.name == 'nt':
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

async def main():
    print(f"Создаем таблицы в базе...")
    await init_models()
    print("✅ Готово! Таблицы созданы.")
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(main())