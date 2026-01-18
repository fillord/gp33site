import json
import logging
import pandas as pd
import os
import uuid

from sqlalchemy import select, delete, update as sql_update
from database import async_session
# ИМПОРТИРУЕМ Appeal
from models import News, Video, Review, Schedule, Vacancy, Appeal, Document
from dotenv import load_dotenv
from telegram import Update, ReplyKeyboardMarkup, ReplyKeyboardRemove, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import (
    ApplicationBuilder, 
    ContextTypes, 
    CommandHandler, 
    MessageHandler, 
    filters, 
    ConversationHandler, 
    CallbackQueryHandler,
    Defaults
)
from telegram.constants import ParseMode

load_dotenv()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
BOT_TOKEN = os.getenv("BOT_TOKEN")
ADMIN_CHAT_ID = os.getenv("ADMIN_CHAT_ID")
UPLOADS_DIR = os.path.join(BASE_DIR, "uploads")

if not BOT_TOKEN:
    print("Ошибка: BOT_TOKEN не найден в .env файле!")

logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)

# === СОСТОЯНИЯ ===
CHOOSING_ACTION = 0
NEWS_TITLE_RU = 1
NEWS_TITLE_KZ = 2
NEWS_TEXT_RU = 3
NEWS_TEXT_KZ = 4
NEWS_PHOTO = 5   
VIDEO_TITLE_RU = 6
VIDEO_TITLE_KZ = 7
VIDEO_URL = 8
WAITING_SCHEDULE = 9
WAITING_VACANCY_TITLE, WAITING_VACANCY_SALARY, WAITING_VACANCY_TEXT = range(10, 13)
DOC_CATEGORY_SELECT, DOC_ACTION, DOC_UPLOAD_FILE, DOC_TITLE_INPUT = range(13, 17)

# === КЛАВИАТУРЫ ===
# MAIN_MENU_MARKUP = ReplyKeyboardMarkup([
#     ["📅 Обновить график"],
#     ["📰 Добавить новость", "🎥 Добавить видео"],
#     ["📋 Список новостей", "📋 Список видео"],
#     ["📋 Список вакансий", ""],
#     ["💬 Список отзывов"]
# ], resize_keyboard=True)

DOC_CATEGORIES = {
    "💰 Доходы и расходы": "about_income",
    "🏛 Госзакуп": "about_procurement",
    "📊 Годовой отчет": "about_annual",
    "⚖️ Нормативные акты": "about_docs_normative",
    "📂 Корпоративные док.": "corp_docs",
    "📜 Лицензии": "corp_licenses",
    "📝 Протокола": "protocols"
}
DOC_CATS_REVERSE = {v: k for k, v in DOC_CATEGORIES.items()}

MAIN_MENU_MARKUP = ReplyKeyboardMarkup([ 
    ["📰 Добавить новость", "📋 Список новостей"],
    ["🎥 Добавить видео", "📋 Список видео"],
    ["💼 Вакансии (Добавить)", "📋 Список вакансий"], 
    ["📅 Обновить график","💬 Список отзывов", "📋 Обращения"],
    ["📂 Управление документами"]
], resize_keyboard=True)

# Меню выбора категорий документов
doc_buttons = list(DOC_CATEGORIES.keys())
# Разбиваем по 2 кнопки в ряд
rows = [doc_buttons[i:i + 2] for i in range(0, len(doc_buttons), 2)]
rows.append(["❌ Отмена"])
DOC_CATS_MARKUP = ReplyKeyboardMarkup(rows, resize_keyboard=True)

DOC_ACTIONS_MARKUP = ReplyKeyboardMarkup([
    ["📤 Загрузить файл"],
    ["⬅️ Назад к категориям"],
    ["❌ Главное меню"]
], resize_keyboard=True)

SKIP_TITLE_MARKUP = ReplyKeyboardMarkup([
    ["👌 Оставить имя файла"],
    ["❌ Отмена"]
], resize_keyboard=True)

CANCEL_MARKUP = ReplyKeyboardMarkup([["❌ Отмена"]], resize_keyboard=True)
PHOTO_MARKUP = ReplyKeyboardMarkup([["⏭ Пропустить фото"], ["❌ Отмена"]], resize_keyboard=True)


# === СТАРТ И ОТМЕНА ===
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if str(update.effective_chat.id) != str(ADMIN_CHAT_ID):
        await update.message.reply_text("⛔ Доступ запрещен.")
        return ConversationHandler.END
    
    context.user_data.clear()
    await update.message.reply_text("👋 Привет, Админ! Меню готово.", reply_markup=MAIN_MENU_MARKUP)
    return CHOOSING_ACTION

async def cancel(update: Update, context: ContextTypes.DEFAULT_TYPE):
    context.user_data.clear()
    await update.message.reply_text("❌ Действие отменено.", reply_markup=MAIN_MENU_MARKUP)
    return CHOOSING_ACTION

# === ВЫБОР ДЕЙСТВИЯ ===
async def choose_action(update: Update, context: ContextTypes.DEFAULT_TYPE):
    text = update.message.text
    
    if text == "📰 Добавить новость":
        await update.message.reply_text("🇷🇺 Шаг 1/5: Введите заголовок (RU):", reply_markup=CANCEL_MARKUP)
        return NEWS_TITLE_RU
    elif text == "📅 Обновить график":
        await update.message.reply_text("📤 Отправьте Excel-файл (.xlsx)...", reply_markup=CANCEL_MARKUP)
        return WAITING_SCHEDULE
    elif text == "🎥 Добавить видео":
        await update.message.reply_text("🇷🇺 Шаг 1/3: Введите название видео (RU):", reply_markup=CANCEL_MARKUP)
        return VIDEO_TITLE_RU
        
    # СПИСКИ
    elif text == "💬 Список отзывов":
        await show_list(update, "reviews", "Отзывы")
        return CHOOSING_ACTION
    elif text == "📋 Список новостей":
        await show_list(update, "news", "Новости")
        return CHOOSING_ACTION
    elif text == "📋 Список видео":
        await show_list(update, "videos", "Видео")
        return CHOOSING_ACTION
    elif text == "📋 Список вакансий": # Добавлено для вакансий, если не было
        await list_vacancies(update, context) # Используем спец функцию или show_list
        return CHOOSING_ACTION
    
    # НОВОЕ: СПИСОК ОБРАЩЕНИЙ
    elif text == "📋 Обращения":
        await show_list(update, "appeals", "Обращения (Благодарности/Жалобы)")
        return CHOOSING_ACTION
        
    else:
        await update.message.reply_text("Используйте кнопки меню.", reply_markup=MAIN_MENU_MARKUP)
        return CHOOSING_ACTION

# === НОВОСТИ (ШАГИ) ===
async def news_title_ru(update: Update, context: ContextTypes.DEFAULT_TYPE):
    context.user_data['n_title_ru'] = update.message.text
    await update.message.reply_text("🇰🇿 Шаг 2/5: Заголовок (KZ):", reply_markup=CANCEL_MARKUP)
    return NEWS_TITLE_KZ

async def news_title_kz(update: Update, context: ContextTypes.DEFAULT_TYPE):
    context.user_data['n_title_kz'] = update.message.text
    await update.message.reply_text("🇷🇺 Шаг 3/5: Текст новости (RU):", reply_markup=CANCEL_MARKUP)
    return NEWS_TEXT_RU

async def news_text_ru(update: Update, context: ContextTypes.DEFAULT_TYPE):
    context.user_data['n_text_ru'] = update.message.text
    await update.message.reply_text("🇰🇿 Шаг 4/5: Текст новости (KZ):", reply_markup=CANCEL_MARKUP)
    return NEWS_TEXT_KZ

async def news_text_kz(update: Update, context: ContextTypes.DEFAULT_TYPE):
    context.user_data['n_text_kz'] = update.message.text
    await update.message.reply_text(
        "📸 Шаг 5/5: Отправьте ФОТО.\n(Можно как фото или как файл). Или нажмите пропустить.", 
        reply_markup=PHOTO_MARKUP
    )
    return NEWS_PHOTO

async def news_photo_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    photo_file = None
    if update.message.photo:
        photo_file = await update.message.photo[-1].get_file()
    elif update.message.document and 'image' in update.message.document.mime_type:
        photo_file = await update.message.document.get_file()
    
    if photo_file:
        file_name = f"news_{uuid.uuid4()}.jpg"
        save_path = os.path.join(UPLOADS_DIR, file_name)
        if not os.path.exists(UPLOADS_DIR): os.makedirs(UPLOADS_DIR)
        
        await photo_file.download_to_drive(save_path)
        photo_path = f"/uploads/{file_name}"
        await save_news(update, context, photo_path)
        return CHOOSING_ACTION
    
    await update.message.reply_text("⚠️ Пожалуйста, отправьте ФОТО или нажмите кнопку 'Пропустить'.")
    return NEWS_PHOTO

async def news_skip_photo(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await save_news(update, context, None)
    return CHOOSING_ACTION

async def save_news(update, context, image_path):
    async with async_session() as session:
        new_news = News(
            title=context.user_data.get('n_title_ru', 'Без заголовка'),
            titleKz=context.user_data.get('n_title_kz', 'Без заголовка'),
            text=context.user_data.get('n_text_ru', ''),
            textKz=context.user_data.get('n_text_kz', ''),
            date=update.message.date.strftime("%d.%m.%Y"),
            image=image_path
        )
        session.add(new_news)
        await session.commit()
    
    await update.message.reply_text("✅ Новость опубликована!", reply_markup=MAIN_MENU_MARKUP)

# === ВИДЕО (ШАГИ) ===
async def video_title_ru(update: Update, context: ContextTypes.DEFAULT_TYPE):
    context.user_data['v_title_ru'] = update.message.text
    await update.message.reply_text("🇰🇿 Шаг 2/3: Название видео (KZ):", reply_markup=CANCEL_MARKUP)
    return VIDEO_TITLE_KZ

async def video_title_kz(update: Update, context: ContextTypes.DEFAULT_TYPE):
    context.user_data['v_title_kz'] = update.message.text
    await update.message.reply_text("🔗 Шаг 3/3: Ссылка на YouTube:", reply_markup=CANCEL_MARKUP)
    return VIDEO_URL

async def video_finish(update: Update, context: ContextTypes.DEFAULT_TYPE):
    async with async_session() as session:
        new_video = Video(
            title=context.user_data.get('v_title_ru'),
            titleKz=context.user_data.get('v_title_kz'),
            url=update.message.text
        )
        session.add(new_video)
        await session.commit()

    await update.message.reply_text("✅ Видео добавлено!", reply_markup=MAIN_MENU_MARKUP)
    return CHOOSING_ACTION

async def handle_schedule_upload(update: Update, context: ContextTypes.DEFAULT_TYPE):
    document = update.message.document
    
    if not document.file_name.endswith('.xlsx'):
        await update.message.reply_text("⚠️ Нужен файл .xlsx")
        return WAITING_SCHEDULE

    file = await document.get_file()
    file_path = "temp_schedule.xlsx"
    await file.download_to_drive(file_path)
    
    try:
        df_raw = pd.read_excel(file_path, header=None)
        header_row_index = -1
        for i, row in df_raw.iterrows():
            if row.astype(str).str.contains("ФИО").any():
                header_row_index = i
                break
        
        if header_row_index == -1:
            await update.message.reply_text("❌ В файле не найдена строка с заголовком 'ФИО'.")
            return WAITING_SCHEDULE

        df = pd.read_excel(file_path, header=header_row_index)
        df.columns = df.columns.astype(str).str.strip()
        
        rename_map = {
            'ФИО': 'name', 
            'Должность': 'role', 
            'Кабинет': 'cabinet',
            'Отделение': 'dept',
            'ПН': 'mon', 'ВТ': 'tue', 'СР': 'wed', 'ЧТ': 'thu', 'ПТ': 'fri'
        }
        df.rename(columns=rename_map, inplace=True)
        
        if 'name' not in df.columns:
            await update.message.reply_text("❌ Ошибка: не удалось распознать колонку 'ФИО'.")
            return WAITING_SCHEDULE

        df = df.dropna(subset=['name'])
        df = df.fillna("-").astype(str)
        
        async with async_session() as session:
            await session.execute(delete(Schedule))
            count = 0
            for _, row in df.iterrows():
                doctor = Schedule(
                    name=str(row.get('name', '-')),
                    role=str(row.get('role', '-')),
                    cabinet=str(row.get('cabinet', '-')),
                    dept=str(row.get('dept', '-')),
                    mon=str(row.get('mon', '-')),
                    tue=str(row.get('tue', '-')),
                    wed=str(row.get('wed', '-')),
                    thu=str(row.get('thu', '-')),
                    fri=str(row.get('fri', '-'))
                )
                session.add(doctor)
                count += 1
            await session.commit()
        
        await update.message.reply_text(f"✅ График обновлен! ({count} врачей)", reply_markup=MAIN_MENU_MARKUP)
        
    except Exception as e:
        await update.message.reply_text(f"❌ Ошибка: {e}")
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)
    return CHOOSING_ACTION

# === ВАКАНСИИ ===
async def start_vacancy(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("💼 Введите название вакансии:", reply_markup=CANCEL_MARKUP)
    return WAITING_VACANCY_TITLE

async def vacancy_title(update: Update, context: ContextTypes.DEFAULT_TYPE):
    context.user_data['vac_title'] = update.message.text
    await update.message.reply_text("💰 Укажите зарплату:", reply_markup=CANCEL_MARKUP)
    return WAITING_VACANCY_SALARY

async def vacancy_salary(update: Update, context: ContextTypes.DEFAULT_TYPE):
    context.user_data['vac_salary'] = update.message.text
    await update.message.reply_text("📝 Описание вакансии:", reply_markup=CANCEL_MARKUP)
    return WAITING_VACANCY_TEXT

async def vacancy_finish(update: Update, context: ContextTypes.DEFAULT_TYPE):
    text = update.message.text
    async with async_session() as session:
        new_vac = Vacancy(
            title=context.user_data['vac_title'],
            salary=context.user_data['vac_salary'],
            text=text,
            date=update.message.date.strftime("%d.%m.%Y")
        )
        session.add(new_vac)
        await session.commit()
    await update.message.reply_text("✅ Вакансия опубликована!", reply_markup=MAIN_MENU_MARKUP)
    return CHOOSING_ACTION

async def list_vacancies(update: Update, context: ContextTypes.DEFAULT_TYPE):
    async with async_session() as session:
        result = await session.execute(select(Vacancy).order_by(Vacancy.id.desc()))
        items = result.scalars().all()

    if not items:
        await update.message.reply_text("📭 Вакансий нет.")
        return CHOOSING_ACTION

    await update.message.reply_text("💼 Актуальные вакансии:")
    for v in items:
        msg = f"🆔 {v.id}\n📌 {v.title}\n💰 {v.salary}\n📝 {v.text}"
        keyboard = [[InlineKeyboardButton("🗑 Удалить", callback_data=f"delete_vacancies_{v.id}")]]
        await update.message.reply_text(msg, reply_markup=InlineKeyboardMarkup(keyboard))
    return CHOOSING_ACTION

async def show_list(update, category, title_ru):
    async with async_session() as session:
        model = None
        if category == "reviews": model = Review
        elif category == "news": model = News
        elif category == "videos": model = Video
        elif category == "appeals": model = Appeal
        
        result = await session.execute(select(model).order_by(model.id.desc()).limit(10))
        items = result.scalars().all()
        
    if not items:
        await update.message.reply_text("📭 Список пуст.")
        return
        
    await update.message.reply_text(f"📂 {title_ru} (последние 10):")
    for item in items:
        info = f"🆔 {item.id}\n"
        
        if category == 'news': 
            info += f"📰 {item.title}"
        elif category == 'videos': 
            info += f"🎥 {item.title}"
        elif category == 'reviews': 
            info += f"👤 {item.name}: {item.text[:50]}..."
        elif category == 'appeals':
            # Специфичный вывод для обращений
            status = "✅ Опубликовано" if item.approved else "⏳ На проверке"
            cat_icon = {"thanks": "🙏", "complaint": "😡", "proposal": "💡"}.get(item.category, "❓")
            info += f"{cat_icon} {status}\n👤 {item.name}\n📝 {item.text[:100]}..."
                    
        keyboard = [[InlineKeyboardButton("🗑 Удалить", callback_data=f"delete_{category}_{item.id}")]]
        await update.message.reply_text(info, reply_markup=InlineKeyboardMarkup(keyboard))

# === ВХОД В РАЗДЕЛ ДОКУМЕНТОВ ===
async def docs_start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "📂 <b>Раздел документов</b>\nВыберите категорию сайта, куда хотите добавить или удалить документ:", 
        reply_markup=DOC_CATS_MARKUP,
        parse_mode="HTML"
    )
    return DOC_CATEGORY_SELECT

# === ВЫБОР КАТЕГОРИИ ===
async def docs_category_chosen(update: Update, context: ContextTypes.DEFAULT_TYPE):
    text = update.message.text
    if text not in DOC_CATEGORIES:
        await update.message.reply_text("Выберите категорию из меню.", reply_markup=DOC_CATS_MARKUP)
        return DOC_CATEGORY_SELECT
    
    cat_code = DOC_CATEGORIES[text]
    context.user_data['doc_category_code'] = cat_code
    context.user_data['doc_category_name'] = text
    
    # Сразу показываем список текущих документов с кнопками удаления
    await show_docs_list(update, cat_code, text)
    
    await update.message.reply_text(
        f"Выбрана категория: <b>{text}</b>.\n"
        "Чтобы добавить новый документ, нажмите кнопку ниже.",
        reply_markup=DOC_ACTIONS_MARKUP,
        parse_mode="HTML"
    )
    return DOC_ACTION

# === СПИСОК ДОКУМЕНТОВ ===
async def show_docs_list(update, cat_code, cat_name):
    async with async_session() as session:
        result = await session.execute(
            select(Document).where(Document.category == cat_code).order_by(Document.id.desc())
        )
        docs = result.scalars().all()
        
    if not docs:
        await update.message.reply_text(f"📭 В категории «{cat_name}» пока нет документов.")
    else:
        await update.message.reply_text(f"📂 Документы в «{cat_name}»:")
        for doc in docs:
            # Иконка по типу
            icon = "📄"
            if "pdf" in doc.file_type: icon = "📕"
            elif "xls" in doc.file_type: icon = "📊"
            elif "doc" in doc.file_type: icon = "📘"

            msg = f"{icon} <b>{doc.title}</b>\n🗓 {doc.date}"
            
            keyboard = [[InlineKeyboardButton("🗑 Удалить", callback_data=f"delete_doc_{doc.id}")]]
            await update.message.reply_text(msg, reply_markup=InlineKeyboardMarkup(keyboard), parse_mode="HTML")

# === ОБРАБОТКА ДЕЙСТВИЯ ===
async def docs_action(update: Update, context: ContextTypes.DEFAULT_TYPE):
    text = update.message.text
    if text == "📤 Загрузить файл":
        await update.message.reply_text(
            "📎 Отправьте мне файл (PDF, Word, Excel, Картинку).",
            reply_markup=CANCEL_MARKUP
        )
        return DOC_UPLOAD_FILE
    elif text == "⬅️ Назад к категориям":
        return await docs_start(update, context)
    else:
        # Если нажали "Главное меню" или что-то левое
        return await start(update, context)

# === ЗАГРУЗКА ФАЙЛА ===
async def docs_file_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    # Получаем файл (документ или фото)
    file_obj = None
    file_name = "unknown_file"
    file_mime = ""
    
    if update.message.document:
        doc = update.message.document
        file_obj = await doc.get_file()
        file_name = doc.file_name
        file_mime = doc.mime_type
    elif update.message.photo:
        file_obj = await update.message.photo[-1].get_file()
        file_name = f"image_{uuid.uuid4()}.jpg"
        file_mime = "image/jpeg"
    else:
        await update.message.reply_text("⚠️ Это не файл. Пожалуйста, прикрепите документ.")
        return DOC_UPLOAD_FILE

    # Скачиваем
    save_dir = os.path.join(UPLOADS_DIR, "docs")
    if not os.path.exists(save_dir): os.makedirs(save_dir)
    
    # Генерируем уникальное имя, чтобы не перезатереть
    ext = os.path.splitext(file_name)[1]
    safe_name = f"{uuid.uuid4()}{ext}"
    file_path = os.path.join(save_dir, safe_name)
    
    await file_obj.download_to_drive(file_path)
    
    # Сохраняем во временное хранилище
    context.user_data['new_doc_path'] = f"/uploads/docs/{safe_name}"
    context.user_data['new_doc_ext'] = ext.replace(".", "").upper()
    context.user_data['new_doc_original_name'] = file_name

    await update.message.reply_text(
        f"✅ Файл получен: {file_name}\n"
        "Введите красивое название для сайта (или нажмите «Оставить имя файла»):",
        reply_markup=SKIP_TITLE_MARKUP
    )
    return DOC_TITLE_INPUT

# === НАЗВАНИЕ И СОХРАНЕНИЕ ===
async def docs_save_finish(update: Update, context: ContextTypes.DEFAULT_TYPE):
    text = update.message.text
    
    final_title = text
    if text == "👌 Оставить имя файла":
        final_title = context.user_data['new_doc_original_name']
    
    cat_code = context.user_data['doc_category_code']
    
    async with async_session() as session:
        new_doc = Document(
            title=final_title,
            file_path=context.user_data['new_doc_path'],
            file_type=context.user_data['new_doc_ext'],
            category=cat_code,
            date=update.message.date.strftime("%d.%m.%Y")
        )
        session.add(new_doc)
        await session.commit()
    
    await update.message.reply_text("✅ Документ опубликован!", reply_markup=DOC_ACTIONS_MARKUP)
    
    # Обновляем список, чтобы админ увидел результат
    await show_docs_list(update, cat_code, context.user_data['doc_category_name'])
    
    return DOC_ACTION


# === ОБРАБОТЧИК КНОПОК ===
async def callback_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    parts = query.data.split("_")
    action = parts[0]
    
    async with async_session() as session:
        # 1. ПУБЛИКАЦИЯ ОБРАЩЕНИЯ (Appeals)
        if action == "pub":
            iid = int(parts[1])
            await session.execute(sql_update(Appeal).where(Appeal.id == iid).values(approved=True))
            await session.commit()
            await query.edit_message_text("✅ Обращение опубликовано на сайте.")
            
        # 2. ОДОБРЕНИЕ ОТЗЫВА (Reviews)
        elif action == "approve":
            iid = int(parts[1])
            await session.execute(sql_update(Review).where(Review.id == iid).values(approved=True))
            await session.commit()
            await query.edit_message_text("✅ Одобрено.")
            
        # 3. УДАЛЕНИЕ (УНИВЕРСАЛЬНОЕ)
        elif action == "reject" or action == "delete":
            # Спец. логика для документов: удаляем файл с диска
            if action == "delete" and len(parts) > 2 and parts[1] == "doc":
                doc_id = int(parts[2])
                # Ищем документ, чтобы узнать путь
                res = await session.execute(select(Document).where(Document.id == doc_id))
                doc = res.scalar_one_or_none()
                
                if doc:
                    # Удаляем файл физически
                    try:
                        # doc.file_path начинается с /uploads/..., убираем слеш для os.path.join
                        relative_path = doc.file_path.lstrip("/")
                        full_path = os.path.join(BASE_DIR, relative_path)
                        if os.path.exists(full_path):
                            os.remove(full_path)
                    except Exception as e:
                        print(f"Ошибка удаления файла с диска: {e}")

                    # Удаляем запись из БД
                    await session.delete(doc)
                    await session.commit()
                    await query.edit_message_text("🗑 Документ удален.")
                else:
                    await query.edit_message_text("❌ Документ уже удален.")
                return

            # Логика для остальных (News, Video, Review, Vacancy, Appeal)
            # Форматы: 
            #   reject_{id} (только отзывы) -> cat="reviews"
            #   delete_{cat}_{id} (остальные)
            
            if action == "delete":
                cat = parts[1]
                iid = int(parts[2])
            else:
                cat = "reviews"
                iid = int(parts[1])
            
            model = None
            if cat == "reviews": model = Review
            elif cat == "news": model = News
            elif cat == "videos": model = Video
            elif cat == "vacancies": model = Vacancy
            elif cat == "appeals": model = Appeal
            
            if model:
                await session.execute(delete(model).where(model.id == iid))
                await session.commit()
                msg = "❌ Отклонено." if action == "reject" else "🗑 Удалено."
                # Пытаемся редактировать, если сообщение не слишком старое
                try:
                    await query.edit_message_text(msg)
                except Exception:
                    pass

# === ЗАПУСК ===
if __name__ == "__main__":
    app = (
        ApplicationBuilder()
        .token(BOT_TOKEN)
        .read_timeout(30)
        .write_timeout(30)
        .connect_timeout(30)
        .pool_timeout(30)
        .build()
    )
    
    # Фильтры
    cancel_filter = filters.Regex("^❌ Отмена$")
    skip_filter = filters.Regex("^⏭ Пропустить фото$")
    # Фильтр для входа в меню документов
    docs_filter = filters.Regex("^📂 Управление документами$")

    conv_handler = ConversationHandler(
        entry_points=[
            CommandHandler('start', start),
            MessageHandler(filters.Regex("^💼 Вакансии"), start_vacancy),
            MessageHandler(filters.Regex("^📋 Список вакансий"), list_vacancies),
            # Вход в управление документами
            MessageHandler(docs_filter, docs_start),
        ],
        states={
            # ГЛАВНОЕ МЕНЮ
            CHOOSING_ACTION: [MessageHandler(filters.TEXT & ~filters.COMMAND & ~cancel_filter, choose_action)],
            
            # ГРАФИК
            WAITING_SCHEDULE: [
                MessageHandler(filters.Document.FileExtension("xlsx"), handle_schedule_upload),
                MessageHandler(cancel_filter, cancel)
            ],
            
            # НОВОСТИ
            NEWS_TITLE_RU: [MessageHandler(filters.TEXT & ~filters.COMMAND & ~cancel_filter, news_title_ru)],
            NEWS_TITLE_KZ: [MessageHandler(filters.TEXT & ~filters.COMMAND & ~cancel_filter, news_title_kz)],
            NEWS_TEXT_RU:  [MessageHandler(filters.TEXT & ~filters.COMMAND & ~cancel_filter, news_text_ru)],
            NEWS_TEXT_KZ:  [MessageHandler(filters.TEXT & ~filters.COMMAND & ~cancel_filter, news_text_kz)],
            NEWS_PHOTO: [
                MessageHandler(filters.PHOTO, news_photo_handler),
                MessageHandler(filters.Document.IMAGE, news_photo_handler), 
                MessageHandler(skip_filter, news_skip_photo),
                MessageHandler(filters.ALL & ~cancel_filter, news_photo_handler)
            ],
            
            # ВИДЕО
            VIDEO_TITLE_RU: [MessageHandler(filters.TEXT & ~filters.COMMAND & ~cancel_filter, video_title_ru)],
            VIDEO_TITLE_KZ: [MessageHandler(filters.TEXT & ~filters.COMMAND & ~cancel_filter, video_title_kz)],
            VIDEO_URL:      [MessageHandler(filters.TEXT & ~filters.COMMAND & ~cancel_filter, video_finish)],

            # ВАКАНСИИ
            WAITING_VACANCY_TITLE: [MessageHandler(filters.TEXT & ~filters.COMMAND & ~cancel_filter, vacancy_title)],
            WAITING_VACANCY_SALARY: [MessageHandler(filters.TEXT & ~filters.COMMAND & ~cancel_filter, vacancy_salary)],
            WAITING_VACANCY_TEXT: [MessageHandler(filters.TEXT & ~filters.COMMAND & ~cancel_filter, vacancy_finish)],

            # === ДОКУМЕНТЫ (НОВОЕ) ===
            DOC_CATEGORY_SELECT: [
                MessageHandler(filters.TEXT & ~filters.COMMAND & ~cancel_filter, docs_category_chosen)
            ],
            DOC_ACTION: [
                MessageHandler(filters.TEXT & ~filters.COMMAND & ~cancel_filter, docs_action)
            ],
            DOC_UPLOAD_FILE: [
                # Принимаем документы ИЛИ фото (если это скан)
                MessageHandler(filters.Document.ALL | filters.PHOTO, docs_file_handler),
                MessageHandler(cancel_filter, cancel)
            ],
            DOC_TITLE_INPUT: [
                MessageHandler(filters.TEXT & ~filters.COMMAND & ~cancel_filter, docs_save_finish)
            ],
        },
        fallbacks=[
            CommandHandler('cancel', cancel),
            MessageHandler(cancel_filter, cancel)
        ],
        allow_reentry=True
    )
    
    app.add_handler(conv_handler)
    app.add_handler(CallbackQueryHandler(callback_handler))
    
    print("Бот перезапущен (v4 - Documents & Appeals)...")
    app.run_polling()