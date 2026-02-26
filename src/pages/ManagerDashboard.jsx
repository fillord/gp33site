import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  MessageSquare,
  LogOut,
  User,
  Clock,
  Send,
  CheckCircle,
  Info,
  Lock,
} from "lucide-react";

import { API_BASE_URL } from "../config";

const WS_BASE_URL = API_BASE_URL.replace(/^http/, "ws");
const notificationSound = new Audio(
  "data:audio/mp3;base64,//NExAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//NExAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq",
);

export default function ManagerDashboard() {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [previousChatCount, setPreviousChatCount] = useState(0);
  const navigate = useNavigate();

  const managerName = localStorage.getItem("manager_name");
  const token = localStorage.getItem("manager_token");
  // Достаем ID менеджера из токена (в JWT он хранится в поле sub, мы можем распарсить его базово)
  const getManagerId = () => {
    if (!token) return null;
    try {
      return parseInt(JSON.parse(atob(token.split(".")[1])).sub);
    } catch (e) {
      return null;
    }
  };
  const myId = getManagerId();

  // Загрузка списка чатов (СЛЕВА)
  useEffect(() => {
    if (!token) {
      navigate("/manager/login");
      return;
    }

    const fetchChats = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/manager/chats/active`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 401) {
          handleLogout();
          return;
        }

        if (res.ok) {
          const data = await res.json();
          setChats(data);
          if (data.length > previousChatCount && previousChatCount !== 0) {
            notificationSound.play().catch(() => {});
            document.title = "🔔 НОВЫЙ ЧАТ!";
            setTimeout(() => {
              document.title = "GP33 CRM";
            }, 3000);
          }
          setPreviousChatCount(data.length);

          // Обновляем инфу о выбранном чате, если его кто-то принял
          if (selectedChat) {
            const updated = data.find(
              (c) => c.session_token === selectedChat.session_token,
            );
            if (updated && updated.manager_id !== selectedChat.manager_id)
              setSelectedChat(updated);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchChats();
    const interval = setInterval(fetchChats, 3000); // Обновляем каждые 3 сек
    return () => clearInterval(interval);
  }, [navigate, previousChatCount, token, selectedChat]);

  const handleLogout = () => {
    localStorage.removeItem("manager_token");
    localStorage.removeItem("manager_name");
    navigate("/manager/login");
  };

  return (
    <div className="flex h-screen bg-[#F0F2F5] font-sans overflow-hidden">
      {/* === ЛЕВАЯ ПАНЕЛЬ: СПИСОК ЧАТОВ (35% ширины) === */}
      <div className="w-[350px] lg:w-[400px] bg-white border-r border-gray-200 flex flex-col z-20 shadow-sm">
        {/* Шапка левой панели */}
        <div className="p-4 bg-teal-700 text-white flex justify-between items-center shadow-md">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <User size={16} />
            </div>
            <div className="leading-tight">
              <h1 className="font-bold text-sm">GP33 Workspace</h1>
              <p className="text-[11px] text-teal-200">{managerName}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-white/10 rounded-full transition"
            title="Выйти"
          >
            <LogOut size={18} />
          </button>
        </div>

        {/* Список */}
        <div className="flex-1 overflow-y-auto">
          {chats.length === 0 ? (
            <div className="p-6 text-center text-gray-400 mt-10">
              <MessageSquare size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">Нет активных обращений</p>
            </div>
          ) : (
            chats.map((chat) => {
              const isSelected =
                selectedChat?.session_token === chat.session_token;
              const isMine = chat.manager_id === myId;
              const isTakenByOther =
                chat.manager_id && chat.manager_id !== myId;

              return (
                <div
                  key={chat.session_token}
                  onClick={() => setSelectedChat(chat)}
                  className={`p-4 border-b border-gray-100 cursor-pointer transition-colors relative overflow-hidden ${isSelected ? "bg-teal-50" : "hover:bg-gray-50"}`}
                >
                  {isSelected && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal-500"></div>
                  )}
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-gray-800 text-sm truncate pr-2">
                      {chat.name}
                    </h3>
                    <span className="text-[11px] text-gray-400 whitespace-nowrap">
                      {chat.time}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500 font-mono">
                      {chat.phone}
                    </span>

                    {/* Статусы чата */}
                    {!chat.manager_id && (
                      <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                        НОВЫЙ
                      </span>
                    )}
                    {isMine && (
                      <span className="bg-teal-100 text-teal-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        МОЙ ЧАТ
                      </span>
                    )}
                    {isTakenByOther && (
                      <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Lock size={10} /> {chat.manager_name}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* === ПРАВАЯ ПАНЕЛЬ: АКТИВНЫЙ ЧАТ (65% ширины) === */}
      <div
        className="flex-1 flex flex-col bg-[#EFEAE2] relative"
        style={{
          backgroundImage:
            'url("https://www.transparenttextures.com/patterns/cubes.png")',
        }}
      >
        {selectedChat ? (
          <ChatArea
            chat={selectedChat}
            token={token}
            myId={myId}
            onChatClosed={() => setSelectedChat(null)}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
            <div className="w-20 h-20 bg-white/50 rounded-full flex items-center justify-center mb-4 shadow-sm">
              <MessageSquare size={32} className="text-teal-600/50" />
            </div>
            <h2 className="text-xl font-bold text-gray-700">Выберите чат</h2>
            <p className="text-gray-500 text-sm mt-2 max-w-sm">
              Выберите пациента в меню слева, чтобы просмотреть историю и начать
              переписку.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// === ВНУТРЕННИЙ КОМПОНЕНТ ДЛЯ ПРАВОЙ ПАНЕЛИ (ЧАТ) ===
function ChatArea({ chat, token, myId, onChatClosed }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const ws = useRef(null);
  const messagesEndRef = useRef(null);

  const isMine = chat.manager_id === myId;
  const isTakenByOther = chat.manager_id && chat.manager_id !== myId;
  const isUnassigned = !chat.manager_id;

  // Прокрутка вниз
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Подключение к сокету и загрузка истории
  useEffect(() => {
    setMessages([]); // Очищаем при переключении
    fetch(`${API_BASE_URL}/api/chat/history/${chat.session_token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "closed") onChatClosed();
        else setMessages(data.messages || []);
      });

    ws.current = new WebSocket(`${WS_BASE_URL}/ws/chat/${chat.session_token}`);
    ws.current.onmessage = (event) => {
      const newMsg = JSON.parse(event.data);
      setMessages((prev) => [...prev, newMsg]);
      if (newMsg.sender === "system" && newMsg.text.includes("завершил")) {
        alert("Чат был завершен.");
        onChatClosed();
      }
    };
    return () => {
      if (ws.current) ws.current.close();
    };
  }, [chat.session_token, onChatClosed]);

  const acceptChat = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/manager/chats/${chat.session_token}/accept`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!res.ok) {
        const err = await res.json();
        alert(err.detail || "Ошибка принятия чата");
      }
      // Окно обновится само при следующем поллинге активных чатов
    } catch (e) {
      console.error(e);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!text.trim() || !ws.current || !isMine) return;
    ws.current.send(JSON.stringify({ sender: "manager", text: text.trim() }));
    setText("");
  };

  const closeChat = async () => {
    if (!window.confirm("Завершить диалог? Пациент будет отключен.")) return;
    await fetch(`${API_BASE_URL}/api/chat/close/${chat.session_token}`, {
      method: "POST",
    });
    onChatClosed();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Шапка чата */}
      <div className="bg-white px-6 py-3 flex justify-between items-center shadow-sm z-10">
        <div>
          <h2 className="font-bold text-gray-800">{chat.name}</h2>
          <p className="text-xs text-gray-500 font-mono">{chat.phone}</p>
        </div>
        {isMine && (
          <button
            onClick={closeChat}
            className="flex items-center gap-1.5 bg-red-50 hover:bg-red-500 text-red-600 hover:text-white px-3 py-1.5 rounded-lg text-sm font-bold transition"
          >
            <CheckCircle size={16} /> Вопрос решен
          </button>
        )}
      </div>

      {/* История сообщений */}
      <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4">
        {messages.map((msg, idx) => {
          if (msg.sender === "system") {
            return (
              <div key={idx} className="flex justify-center my-2">
                <span className="bg-white/70 backdrop-blur-sm text-gray-500 text-xs px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                  <Info size={12} /> {msg.text}
                </span>
              </div>
            );
          }
          const isMe = msg.sender === "manager";
          return (
            <div
              key={idx}
              className={`flex flex-col max-w-[75%] ${isMe ? "self-end items-end" : "self-start items-start"}`}
            >
              <div
                className={`px-4 py-2 rounded-2xl text-[15px] shadow-sm ${isMe ? "bg-teal-600 text-white rounded-br-sm" : "bg-white text-gray-800 rounded-bl-sm"}`}
              >
                {msg.text}
              </div>
              <span className="text-[10px] text-gray-400 mt-1 mx-1">
                {msg.timestamp}
              </span>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Панель ввода (Меняется в зависимости от статуса) */}
      <div className="bg-[#F0F2F5] p-4 flex items-center justify-center">
        {isUnassigned ? (
          <button
            onClick={acceptChat}
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition transform hover:scale-105"
          >
            Принять чат в работу
          </button>
        ) : isTakenByOther ? (
          <div className="bg-gray-200 text-gray-600 px-6 py-3 rounded-full flex items-center gap-2 text-sm font-bold">
            <Lock size={16} /> Чат обрабатывает: {chat.manager_name}
          </div>
        ) : (
          <form onSubmit={sendMessage} className="w-full max-w-3xl flex gap-2">
            <input
              type="text"
              placeholder="Сообщение..."
              className="flex-1 rounded-full px-6 py-3 border-none shadow-sm focus:ring-2 focus:ring-teal-500 outline-none"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button
              type="submit"
              disabled={!text.trim()}
              className="bg-teal-600 text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-teal-700 transition disabled:opacity-50 shrink-0 shadow-sm"
            >
              <Send size={18} className="ml-1" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
