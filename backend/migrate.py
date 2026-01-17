import json
import asyncio
import os

# Убрали приставку 'backend.', так как запускаем из той же папки
from database import init_models, async_session
from models import News, Review, Video, Schedule

async def migrate():
    # Создаем таблицы
    await init_models()
    
    # Ищем файл database.json в текущей папке
    if os.path.exists("database.json"):
        json_path = "database.json"
    elif os.path.exists("../backend/database.json"): # На случай запуска из корня
        json_path = "../backend/database.json"
    else:
        print("⚠️ Файл database.json не найден. База данных будет пустой.")
        return

    try:
        with open(json_path, "r", encoding="utf-8") as f:
            data = json.load(f)
    except Exception as e:
        print(f"Ошибка чтения JSON: {e}")
        return

    async with async_session() as session:
        # 1. Новости
        news_list = data.get("news", [])
        if news_list:
            print(f"Переносим новости ({len(news_list)} шт)...")
            for n in news_list:
                session.add(News(
                    title=n.get("title"), 
                    titleKz=n.get("titleKz"),
                    text=n.get("text"), 
                    textKz=n.get("textKz"),
                    date=n.get("date"), 
                    image=n.get("image")
                ))
        
        # 2. Отзывы
        reviews_list = data.get("reviews", [])
        if reviews_list:
            print(f"Переносим отзывы ({len(reviews_list)} шт)...")
            for r in reviews_list:
                session.add(Review(
                    name=r.get("name"), 
                    text=r.get("text"),
                    textKz=r.get("textKz"), 
                    date=r.get("date"),
                    approved=r.get("approved", False)
                ))

        # 3. Видео
        videos_list = data.get("videos", [])
        if videos_list:
            print(f"Переносим видео ({len(videos_list)} шт)...")
            for v in videos_list:
                session.add(Video(
                    title=v.get("title"),
                    titleKz=v.get("titleKz"),
                    url=v.get("url")
                ))
        
        # 4. График (если есть в JSON)
        schedule_list = data.get("schedule", [])
        if schedule_list:
            print(f"Переносим график ({len(schedule_list)} сотрудников)...")
            for s in schedule_list:
                session.add(Schedule(
                    name=s.get("name"),
                    role=s.get("role"),
                    cabinet=s.get("cabinet"),
                    dept=s.get("dept"),
                    mon=s.get("mon"),
                    tue=s.get("tue"),
                    wed=s.get("wed"),
                    thu=s.get("thu"),
                    fri=s.get("fri")
                ))

        await session.commit()
        print("✅ Миграция завершена! Данные сохранены в gp33.db")

if __name__ == "__main__":
    if os.name == 'nt':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(migrate())