import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock, Activity, ArrowRight } from "lucide-react";

import { API_BASE_URL } from "../config";

export default function ManagerLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/manager/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) throw new Error("Неверный логин или пароль");

      const data = await res.json();
      localStorage.setItem("manager_token", data.token);
      localStorage.setItem("manager_name", data.name);
      localStorage.setItem("manager_role", data.role);

      // Если это админ - кидаем его в историю, если менеджер - в рабочую панель
      if (data.role === "admin") {
        navigate("/admin/chat-history");
      } else {
        navigate("/manager/dashboard");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-100 p-4 font-sans relative overflow-hidden">
      {/* Декоративные круги на фоне */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-teal-300/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl"></div>

      <div className="bg-white/80 backdrop-blur-xl p-8 sm:p-10 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] w-full max-w-md border border-white relative z-10">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl mx-auto flex items-center justify-center shadow-lg mb-6 transform -rotate-6 hover:rotate-0 transition-all duration-300">
            <Activity
              className="text-white transform rotate-6 hover:rotate-0 transition-all duration-300"
              size={32}
            />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
            GP33 Portal
          </h1>
          <p className="text-gray-500 text-sm mt-2 font-medium">
            Рабочее место сотрудника
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm mb-6 text-center border border-red-100 animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-teal-500 transition-colors">
              <User size={20} />
            </div>
            <input
              type="text"
              required
              placeholder="Логин"
              className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl pl-12 pr-4 py-3.5 focus:bg-white focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 outline-none transition-all"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-teal-500 transition-colors">
              <Lock size={20} />
            </div>
            <input
              type="password"
              required
              placeholder="Пароль"
              className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl pl-12 pr-4 py-3.5 focus:bg-white focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-bold py-3.5 rounded-2xl transition-all duration-300 mt-4 shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 flex justify-center items-center gap-2 overflow-hidden"
          >
            {isLoading ? (
              "Авторизация..."
            ) : (
              <>
                <span>Войти в систему</span>
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
