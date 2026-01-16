import json
import logging
import pandas as pd
import os
import uuid
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

# Теперь достаем их через os.getenv
BOT_TOKEN = os.getenv("BOT_TOKEN")
ADMIN_CHAT_ID = os.getenv("ADMIN_CHAT_ID")
DATA_FILE = "backend/database.json"
UPLOADS_DIR = "backend/uploads"

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

# === КЛАВИАТУРЫ ===
MAIN_MENU_MARKUP = ReplyKeyboardMarkup([
    ["📅 Обновить график"],  # <--- НОВАЯ КНОПКА
    ["📰 Добавить новость", "🎥 Добавить видео"],
    ["📋 Список новостей", "📋 Список видео"],
    ["💬 Список отзывов"]
], resize_keyboard=True)

CANCEL_MARKUP = ReplyKeyboardMarkup([["❌ Отмена"]], resize_keyboard=True)
PHOTO_MARKUP = ReplyKeyboardMarkup([["⏭ Пропустить фото"], ["❌ Отмена"]], resize_keyboard=True)

# === БАЗА ДАННЫХ ===
def load_db():
    if not os.path.exists(DATA_FILE): return {"reviews": [], "news": [], "videos": []}
    with open(DATA_FILE, "r", encoding="utf-8") as f: return json.load(f)

def save_db(data):
    with open(DATA_FILE, "w", encoding="utf-8") as f: json.dump(data, f, ensure_ascii=False, indent=2)

# === СТАРТ И ОТМЕНА ===
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    # Проверка прав
    if str(update.effective_chat.id) != str(ADMIN_CHAT_ID):
        await update.message.reply_text("⛔ Доступ запрещен.")
        return ConversationHandler.END
    
    # Сброс данных при рестарте
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
        await update.message.reply_text(
            "📤 Отправьте мне **Excel-файл (.xlsx)** с графиком.\n\n"
            "Убедитесь, что заголовки: ФИО, Должность, Кабинет, ПН, ВТ, СР, ЧТ, ПТ.",
            parse_mode="Markdown",
            reply_markup=CANCEL_MARKUP
        )
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

# === ОБРАБОТКА ФОТО ===
async def news_photo_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    photo_file = None
    
    # 1. Если прислали сжатое фото
    if update.message.photo:
        photo_file = await update.message.photo[-1].get_file()
        
    # 2. Если прислали файл (Document) и это изображение
    elif update.message.document and 'image' in update.message.document.mime_type:
        photo_file = await update.message.document.get_file()
    
    # Если фото найдено - сохраняем
    if photo_file:
        file_name = f"news_{uuid.uuid4()}.jpg"
        save_path = os.path.join(UPLOADS_DIR, file_name)
        if not os.path.exists(UPLOADS_DIR): os.makedirs(UPLOADS_DIR)
        
        await photo_file.download_to_drive(save_path)
        photo_path = f"/uploads/{file_name}"
        await save_news(update, context, photo_path)
        return CHOOSING_ACTION
    
    # Если прислали ТЕКСТ (не кнопку пропуска), ругаемся
    await update.message.reply_text("⚠️ Пожалуйста, отправьте ФОТО или нажмите кнопку 'Пропустить'.")
    return NEWS_PHOTO

async def news_skip_photo(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await save_news(update, context, None)
    return CHOOSING_ACTION

async def save_news(update, context, image_path):
    db = load_db()
    new_id = (max([i['id'] for i in db['news']] or [0])) + 1
    
    db["news"].append({
        "id": new_id,
        "title": context.user_data.get('n_title_ru', 'Без заголовка'),
        "titleKz": context.user_data.get('n_title_kz', 'Без заголовка'),
        "text": context.user_data.get('n_text_ru', ''),
        "textKz": context.user_data.get('n_text_kz', ''),
        "date": update.message.date.strftime("%d.%m.%Y"),
        "image": image_path
    })
    save_db(db)
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
    db = load_db()
    new_id = (max([i['id'] for i in db['videos']] or [0])) + 1
    db["videos"].append({
        "id": new_id,
        "title": context.user_data.get('v_title_ru'),
        "titleKz": context.user_data.get('v_title_kz'),
        "url": update.message.text
    })
    save_db(db)
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
        # 1. Читаем файл полностью без заголовков сначала
        df_raw = pd.read_excel(file_path, header=None)

        # 2. Ищем строку, в которой есть слово "ФИО"
        header_row_index = -1
        for i, row in df_raw.iterrows():
            if row.astype(str).str.contains("ФИО").any():
                header_row_index = i
                break
        
        if header_row_index == -1:
            await update.message.reply_text("❌ В файле не найдена строка с заголовком 'ФИО'.")
            return WAITING_SCHEDULE

        # 3. Перечитываем файл, используя найденную строку как заголовок
        df = pd.read_excel(file_path, header=header_row_index)
        
        # Очищаем названия колонок от пробелов
        df.columns = df.columns.astype(str).str.strip()
        
        # Маппинг колонок
        rename_map = {
            'ФИО': 'name', 
            'Должность': 'role', 
            'Кабинет': 'cabinet',
            'Отделение': 'dept',  # <--- ДОБАВЬТЕ ЭТУ СТРОКУ
            'ПН': 'mon', 'ВТ': 'tue', 'СР': 'wed', 'ЧТ': 'thu', 'ПТ': 'fri'
        }
        df.rename(columns=rename_map, inplace=True)
        
        # Проверка наличия обязательных полей
        if 'name' not in df.columns:
            await update.message.reply_text("❌ Ошибка: не удалось распознать колонку 'ФИО'.")
            return WAITING_SCHEDULE

        # Убираем пустые строки и заменяем NaN
        df = df.dropna(subset=['name'])
        df = df.fillna("-").astype(str)
        
        schedule_data = df.to_dict(orient='records')
        
        # Сохраняем в базу
        db = load_db()
        db['schedule'] = schedule_data
        save_db(db)
        
        await update.message.reply_text(
            f"✅ График обновлен!\nВрачей загружено: {len(schedule_data)}", 
            reply_markup=MAIN_MENU_MARKUP
        )
        
    except Exception as e:
        await update.message.reply_text(f"❌ Ошибка: {e}")
    
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)
            
    return CHOOSING_ACTION

# === СПИСКИ И КНОПКИ ===
async def show_list(update, category, title_ru):
    db = load_db()
    items = db.get(category, [])
    if category == "reviews": items = [i for i in items if i.get("approved")]
    
    if not items:
        await update.message.reply_text("📭 Список пуст.")
        return
        
    await update.message.reply_text(f"📂 {title_ru} (последние 5):")
    for item in items[-5:]:
        # Инфо
        info = f"ID: {item['id']}\n"
        if category == 'news': info += f"📰 {item['title']}"
        elif category == 'videos': info += f"🎥 {item['title']}"
        else: info += f"👤 {item['name']}: {item['text']}"
        
        keyboard = [[InlineKeyboardButton("🗑 Удалить", callback_data=f"delete_{category}_{item['id']}")]]
        await update.message.reply_text(info, reply_markup=InlineKeyboardMarkup(keyboard))

async def callback_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    parts = query.data.split("_")
    action = parts[0]
    
    db = load_db()
    if action == "delete":
        cat, iid = parts[1], int(parts[2])
        db[cat] = [i for i in db[cat] if i["id"] != iid]
        save_db(db)
        await query.edit_message_text("🗑 Удалено.")
        
    elif action == "approve":
        iid = int(parts[1])
        for r in db["reviews"]:
            if r["id"] == iid: r["approved"] = True
        save_db(db)
        await query.edit_message_text("✅ Одобрено.")
        
    elif action == "reject":
        iid = int(parts[1])
        db["reviews"] = [r for r in db["reviews"] if r["id"] != iid]
        save_db(db)
        await query.edit_message_text("❌ Отклонено.")

# === ЗАПУСК ===
if __name__ == "__main__":
    # УВЕЛИЧИВАЕМ ТАЙМАУТЫ, ЧТОБЫ ИЗБЕЖАТЬ ОШИБКИ ConnectTimeout
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

    conv_handler = ConversationHandler(
        entry_points=[CommandHandler('start', start)],
        states={
            CHOOSING_ACTION: [MessageHandler(filters.TEXT & ~filters.COMMAND & ~cancel_filter, choose_action)],
            WAITING_SCHEDULE: [
                MessageHandler(filters.Document.FileExtension("xlsx"), handle_schedule_upload),
                MessageHandler(cancel_filter, cancel)
            ],
            NEWS_TITLE_RU: [MessageHandler(filters.TEXT & ~filters.COMMAND & ~cancel_filter, news_title_ru)],
            NEWS_TITLE_KZ: [MessageHandler(filters.TEXT & ~filters.COMMAND & ~cancel_filter, news_title_kz)],
            NEWS_TEXT_RU:  [MessageHandler(filters.TEXT & ~filters.COMMAND & ~cancel_filter, news_text_ru)],
            NEWS_TEXT_KZ:  [MessageHandler(filters.TEXT & ~filters.COMMAND & ~cancel_filter, news_text_kz)],
            
            # В ШАГЕ ФОТО ТЕПЕРЬ ОБРАБАТЫВАЕМ ВСЁ
            NEWS_PHOTO: [
                MessageHandler(filters.PHOTO, news_photo_handler),
                MessageHandler(filters.Document.IMAGE, news_photo_handler), # Поддержка фото файлом
                MessageHandler(skip_filter, news_skip_photo),
                # Если прислали что-то другое (текст) - сработает тот же news_photo_handler и вернет предупреждение
                MessageHandler(filters.ALL & ~cancel_filter, news_photo_handler)
            ],
            
            VIDEO_TITLE_RU: [MessageHandler(filters.TEXT & ~filters.COMMAND & ~cancel_filter, video_title_ru)],
            VIDEO_TITLE_KZ: [MessageHandler(filters.TEXT & ~filters.COMMAND & ~cancel_filter, video_title_kz)],
            VIDEO_URL:      [MessageHandler(filters.TEXT & ~filters.COMMAND & ~cancel_filter, video_finish)],
        },
        fallbacks=[
            CommandHandler('cancel', cancel),
            MessageHandler(cancel_filter, cancel)
        ],
        allow_reentry=True # <-- ВАЖНО: Разрешает начать /start даже если бот завис в середине
    )
    
    app.add_handler(conv_handler)
    app.add_handler(CallbackQueryHandler(callback_handler))
    
    print("Бот перезапущен с защитой от сбоев...")
    app.run_polling()