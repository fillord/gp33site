import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Send,
  User,
  Phone,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { API_URL } from "../config";

export default function Feedback() {
  const { lang } = useOutletContext();

  // 👇 АДРЕС ВАШЕГО БЭКЕНДА

  // Используем 'thanks', 'complaint', 'proposal' для совместимости с сервером
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    category: "thanks",
    message: "",
  });

  const [status, setStatus] = useState(null); // 'loading', 'success', 'error'

  const translations = {
    ru: {
      title: "Подать обращение",
      subtitle:
        "Блог главного врача. Ваше обращение будет рассмотрено администрацией.",
      labels: {
        name: "Ваше ФИО",
        phone: "Телефон",
        type: "Тип обращения",
        msg: "Текст обращения",
        btn: "Отправить",
      },
      // Тексты для UI
      types: {
        predloz: "Предложение ",
        jaloba: "Жалоба ",
        blago: "Благодарность ",
      },
      sending: "Отправка...",
      success: "Спасибо! Ваше обращение отправлено на модерацию.",
      error: "Ошибка отправки. Попробуйте позже.",
    },
    kz: {
      title: "Өтініш беру",
      subtitle: "Бас дәрігердің блогы. Сіздің өтінішіңізді әкімшілік қарайды.",
      labels: {
        name: "Аты-жөніңіз",
        phone: "Телефон",
        type: "Өтініш түрі",
        msg: "Мәтін",
        btn: "Жіберу",
      },
      types: {
        predloz: "Ұсыныс (тек әкімшілік үшін)",
        jaloba: "Шағым (тексерілгеннен кейін жарияланады)",
        blago: "Алғыс (тексерілгеннен кейін жарияланады)",
      },
      sending: "Жіберілуде...",
      success: "Рахмет! Сіздің өтінішіңіз модерацияға жіберілді.",
      error: "Жіберу қатесі. Кейінірек қайталаңыз.",
    },
  };

  const t = translations[lang] || translations.ru;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    try {
      // 👇 ОТПРАВЛЯЕМ НА НАШ PYTHON-СЕРВЕР
      const response = await fetch(`${API_URL}/api/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          category: formData.category, // thanks, complaint, proposal
          message: formData.message,
        }),
      });

      if (response.ok) {
        setStatus("success");
        // Сбрасываем форму
        setFormData({ name: "", phone: "", category: "thanks", message: "" });
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <h2 className="text-3xl font-bold text-teal-800 mb-6 text-center">
        {t.title}
      </h2>
      <p className="text-gray-600 text-center mb-8">{t.subtitle}</p>

      {status === "success" ? (
        <div className="bg-white p-10 rounded-xl shadow-lg border border-teal-100 text-center">
          <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={40} />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">{t.success}</h3>
          <button
            onClick={() => setStatus(null)}
            className="mt-4 text-teal-600 font-bold hover:underline"
          >
            {lang === "ru" ? "Написать еще" : "Тағы жазу"}
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-lg border border-teal-100"
        >
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              {t.labels.name}
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                required
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              {t.labels.phone}
            </label>
            <div className="relative">
              <Phone
                className="absolute left-3 top-3 text-gray-400"
                size={20}
              />
              <input
                type="tel"
                required
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              {t.labels.type}
            </label>
            <select
              className="w-full px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-teal-500"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            >
              {/* Value совпадают с category в БД */}
              <option value="thanks">{t.types.blago}</option>
              <option value="complaint">{t.types.jaloba}</option>
              <option value="proposal">{t.types.predloz}</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2">
              {t.labels.msg}
            </label>
            <textarea
              required
              rows="5"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
            ></textarea>
          </div>

          {status === "error" && (
            <div className="mb-4 bg-red-50 text-red-600 p-3 rounded flex items-center">
              <AlertCircle size={18} className="mr-2" /> {t.error}
            </div>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full bg-teal-600 text-white font-bold py-3 rounded-lg hover:bg-teal-700 transition flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {status === "loading" ? (
              <>
                <Loader2 className="animate-spin" size={20} /> {t.sending}
              </>
            ) : (
              <>
                <Send size={20} /> {t.labels.btn}
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
