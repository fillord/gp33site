import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Calendar,
  User,
  MessageSquare,
  CheckCircle,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

export default function AdminChatHistory() {
  const [chats, setChats] = useState([]);
  const [search, setSearch] = useState("");
  const [filterManager, setFilterManager] = useState("Все");
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("manager_token");
  const role = localStorage.getItem("manager_role");
  // Загружаем все чаты при открытии страницы
  useEffect(() => {
    // 1. ПРОВЕРКА БЕЗОПАСНОСТИ: Если нет токена ИЛИ роль не админ - выкидываем на логин
    if (!token || role !== "admin") {
      navigate("/manager/login");
      return;
    }

    // 2. Добавляем токен в запрос
    fetch(`${API_BASE_URL}/api/admin/chats/history`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
          localStorage.clear();
          navigate("/manager/login");
          throw new Error("Доступ запрещен");
        }
        return res.json();
      })
      .then((data) => setChats(data))
      .catch((err) => console.error(err));
  }, [navigate, token, role]);

  // Если админ кликнул на чат - грузим его сообщения
  const loadMessages = async (token) => {
    const res = await fetch(`${API_BASE_URL}/api/chat/history/${token}`);
    const data = await res.json();
    setChatMessages(data.messages || []);
  };

  // Получаем уникальный список менеджеров для фильтра
  const managers = ["Все", ...new Set(chats.map((c) => c.manager_name))];

  // Логика фильтрации и поиска
  const filteredChats = chats.filter((chat) => {
    const matchName = chat.name.toLowerCase().includes(search.toLowerCase());
    const matchManager =
      filterManager === "Все" || chat.manager_name === filterManager;
    return matchName && matchManager;
  });

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* ЛЕВАЯ ЧАСТЬ - СПИСОК И ФИЛЬТРЫ */}
      <div className="w-1/2 lg:w-1/3 bg-white border-r flex flex-col shadow-sm z-10">
        <div className="p-6 border-b bg-gray-800 text-white">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Calendar size={20} /> Архив обращений
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Всего диалогов: {chats.length}
          </p>
        </div>

        {/* Панель фильтров */}
        <div className="p-4 border-b bg-gray-50 flex flex-col gap-3">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Поиск по имени пациента..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-400" />
            <select
              className="flex-1 bg-white border border-gray-200 rounded-lg p-2 text-sm outline-none cursor-pointer"
              value={filterManager}
              onChange={(e) => setFilterManager(e.target.value)}
            >
              {managers.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Список чатов */}
        <div className="flex-1 overflow-y-auto p-2">
          {filteredChats.map((chat) => (
            <div
              key={chat.session_token}
              onClick={() => {
                setSelectedChat(chat);
                loadMessages(chat.session_token);
              }}
              className={`p-4 rounded-xl mb-2 cursor-pointer border transition-all ${selectedChat?.session_token === chat.session_token ? "bg-teal-50 border-teal-200" : "bg-white border-gray-100 hover:bg-gray-50"}`}
            >
              <div className="flex justify-between mb-2">
                <span className="font-bold text-gray-800">{chat.name}</span>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock size={12} />
                  {chat.date} {chat.time}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-mono text-xs">
                  {chat.phone}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${chat.status === "open" ? "bg-emerald-100 text-emerald-700" : "bg-gray-200 text-gray-600"}`}
                >
                  {chat.status === "open" ? "ОТКРЫТ" : "ЗАВЕРШЕН"}
                </span>
              </div>
              <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                <User size={12} /> Сотрудник:{" "}
                <span className="font-medium text-gray-700">
                  {chat.manager_name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ПРАВАЯ ЧАСТЬ - ПРОСМОТР ПЕРЕПИСКИ */}
      <div className="flex-1 bg-gray-100 flex flex-col">
        {selectedChat ? (
          <>
            <div className="bg-white p-6 border-b shadow-sm">
              <h2 className="text-xl font-bold text-gray-800">
                Детали диалога
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Пациент: {selectedChat.name} | Тел: {selectedChat.phone}
              </p>
            </div>
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
              {chatMessages.length === 0 ? (
                <p className="text-center text-gray-400 mt-10">Сообщений нет</p>
              ) : (
                chatMessages.map((msg, idx) => {
                  const isManager = msg.sender === "manager";
                  const isSystem = msg.sender === "system";

                  if (isSystem)
                    return (
                      <div key={idx} className="text-center">
                        <span className="bg-gray-200 text-gray-500 text-xs px-3 py-1 rounded-full">
                          {msg.text}
                        </span>
                      </div>
                    );

                  return (
                    <div
                      key={idx}
                      className={`flex flex-col max-w-[70%] ${isManager ? "self-end items-end" : "self-start items-start"}`}
                    >
                      <div
                        className={`px-4 py-2 rounded-2xl text-[15px] shadow-sm ${isManager ? "bg-teal-600 text-white rounded-br-sm" : "bg-white text-gray-800 border rounded-bl-sm"}`}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[10px] text-gray-400 mt-1 mx-1">
                        {msg.timestamp} {isManager && " (Менеджер)"}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <MessageSquare size={48} className="mb-4 opacity-50" />
            <p>Выберите диалог из списка слева для просмотра истории</p>
          </div>
        )}
      </div>
    </div>
  );
}
