import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  MessageSquare,
  LogOut,
  User,
  Lock,
  Send,
  CheckCircle,
  Info,
  Bell,
} from "lucide-react";

const API_BASE_URL = import.meta.env.DEV
  ? "http://localhost:8000"
  : "https://almgp33.kz";
const WS_BASE_URL = API_BASE_URL.replace(/^http/, "ws");

const notificationSound = new Audio(
  "https://actions.google.com/sounds/v1/alarms/beep_short.ogg",
);

export default function ManagerDashboard() {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [pushEnabled, setPushEnabled] = useState(false);
  const navigate = useNavigate();

  // 👇 ПАМЯТЬ: Сохраняем, сколько сообщений мы уже прочитали в каждом чате
  const [readCounts, setReadCounts] = useState(() => {
    const saved = localStorage.getItem("gp33_read_counts");
    return saved ? JSON.parse(saved) : {};
  });

  const selectedChatRef = useRef(null);
  const prevMsgCountsRef = useRef({}); // Для звуковых уведомлений

  const managerName = localStorage.getItem("manager_name");
  const token = localStorage.getItem("manager_token");

  const getManagerId = () => {
    if (!token) return null;
    try {
      return parseInt(JSON.parse(atob(token.split(".")[1])).sub);
    } catch (e) {
      return null;
    }
  };
  const myId = getManagerId();

  // Следим за тем, какой чат сейчас открыт
  useEffect(() => {
    selectedChatRef.current = selectedChat?.session_token;
    if (selectedChat) {
      // Если чат открыт, автоматически помечаем все его сообщения как прочитанные
      setReadCounts((prev) => {
        const updated = {
          ...prev,
          [selectedChat.session_token]: selectedChat.msg_count || 0,
        };
        localStorage.setItem("gp33_read_counts", JSON.stringify(updated));
        return updated;
      });
    }
  }, [selectedChat]);

  useEffect(() => {
    if ("Notification" in window) {
      if (Notification.permission === "granted") setPushEnabled(true);
      else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((p) => {
          if (p === "granted") setPushEnabled(true);
        });
      }
    }
  }, []);

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

          // Обновляем бейджики и проигрываем звук, если в ФОНОВОМ чате новое сообщение
          setReadCounts((prev) => {
            const nextReadCounts = { ...prev };
            let isUpdated = false;

            data.forEach((chat) => {
              const currentCount = chat.msg_count || 0;
              const prevCount =
                prevMsgCountsRef.current[chat.session_token] || 0;

              // Если пришло новое сообщение и этот чат сейчас НЕ открыт - ДЗИНЬ!
              if (
                currentCount > prevCount &&
                prevCount !== 0 &&
                selectedChatRef.current !== chat.session_token
              ) {
                notificationSound.play().catch(() => {});
                if (
                  "Notification" in window &&
                  Notification.permission === "granted"
                ) {
                  new Notification("Новое сообщение!", {
                    body: `От: ${chat.name}`,
                    icon: "https://cdn-icons-png.flaticon.com/512/3884/3884351.png",
                  });
                }
              }

              // Если чат открыт ПРЯМО СЕЙЧАС, сбрасываем бейджик (считаем прочитанным)
              if (
                selectedChatRef.current === chat.session_token &&
                currentCount > (nextReadCounts[chat.session_token] || 0)
              ) {
                nextReadCounts[chat.session_token] = currentCount;
                isUpdated = true;
              }

              prevMsgCountsRef.current[chat.session_token] = currentCount;
            });

            if (isUpdated)
              localStorage.setItem(
                "gp33_read_counts",
                JSON.stringify(nextReadCounts),
              );
            return isUpdated ? nextReadCounts : prev;
          });

          // Обновление selectedChat, если его забрал другой менеджер
          if (selectedChatRef.current) {
            const updated = data.find(
              (c) => c.session_token === selectedChatRef.current,
            );
            if (
              updated &&
              updated.manager_id &&
              updated.manager_id !== selectedChat?.manager_id
            ) {
              setSelectedChat(updated);
            }
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchChats();
    const interval = setInterval(fetchChats, 3000);
    return () => clearInterval(interval);
  }, [navigate, token]);

  const handleLogout = () => {
    localStorage.removeItem("manager_token");
    localStorage.removeItem("manager_name");
    navigate("/manager/login");
  };

  return (
    <div className="flex h-screen bg-[#F0F2F5] font-sans overflow-hidden">
      {/* ЛЕВАЯ ПАНЕЛЬ */}
      <div className="w-[350px] lg:w-[400px] bg-white border-r border-gray-200 flex flex-col z-20 shadow-sm">
        <div className="p-4 bg-teal-700 text-white flex justify-between items-center shadow-md">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center relative">
              <User size={16} />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-teal-700 rounded-full"></div>
            </div>
            <div className="leading-tight">
              <h1 className="font-bold text-sm">GP33 Workspace</h1>
              <p className="text-[11px] text-teal-200">{managerName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                notificationSound
                  .play()
                  .catch((e) => alert("Ошибка звука: " + e));
                if (Notification.permission !== "granted")
                  Notification.requestPermission();
              }}
              className="bg-teal-600 hover:bg-teal-500 text-white text-xs px-3 py-1.5 rounded-lg border border-teal-500 shadow-sm transition"
            >
              Проверить звук
            </button>
            <button
              className={`p-2 rounded-full transition ${pushEnabled ? "text-emerald-300" : "text-gray-400"}`}
            >
              <Bell size={18} />
            </button>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-white/10 rounded-full transition"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>

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

              // 👇 ВЫЧИСЛЯЕМ НЕПРОЧИТАННЫЕ СООБЩЕНИЯ 👇
              const unreadCount =
                (chat.msg_count || 0) - (readCounts[chat.session_token] || 0);

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
                    <h3
                      className={`text-sm truncate pr-2 ${unreadCount > 0 ? "font-extrabold text-black" : "font-bold text-gray-800"}`}
                    >
                      {chat.name}
                    </h3>
                    <span
                      className={`text-[11px] whitespace-nowrap ${unreadCount > 0 ? "text-teal-600 font-bold" : "text-gray-400"}`}
                    >
                      {chat.time}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500 font-mono">
                      {chat.phone}
                    </span>
                    <div className="flex gap-1 items-center">
                      {/* 👇 КРАСНЫЙ БЕЙДЖИК НЕПРОЧИТАННЫХ 👇 */}
                      {unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse shadow-sm">
                          {unreadCount}
                        </span>
                      )}
                      {!chat.manager_id && (
                        <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          НОВЫЙ
                        </span>
                      )}
                      {isMine && (
                        <span className="bg-teal-100 text-teal-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          МОЙ
                        </span>
                      )}
                      {isTakenByOther && (
                        <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Lock size={10} /> {chat.manager_name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ПРАВАЯ ПАНЕЛЬ */}
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
            <h2 className="text-xl font-bold text-gray-700">Рабочая область</h2>
            <p className="text-gray-500 text-sm mt-2 max-w-sm">
              Выберите чат из списка слева. Новые сообщения будут отмечены
              красным кружком.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// === КОМПОНЕНТ ПРАВОЙ ПАНЕЛИ ===
function ChatArea({ chat, token, myId, onChatClosed }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const ws = useRef(null);
  const messagesEndRef = useRef(null);

  const [isPatientTyping, setIsPatientTyping] = useState(false);
  const typingTimeout = useRef(null);

  const isMine = chat.manager_id === myId;
  const isTakenByOther = chat.manager_id && chat.manager_id !== myId;
  const isUnassigned = !chat.manager_id;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isPatientTyping]);

  useEffect(() => {
    setMessages([]);
    fetch(`${API_BASE_URL}/api/chat/history/${chat.session_token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "closed") onChatClosed();
        else {
          const historyMsgs = (data.messages || []).map((m) => ({
            ...m,
            isRead: true,
          }));
          setMessages(historyMsgs);
        }
      });

    ws.current = new WebSocket(`${WS_BASE_URL}/ws/chat/${chat.session_token}`);

    ws.current.onopen = () => {
      ws.current.send(JSON.stringify({ type: "read", sender: "manager" }));
    };

    ws.current.onmessage = (event) => {
      const newMsg = JSON.parse(event.data);

      if (newMsg.type === "typing") {
        if (newMsg.sender === "client") {
          setIsPatientTyping(true);
          clearTimeout(typingTimeout.current);
          typingTimeout.current = setTimeout(
            () => setIsPatientTyping(false),
            2000,
          );
        }
        return;
      }
      if (newMsg.type === "read") {
        if (newMsg.sender === "client") {
          setMessages((prev) =>
            prev.map((m) =>
              m.sender === "manager" ? { ...m, isRead: true } : m,
            ),
          );
        }
        return;
      }

      if (newMsg.sender === "client") {
        setIsPatientTyping(false);
        if (ws.current)
          ws.current.send(JSON.stringify({ type: "read", sender: "manager" }));
      }

      setMessages((prev) => [...prev, newMsg]);

      if (newMsg.sender === "system" && newMsg.text.includes("завершил")) {
        alert("Чат был завершен.");
        onChatClosed();
      }
    };

    return () => {
      if (ws.current) ws.current.close();
    };
    // Тот самый фикс, чтобы чат не дергался!
  }, [chat.session_token]);

  const acceptChat = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/manager/chats/${chat.session_token}/accept`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!res.ok) alert("Ошибка принятия чата");
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
              <span className="text-[10px] text-gray-400 mt-1 mx-1 flex items-center gap-1">
                {msg.timestamp}
                {isMe && (
                  <span
                    className={
                      msg.isRead
                        ? "text-teal-500 font-bold tracking-tighter"
                        : "text-gray-400"
                    }
                  >
                    {msg.isRead ? "✓✓" : "✓"}
                  </span>
                )}
              </span>
            </div>
          );
        })}
        {isPatientTyping && (
          <div className="flex self-start items-center gap-2 text-gray-400 text-xs italic bg-white/50 px-3 py-1.5 rounded-full mt-2">
            <span className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
              <span
                className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></span>
              <span
                className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.4s" }}
              ></span>
            </span>
            Пациент печатает...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

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
          <div className="w-full max-w-5xl flex flex-col gap-2">
            {/* 👇 БЛОК БЫСТРЫХ ОТВЕТОВ МЕНЕДЖЕРА 👇 */}
            <div
              className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pb-2"
              style={{ scrollbarWidth: "thin" }}
            >
              {[
                "👋 Здравствуйте! Чем могу вам помочь?",
                "📝 Для записи, пожалуйста, напишите ваше полное ФИО и ИИН.",
                "📅 К какому специалисту и на какую дату вы хотели бы записаться?",
                "✅ Вы успешно записаны! Спасибо за обращение! Будьте здоровы!",
                "💳 Стоимость первичного приема этого специалиста составляет: ",
                "🩸 Сдать анализы можно по живой очереди в ПН-ПТ с 08:00 до 11:00. Обязательно натощак!",
                "📍 Мы находимся по адресу: горд Алматы Проспект Райымбека, 263/2. Главный вход со стороны улицы Райымбека.",
                "🙏 Приносим извинения за ожидание! Линия перегружена. Ваш вопрос: ",
                "✅ Ваш вопрос решен. Спасибо за обращение! Будьте здоровы!",
              ].map((reply, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    // Если шаблон требует дописывания (заканчивается на двоеточие или пробел), вставляем в поле ввода
                    if (reply.endsWith(": ") || reply.endsWith("...")) {
                      setText(reply);
                    } else {
                      // Иначе отправляем сразу
                      if (ws.current) {
                        ws.current.send(
                          JSON.stringify({ sender: "manager", text: reply }),
                        );
                      }
                    }
                  }}
                  className="text-[11px] font-medium bg-white border border-teal-200 text-teal-700 px-3 py-1.5 rounded-full shadow-sm hover:bg-teal-50 transition-colors text-left"
                >
                  {reply}
                </button>
              ))}
            </div>
            {/* 👆 КОНЕЦ БЛОКА ШАБЛОНОВ 👆 */}

            <form onSubmit={sendMessage} className="flex gap-2 w-full">
              <input
                type="text"
                placeholder="Сообщение..."
                className="flex-1 rounded-full px-6 py-3 border-none shadow-sm focus:ring-2 focus:ring-teal-500 outline-none"
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  if (ws.current)
                    ws.current.send(
                      JSON.stringify({ type: "typing", sender: "manager" }),
                    );
                }}
              />
              <button
                type="submit"
                disabled={!text.trim()}
                className="bg-teal-600 text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-teal-700 transition disabled:opacity-50 shrink-0 shadow-sm"
              >
                <Send size={18} className="ml-1" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
