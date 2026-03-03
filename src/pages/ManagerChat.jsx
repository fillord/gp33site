import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Send, CheckCircle, User, Info } from "lucide-react";

import { API_BASE_URL } from "../config";
const WS_BASE_URL = API_BASE_URL.replace(/^http/, "ws");

export default function ManagerChat() {
  const { sessionToken } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [status, setStatus] = useState("open");
  const ws = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/chat/history/${sessionToken}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.messages) setMessages(data.messages);
        setStatus(data.status);
      });

    ws.current = new WebSocket(`${WS_BASE_URL}/ws/chat/${sessionToken}`);
    ws.current.onmessage = (event) => {
      const newMsg = JSON.parse(event.data);
      setMessages((prev) => [...prev, newMsg]);
      if (newMsg.sender === "system") setStatus("closed");
    };
    return () => {
      if (ws.current) ws.current.close();
    };
  }, [sessionToken]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!text.trim() || !ws.current || status === "closed") return;
    ws.current.send(JSON.stringify({ sender: "manager", text: text.trim() }));
    setText("");
  };

  const closeChat = async () => {
    if (!window.confirm("Вы уверены, что хотите завершить диалог?")) return;
    await fetch(`${API_BASE_URL}/api/chat/close/${sessionToken}`, {
      method: "POST",
    });
    setStatus("closed");
  };

  return (
    <div className="flex flex-col h-screen bg-[#F0F2F5] font-sans selection:bg-teal-200">
      {/* Шапка чата */}
      <div className="bg-white px-6 py-4 flex justify-between items-center shadow-sm z-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-tr from-gray-100 to-gray-200 rounded-full flex items-center justify-center border border-gray-200">
            <User size={20} className="text-gray-500" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900">Диалог с пациентом</h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div
                className={`w-2 h-2 rounded-full ${status === "open" ? "bg-emerald-500 animate-pulse" : "bg-gray-400"}`}
              ></div>
              <span className="text-xs font-medium text-gray-500">
                {status === "open" ? "Пациент онлайн" : "Диалог завершен"}
              </span>
            </div>
          </div>
        </div>

        {status === "open" && (
          <button
            onClick={closeChat}
            className="flex items-center gap-2 bg-red-50 hover:bg-red-500 text-red-600 hover:text-white px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 border border-red-100 hover:border-red-500 shadow-sm"
          >
            <CheckCircle size={18} /> <span>Вопрос решен</span>
          </button>
        )}
      </div>

      {/* Зона сообщений */}
      <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4">
        <div className="text-center mb-4">
          <span className="bg-white/60 backdrop-blur-sm text-gray-500 text-xs font-medium px-4 py-1.5 rounded-full shadow-sm">
            Начало переписки
          </span>
        </div>

        {messages.map((msg, idx) => {
          const isManager = msg.sender === "manager";
          const isSystem = msg.sender === "system";

          if (isSystem) {
            return (
              <div key={idx} className="flex justify-center my-4">
                <div className="bg-gray-800/80 backdrop-blur-sm text-white text-xs font-medium px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm">
                  <Info size={14} /> {msg.text}
                </div>
              </div>
            );
          }

          return (
            <div
              key={idx}
              className={`flex flex-col max-w-[75%] ${isManager ? "self-end items-end" : "self-start items-start"}`}
            >
              <div
                className={`px-5 py-3 rounded-[1.25rem] text-[15px] leading-relaxed shadow-sm ${
                  isManager
                    ? "bg-gradient-to-br from-teal-500 to-emerald-500 text-white rounded-br-sm"
                    : "bg-white border border-gray-100 text-gray-800 rounded-bl-sm"
                }`}
              >
                {msg.text}
              </div>
              <div className="flex items-center gap-1 mt-1.5 mx-1">
                <span className="text-[11px] font-medium text-gray-400">
                  {msg.timestamp}
                </span>
                {isManager && (
                  <CheckCircle size={10} className="text-teal-500" />
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Зона ввода */}
      <div className="bg-white p-4 sm:px-6 shadow-[0_-4px_20px_rgb(0,0,0,0.02)] z-10">
        {status === "closed" ? (
          <div className="text-center text-gray-500 font-medium py-3 bg-gray-50 rounded-2xl border border-gray-100">
            Этот диалог был завершен и закрыт для новых сообщений.
          </div>
        ) : (
          <form
            onSubmit={sendMessage}
            className="flex items-end gap-3 max-w-4xl mx-auto"
          >
            <div className="flex-1 bg-gray-50 border border-gray-200 rounded-3xl overflow-hidden focus-within:ring-2 focus-within:ring-teal-500/30 focus-within:border-teal-500 transition-all">
              <textarea
                rows="1"
                placeholder="Напишите ответ пациенту..."
                className="w-full bg-transparent px-5 py-3.5 text-[15px] outline-none resize-none max-h-32 min-h-[52px]"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage(e);
                  }
                }}
              />
            </div>
            <button
              type="submit"
              disabled={!text.trim()}
              className="bg-gradient-to-tr from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white p-3.5 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-teal-500/20 hover:shadow-teal-500/40 hover:-translate-y-0.5 shrink-0"
            >
              <Send size={22} className="ml-1" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}