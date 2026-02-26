import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send } from "lucide-react";

import { API_BASE_URL } from "../config";

// Для WebSocket меняем http/https на ws/wss
const WS_BASE_URL = API_BASE_URL.replace(/^http/, "ws");

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionToken, setSessionToken] = useState(
    localStorage.getItem("chat_session") || null,
  );
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  // Форма авторизации
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const ws = useRef(null);
  const messagesEndRef = useRef(null);

  // Прокрутка вниз при новом сообщении
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Загрузка истории и подключение к сокетам
  useEffect(() => {
    if (sessionToken && isOpen) {
      // 1. Грузим историю
      fetch(`${API_BASE_URL}/api/chat/history/${sessionToken}`)
        .then((res) => res.json())
        .then((data) => {
          // Если чат закрыт ИЛИ сервер вернул ошибку (сессия удалена из БД)
          if (data.status === "closed" || data.error) {
            localStorage.removeItem("chat_session"); // Сбрасываем память браузера
            setSessionToken(null); // Обнуляем токен в React
            setMessages([]); // Очищаем историю на экране
          } else {
            setMessages(data.messages || []);
          }
        })
        .catch((err) => console.error("Ошибка загрузки истории:", err));

      // 2. Открываем WebSocket
      ws.current = new WebSocket(`${WS_BASE_URL}/ws/chat/${sessionToken}`);

      ws.current.onmessage = (event) => {
        const newMsg = JSON.parse(event.data);
        setMessages((prev) => [...prev, newMsg]);

        // ЕСЛИ МЕНЕДЖЕР ЗАКРЫЛ ЧАТ (СИСТЕМНОЕ СООБЩЕНИЕ)
        if (newMsg.sender === "system" && newMsg.text.includes("завершил")) {
          // Даем клиенту 3 секунды, чтобы прочитать "Вопрос решен", а затем сбрасываем всё
          setTimeout(() => {
            localStorage.removeItem("chat_session"); // Удаляем сессию из памяти
            setSessionToken(null);
            setMessages([]);
            setIsOpen(false); // Сворачиваем кружок чата
            alert("Диалог завершен. Спасибо за обращение!");
          }, 3000);
        }
      };

      return () => {
        if (ws.current) ws.current.close();
      };
    }
  }, [sessionToken, isOpen]);

  const startChat = async (e) => {
    e.preventDefault();
    if (!name || !phone) return;

    const res = await fetch(`${API_BASE_URL}/api/chat/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone }),
    });
    const data = await res.json();

    if (data.session_token) {
      localStorage.setItem("chat_session", data.session_token);
      setSessionToken(data.session_token);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!text.trim() || !ws.current) return;

    const payload = { sender: "client", text: text.trim() };
    ws.current.send(JSON.stringify(payload));
    setText("");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Кнопка открытия */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white p-4 rounded-full shadow-2xl transition transform hover:scale-110 flex items-center justify-center"
        >
          <MessageCircle size={28} />
        </button>
      )}

      {/* Окно чата */}
      {isOpen && (
        <div
          className="bg-white w-80 sm:w-96 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200"
          style={{ height: "500px", maxHeight: "80vh" }}
        >
          {/* Шапка */}
          <div className="bg-teal-600 text-white px-4 py-3 flex justify-between items-center">
            <span className="font-bold flex items-center gap-2">
              <MessageCircle size={18} /> Онлайн-консультация
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:text-gray-200"
            >
              <X size={20} />
            </button>
          </div>

          {/* Тело чата */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3">
            {!sessionToken ? (
              <form
                onSubmit={startChat}
                className="flex flex-col gap-4 my-auto bg-white p-4 rounded-xl shadow-sm border border-gray-100"
              >
                <p className="text-sm text-gray-600 text-center mb-2">
                  Введите данные, чтобы мы могли к вам обращаться
                </p>
                <input
                  type="text"
                  placeholder="Ваше ФИО"
                  className="border rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-teal-500"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <input
                  type="tel"
                  placeholder="Номер телефона"
                  className="border rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-teal-500"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="bg-teal-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-teal-700 transition"
                >
                  Начать чат
                </button>
              </form>
            ) : (
              <>
                {messages.length === 0 && (
                  <p className="text-center text-gray-400 text-xs mt-4">
                    Напишите ваш вопрос, менеджер скоро ответит...
                  </p>
                )}
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col max-w-[80%] ${msg.sender === "client" ? "self-end items-end" : "self-start items-start"}`}
                  >
                    <div
                      className={`px-4 py-2 rounded-2xl text-sm ${msg.sender === "client" ? "bg-teal-600 text-white rounded-br-none" : "bg-white border text-gray-800 rounded-bl-none shadow-sm"}`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-gray-400 mt-1 mx-1">
                      {msg.timestamp}
                    </span>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Ввод сообщения */}
          {sessionToken && (
            <form
              onSubmit={sendMessage}
              className="p-3 bg-white border-t flex gap-2"
            >
              <input
                type="text"
                placeholder="Сообщение..."
                className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <button
                type="submit"
                className="bg-teal-600 text-white p-2 rounded-full hover:bg-teal-700 transition disabled:opacity-50"
                disabled={!text.trim()}
              >
                <Send size={18} className="ml-0.5" />
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
