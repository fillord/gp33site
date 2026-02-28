import json
import logging
import pandas as pd
import os
import uuid

from sqlalchemy import select, delete, update as sql_update
from database import async_session
from models import News, Video, Review, Schedule, Vacancy, Appeal, Document, ChatManager
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
(CHOOSING_ACTION, NEWS_TITLE_RU, NEWS_TITLE_KZ, NEWS_TEXT_RU, NEWS_TEXT_KZ, NEWS_PHOTO, 
 VIDEO_TITLE_RU, VIDEO_TITLE_KZ, VIDEO_URL, WAITING_SCHEDULE, 
 WAITING_VACANCY_TITLE, WAITING_VACANCY_SALARY, WAITING_VACANCY_TEXT, 
 DOC_CATEGORY_SELECT, DOC_ACTION, DOC_UPLOAD_FILE, DOC_TITLE_INPUT,
 EMP_ACTION, EMP_ROLE, EMP_NAME, EMP_LOGIN, EMP_PASS, EMP_WAIT_NEW_PASS) = range(23)

# === КЛАВИАТУРЫ ===
DOC_CATEGORIES = {
    "💰 Доходы и расходы": "about_income",
    "🏛 Госзакуп": "about_procurement",
    "📊 Годовой отчет": "about_annual",
    "⚖️ Нормативные акты": "about_docs_normative",
    "📂 Корпоративные док.": "corp_docs",
    "📜 Лицензии": "corp_licenses",
    "📝 Протокола": "protocols"
}

MAIN_MENU_MARKUP = ReplyKeyboardMarkup([ 
    ["📰 Добавить новость", "📋 Список новостей"],
    ["🎥 Добавить видео", "📋 Список видео"],
    ["💼 Вакансии (Добавить)", "📋 Список вакансий"], 
    ["📅 Обновить график","💬 Список отзывов", "📋 Обращения"],
    ["📂 Управление документами", "👥 Сотрудники (CRM)"]
], resize_keyboard=True)

# Меню выбора категорий документов
doc_buttons = list(DOC_CATEGORIES.keys())
rows = [doc_buttons[i:i + 2] for i in range(0, len(doc_buttons), 2)]
rows.append(["❌ Отмена"])
DOC_CATS_MARKUP = ReplyKeyboardMarkup(rows, resize_keyboard=True)

DOC_ACTIONS_MARKUP = ReplyKeyboardMarkup([
    ["📤 Загрузить файл"],
    ["⬅️ Назад к категориям"],
    ["❌ Главное меню"]
], resize_keyboard=True)

EMP_ACTIONS_MARKUP = ReplyKeyboardMarkup([
    ["➕ Добавить сотрудника"],
    ["📋 Список сотрудников"],
    ["⬅️ Главное меню"]
], resize_keyboard=True)

EMP_ROLE_MARKUP = ReplyKeyboardMarkup([
    ["👨‍💻 Менеджер", "👑 Администратор"],
    ["❌ Отмена"]
], resize_keyboard=True)

SKIP_TITLE_MARKUP = ReplyKeyboardMarkup([["👌 Оставить имя файла"], ["❌ Отмена"]], resize_keyboard=True)
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
    elif text == "💬 Список отзывов":
        await show_list(update, "reviews", "Отзывы")
        return CHOOSING_ACTION
    elif text == "📋 Список новостей":
        await show_list(update, "news", "Новости")
        return CHOOSING_ACTION
    elif text == "📋 Список видео":
        await show_list(update, "videos", "Видео")
        return CHOOSING_ACTION
    elif text == "📋 Список вакансий": 
        await list_vacancies(update, context) 
        return CHOOSING_ACTION
    elif text == "📋 Обращения":
        await show_list(update, "appeals", "Обращения (Благодарности/Жалобы)")
        return CHOOSING_ACTION
    elif text == "👥 Сотрудники (CRM)":
        await update.message.reply_text("👥 Управление доступом в CRM", reply_markup=EMP_ACTIONS_MARKUP)
        return EMP_ACTION
    else:
        await update.message.reply_text("Используйте кнопки меню.", reply_markup=MAIN_MENU_MARKUP)
        return CHOOSING_ACTION

# === СОТРУДНИКИ (CRM) ===
async def emp_action_chosen(update: Update, context: ContextTypes.DEFAULT_TYPE):
    text = update.message.text
    if text == "➕ Добавить сотрудника":
        await update.message.reply_text("Выберите роль нового сотрудника:", reply_markup=EMP_ROLE_MARKUP)
        return EMP_ROLE
    elif text == "📋 Список сотрудников":
        await emp_list(update, context)
        return EMP_ACTION
    elif text == "⬅️ Главное меню":
        await update.message.reply_text("Главное меню", reply_markup=MAIN_MENU_MARKUP)
        return CHOOSING_ACTION
    else:
        return EMP_ACTION

async def emp_role_chosen(update: Update, context: ContextTypes.DEFAULT_TYPE):
    role_text = update.message.text
    if role_text not in ["👨‍💻 Менеджер", "👑 Администратор"]:
        return EMP_ROLE
    context.user_data['emp_role'] = "admin" if role_text == "👑 Администратор" else "manager"
    await update.message.reply_text("👤 Введите Имя и Фамилию сотрудника:", reply_markup=CANCEL_MARKUP)
    return EMP_NAME

async def emp_name_entered(update: Update, context: ContextTypes.DEFAULT_TYPE):
    context.user_data['emp_name'] = update.message.text
    await update.message.reply_text("🔑 Придумайте логин (только английские буквы и цифры):", reply_markup=CANCEL_MARKUP)
    return EMP_LOGIN

async def emp_login_entered(update: Update, context: ContextTypes.DEFAULT_TYPE):
    login = update.message.text
    async with async_session() as session:
        res = await session.execute(select(ChatManager).where(ChatManager.username == login))
        if res.scalar_one_or_none():
            await update.message.reply_text("❌ Этот логин уже занят! Введите другой:", reply_markup=CANCEL_MARKUP)
            return EMP_LOGIN
            
    context.user_data['emp_login'] = login
    await update.message.reply_text("🔒 Придумайте пароль:", reply_markup=CANCEL_MARKUP)
    return EMP_PASS

async def emp_pass_entered(update: Update, context: ContextTypes.DEFAULT_TYPE):
    password = update.message.text
    async with async_session() as session:
        new_emp = ChatManager(
            username=context.user_data['emp_login'],
            password=password,
            name=context.user_data['emp_name'],
            role=context.user_data['emp_role']
        )
        session.add(new_emp)
        await session.commit()
    
    role_str = "👑 Администратор" if context.user_data['emp_role'] == "admin" else "👨‍💻 Менеджер"
    await update.message.reply_text(
        f"✅ {role_str} успешно создан!\n\n"
        f"👤 Имя: {context.user_data['emp_name']}\n"
        f"🔑 Логин: {context.user_data['emp_login']}\n"
        f"🔒 Пароль: {password}\n"
        f"🌐 Вход: https://almgp33.kz/manager/login",
        reply_markup=EMP_ACTIONS_MARKUP
    )
    return EMP_ACTION

async def emp_list(update: Update, context: ContextTypes.DEFAULT_TYPE):
    async with async_session() as session:
        res = await session.execute(select(ChatManager).order_by(ChatManager.id))
        emps = res.scalars().all()
    
    if not emps:
        await update.message.reply_text("📭 Нет зарегистрированных сотрудников.")
        return
    
    await update.message.reply_text("👥 Список сотрудников CRM:")
    for emp in emps:
        role_str = "👑 Админ" if emp.role == "admin" else "👨‍💻 Менеджер"
        msg = f"{role_str}\n👤 {emp.name}\n🔑 Логин: {emp.username}"
        
        keyboard = [
            [InlineKeyboardButton("🔑 Изменить пароль", callback_data=f"emppass_{emp.id}")],
            [InlineKeyboardButton("🗑 Удалить", callback_data=f"empdel_{emp.id}")]
        ]
        await update.message.reply_text(msg, reply_markup=InlineKeyboardMarkup(keyboard))

async def emp_change_pass_start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    emp_id = int(query.data.split("_")[1])
    context.user_data['edit_emp_id'] = emp_id
    await query.message.reply_text("🔒 Введите новый пароль для этого сотрудника:", reply_markup=CANCEL_MARKUP)
    return EMP_WAIT_NEW_PASS

async def emp_save_new_pass(update: Update, context: ContextTypes.DEFAULT_TYPE):
    new_pass = update.message.text
    emp_id = context.user_data.get('edit_emp_id')
    if emp_id:
        async with async_session() as session:
            await session.execute(sql_update(ChatManager).where(ChatManager.id == emp_id).values(password=new_pass))
            await session.commit()
        await update.message.reply_text("✅ Пароль успешно изменен!", reply_markup=EMP_ACTIONS_MARKUP)
    return EMP_ACTION

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
            'ФИО': 'name', 'Должность': 'role', 'Кабинет': 'cabinet', 'Отделение': 'dept',
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
                    name=str(row.get('name', '-')), role=str(row.get('role', '-')), cabinet=str(row.get('cabinet', '-')),
                    dept=str(row.get('dept', '-')), mon=str(row.get('mon', '-')), tue=str(row.get('tue', '-')),
                    wed=str(row.get('wed', '-')), thu=str(row.get('thu', '-')), fri=str(row.get('fri', '-'))
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
        
        if category == 'news': info += f"📰 {item.title}"
        elif category == 'videos': info += f"🎥 {item.title}"
        elif category == 'reviews': 
            status = "✅ Одобрен" if item.approved else "⏳ На проверке"
            info += f"[{status}]\n👤 {item.name}: {item.text[:50]}..."
        elif category == 'appeals':
            is_support = item.category in ["Служба Поддержки", "support"]
            # Если это поддержка, статус "Обработано", иначе "Опубликовано"
            status = "✅ Обработано" if is_support and item.approved else ("✅ Опубликовано" if item.approved else "⏳ Ожидает")
            
            cat_text = {
                "thanks": "🙏 Благодарность", "complaint": "😡 Жалоба", "proposal": "💡 Предложение",
                "Blagodarnost": "🙏 Благодарность", "Jaloba": "😡 Жалоба", "Predlozhenie": "💡 Предложение",
                "Служба Поддержки": "🚑 Служба Поддержки"
            }.get(item.category, f"❓ {item.category}")
            
            # Добавил вывод телефона!
            info += f"📌 Тип: {cat_text}\n📊 Статус: {status}\n👤 {item.name}\n📞 Тел: {item.phone}\n📝 {item.text[:100]}..."
                    
        # 👇 ФОРМИРОВАНИЕ КНОПОК ДЛЯ СПИСКА 👇
        keyboard = []
        if category == 'reviews' and not item.approved:
            keyboard.append([InlineKeyboardButton("✅ Одобрить", callback_data=f"approve_{item.id}")])
        elif category == 'appeals' and not item.approved:
            if item.category in ["Служба Поддержки", "support"]:
                keyboard.append([InlineKeyboardButton("✅ Сделано (Архив)", callback_data=f"resolve_{item.id}")])
            elif item.category not in ["proposal", "Predlozhenie"]:
                keyboard.append([InlineKeyboardButton("✅ Опубликовать", callback_data=f"pub_{item.id}")])
                
        keyboard.append([InlineKeyboardButton("🗑 Удалить", callback_data=f"delete_{category}_{item.id}")])
        
        await update.message.reply_text(info, reply_markup=InlineKeyboardMarkup(keyboard))

# === ВХОД В РАЗДЕЛ ДОКУМЕНТОВ ===
async def docs_start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "📂 <b>Раздел документов</b>\nВыберите категорию сайта, куда хотите добавить или удалить документ:", 
        reply_markup=DOC_CATS_MARKUP, parse_mode="HTML"
    )
    return DOC_CATEGORY_SELECT

async def docs_category_chosen(update: Update, context: ContextTypes.DEFAULT_TYPE):
    text = update.message.text
    if text not in DOC_CATEGORIES:
        await update.message.reply_text("Выберите категорию из меню.", reply_markup=DOC_CATS_MARKUP)
        return DOC_CATEGORY_SELECT
    
    cat_code = DOC_CATEGORIES[text]
    context.user_data['doc_category_code'] = cat_code
    context.user_data['doc_category_name'] = text
    
    await show_docs_list(update, cat_code, text)
    await update.message.reply_text(
        f"Выбрана категория: <b>{text}</b>.\nЧтобы добавить новый документ, нажмите кнопку ниже.",
        reply_markup=DOC_ACTIONS_MARKUP, parse_mode="HTML"
    )
    return DOC_ACTION

async def show_docs_list(update, cat_code, cat_name):
    async with async_session() as session:
        result = await session.execute(select(Document).where(Document.category == cat_code).order_by(Document.id.desc()))
        docs = result.scalars().all()
        
    if not docs:
        await update.message.reply_text(f"📭 В категории «{cat_name}» пока нет документов.")
    else:
        await update.message.reply_text(f"📂 Документы в «{cat_name}»:")
        for doc in docs:
            icon = "📄"
            if "pdf" in doc.file_type: icon = "📕"
            elif "xls" in doc.file_type: icon = "📊"
            elif "doc" in doc.file_type: icon = "📘"

            msg = f"{icon} <b>{doc.title}</b>\n🗓 {doc.date}"
            keyboard = [[InlineKeyboardButton("🗑 Удалить", callback_data=f"delete_doc_{doc.id}")]]
            await update.message.reply_text(msg, reply_markup=InlineKeyboardMarkup(keyboard), parse_mode="HTML")

async def docs_action(update: Update, context: ContextTypes.DEFAULT_TYPE):
    text = update.message.text
    if text == "📤 Загрузить файл":
        await update.message.reply_text("📎 Отправьте мне файл (PDF, Word, Excel, Картинку).", reply_markup=CANCEL_MARKUP)
        return DOC_UPLOAD_FILE
    elif text == "⬅️ Назад к категориям":
        return await docs_start(update, context)
    else:
        return await start(update, context)

async def docs_file_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
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

    save_dir = os.path.join(UPLOADS_DIR, "docs")
    if not os.path.exists(save_dir): os.makedirs(save_dir)
    
    ext = os.path.splitext(file_name)[1]
    safe_name = f"{uuid.uuid4()}{ext}"
    file_path = os.path.join(save_dir, safe_name)
    
    await file_obj.download_to_drive(file_path)
    
    context.user_data['new_doc_path'] = f"/uploads/docs/{safe_name}"
    context.user_data['new_doc_ext'] = ext.replace(".", "").upper()
    context.user_data['new_doc_original_name'] = file_name

    await update.message.reply_text(
        f"✅ Файл получен: {file_name}\nВведите красивое название для сайта (или нажмите «Оставить имя файла»):",
        reply_markup=SKIP_TITLE_MARKUP
    )
    return DOC_TITLE_INPUT

async def docs_save_finish(update: Update, context: ContextTypes.DEFAULT_TYPE):
    text = update.message.text
    final_title = text if text != "👌 Оставить имя файла" else context.user_data['new_doc_original_name']
    cat_code = context.user_data['doc_category_code']
    
    async with async_session() as session:
        new_doc = Document(
            title=final_title, file_path=context.user_data['new_doc_path'],
            file_type=context.user_data['new_doc_ext'], category=cat_code,
            date=update.message.date.strftime("%d.%m.%Y")
        )
        session.add(new_doc)
        await session.commit()
    
    await update.message.reply_text("✅ Документ опубликован!", reply_markup=DOC_ACTIONS_MARKUP)
    await show_docs_list(update, cat_code, context.user_data['doc_category_name'])
    return DOC_ACTION

# === ОБРАБОТЧИК ИНЛАЙН-КНОПОК ===
async def callback_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    parts = query.data.split("_")
    action = parts[0]
    
    async with async_session() as session:
        if action == "pub":
            iid = int(parts[1])
            await session.execute(sql_update(Appeal).where(Appeal.id == iid).values(approved=True))
            await session.commit()
            await query.edit_message_text("✅ Обращение опубликовано на сайте.")
            
        # 👇 НОВЫЙ БЛОК ДЛЯ СЛУЖБЫ ПОДДЕРЖКИ 👇
        elif action == "resolve":
            iid = int(parts[1])
            await session.execute(sql_update(Appeal).where(Appeal.id == iid).values(approved=True))
            await session.commit()
            await query.edit_message_text("✅ Обращение обработано. Перенесено в архив.")
            
        elif action == "approve":
            iid = int(parts[1])
            await session.execute(sql_update(Review).where(Review.id == iid).values(approved=True))
            await session.commit()
            await query.edit_message_text("✅ Одобрено.")
            
        elif action == "empdel":
            iid = int(parts[1])
            await session.execute(delete(ChatManager).where(ChatManager.id == iid))
            await session.commit()
            await query.edit_message_text("🗑 Сотрудник удален.")
            
        elif action == "reject" or action == "delete":
            if action == "delete" and len(parts) > 2 and parts[1] == "doc":
                doc_id = int(parts[2])
                res = await session.execute(select(Document).where(Document.id == doc_id))
                doc = res.scalar_one_or_none()
                if doc:
                    try:
                        relative_path = doc.file_path.lstrip("/")
                        full_path = os.path.join(BASE_DIR, relative_path)
                        if os.path.exists(full_path): os.remove(full_path)
                    except Exception as e: print(f"Ошибка удаления файла с диска: {e}")
                    await session.delete(doc)
                    await session.commit()
                    await query.edit_message_text("🗑 Документ удален.")
                else:
                    await query.edit_message_text("❌ Документ уже удален.")
                return
            
            if action == "delete": cat = parts[1]; iid = int(parts[2])
            else: cat = "reviews"; iid = int(parts[1])
            
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
                try: await query.edit_message_text(msg)
                except Exception: pass

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
    
    cancel_filter = filters.Regex("^❌ Отмена$")
    skip_filter = filters.Regex("^⏭ Пропустить фото$")
    docs_filter = filters.Regex("^📂 Управление документами$")

    conv_handler = ConversationHandler(
        entry_points=[
            CommandHandler('start', start),
            MessageHandler(filters.Regex("^💼 Вакансии"), start_vacancy),
            MessageHandler(filters.Regex("^📋 Список вакансий"), list_vacancies),
            MessageHandler(docs_filter, docs_start),
        ],
        states={
            CHOOSING_ACTION: [
                MessageHandler(filters.TEXT & ~filters.COMMAND & ~cancel_filter, choose_action),
                CallbackQueryHandler(emp_change_pass_start, pattern="^emppass_")
            ],
            
            WAITING_SCHEDULE: [
                MessageHandler(filters.Document.FileExtension("xlsx"), handle_schedule_upload),
                MessageHandler(cancel_filter, cancel)
            ],
            
            NEWS_TITLE_RU: [MessageHandler(filters.TEXT & ~filters.COMMAND & ~cancel_filter, news_title_ru)],
            NEWS_TITLE_KZ: [MessageHandler(filters.TEXT & ~filters.COMMAND & ~cancel_filter, news_title_kz)],
            NEWS_TEXT_RU:  [MessageHandler(filters.TEXT & ~filters.COMMAND & ~cancel_filter, news_text_ru)],
            NEWS_TEXT_KZ:  [MessageHandler(filters.TEXT & ~filters.COMMAND & ~cancel_filter, news_text_kz)],
            NEWS_PHOTO: [
                MessageHandler(filters.PHOTO | filters.Document.IMAGE | filters.ALL & ~cancel_filter, news_photo_handler),
                MessageHandler(skip_filter, news_skip_photo)
            ],
            
            VIDEO_TITLE_RU: [MessageHandler(filters.TEXT & ~filters.COMMAND & ~cancel_filter, video_title_ru)],
            VIDEO_TITLE_KZ: [MessageHandler(filters.TEXT & ~filters.COMMAND & ~cancel_filter, video_title_kz)],
            VIDEO_URL:      [MessageHandler(filters.TEXT & ~filters.COMMAND & ~cancel_filter, video_finish)],

            WAITING_VACANCY_TITLE: [MessageHandler(filters.TEXT & ~filters.COMMAND & ~cancel_filter, vacancy_title)],
            WAITING_VACANCY_SALARY: [MessageHandler(filters.TEXT & ~filters.COMMAND & ~cancel_filter, vacancy_salary)],
            WAITING_VACANCY_TEXT: [MessageHandler(filters.TEXT & ~filters.COMMAND & ~cancel_filter, vacancy_finish)],

            DOC_CATEGORY_SELECT: [MessageHandler(filters.TEXT & ~filters.COMMAND & ~cancel_filter, docs_category_chosen)],
            DOC_ACTION: [MessageHandler(filters.TEXT & ~filters.COMMAND & ~cancel_filter, docs_action)],
            DOC_UPLOAD_FILE: [
                MessageHandler(filters.Document.ALL | filters.PHOTO, docs_file_handler),
                MessageHandler(cancel_filter, cancel)
            ],
            DOC_TITLE_INPUT: [MessageHandler(filters.TEXT & ~filters.COMMAND & ~cancel_filter, docs_save_finish)],

            # === СОТРУДНИКИ ===
            EMP_ACTION: [
                MessageHandler(filters.TEXT & ~filters.COMMAND & ~cancel_filter, emp_action_chosen),
                CallbackQueryHandler(emp_change_pass_start, pattern="^emppass_")
            ],
            EMP_ROLE: [MessageHandler(filters.TEXT & ~filters.COMMAND & ~cancel_filter, emp_role_chosen)],
            EMP_NAME: [MessageHandler(filters.TEXT & ~filters.COMMAND & ~cancel_filter, emp_name_entered)],
            EMP_LOGIN: [MessageHandler(filters.TEXT & ~filters.COMMAND & ~cancel_filter, emp_login_entered)],
            EMP_PASS: [MessageHandler(filters.TEXT & ~filters.COMMAND & ~cancel_filter, emp_pass_entered)],
            EMP_WAIT_NEW_PASS: [MessageHandler(filters.TEXT & ~filters.COMMAND & ~cancel_filter, emp_save_new_pass)],
        },
        fallbacks=[
            CommandHandler('cancel', cancel),
            MessageHandler(cancel_filter, cancel)
        ],
        allow_reentry=True
    )
    
    app.add_handler(conv_handler)
    app.add_handler(CallbackQueryHandler(callback_handler))

    print("Бот перезапущен (v5 - Employee CRM Management)...")
    app.run_polling()