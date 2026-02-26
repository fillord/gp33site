@echo off

:: 1. Запуск API Server (FastAPI/Uvicorn)
start "API Server" cmd /k "cd backend && venv\Scripts\activate && uvicorn server:app --reload"

:: 2. Запуск Telegram Bot
start "Telegram Bot" cmd /k "cd backend && venv\Scripts\activate && python bot.py"

:: 3. Запуск Frontend (React/Next.js)
start "Frontend" cmd /k "npm run dev"