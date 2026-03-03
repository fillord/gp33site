import sqlite3

def show_tables(db_name):
    print(f"\n🔍 Изучаем базу данных: {db_name}")
    print("-" * 40)
    try:
        conn = sqlite3.connect(db_name)
        cursor = conn.cursor()
        
        # Получаем список всех таблиц
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()
        
        if not tables:
            print("  [Пустая база или нет таблиц]")
            return

        for table in tables:
            table_name = table[0]
            # Игнорируем служебную таблицу SQLite
            if table_name == "sqlite_sequence":
                continue
                
            # Получаем колонки для таблицы
            cursor.execute(f"PRAGMA table_info({table_name})")
            columns = [col[1] for col in cursor.fetchall()]
            
            print(f"👉 Таблица: {table_name}")
            print(f"   Колонки: {', '.join(columns)}")
        
        conn.close()
    except sqlite3.OperationalError:
        print(f"❌ Ошибка: файл {db_name} не найден!")

if __name__ == "__main__":
    # Проверяем старую базу (замени имя, если файл называется иначе!)
    show_tables("old_database.db")
    
    # Проверяем новую базу 
    show_tables("gp33.db")
    print("\n")
