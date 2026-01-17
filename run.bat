@echo off
start "API Server" cmd /k "cd backend && uvicorn server:app --reload"
start "Telegram Bot" cmd /k "cd backend && python bot.py"
start "Frontend" cmd /k "npm run dev"