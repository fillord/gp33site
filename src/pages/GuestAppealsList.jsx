import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Loader2, MessageCircle } from 'lucide-react';
import { API_URL } from '../config'; // Убедитесь, что этот файл существует!

export default function GuestAppealsList({ category }) {
  const { lang } = useOutletContext();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const texts = {
    ru: {
      thanks: "Благодарности пациентов",
      complaint: "Жалобы и обращения",
      empty: "В данной категории пока нет записей.",
      error: "Ошибка загрузки данных"
    },
    kz: {
      thanks: "Пациенттердің алғыстары",
      complaint: "Шағымдар мен өтініштер",
      empty: "Бұл санатта әзірге жазбалар жоқ.",
      error: "Деректерді жүктеу қатесі"
    }
  };

  const t = texts[lang] || texts.ru;
  const title = category === 'thanks' ? t.thanks : t.complaint;

  useEffect(() => {
    setLoading(true);
    // Добавляем /api к базовому URL
    const url = `${API_URL}/api/appeals?category=${category}`;
    console.log("Fetching:", url); // Смотрим в консоль браузера (F12)

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        return res.json();
      })
      .then(data => {
        // ЗАЩИТА: Проверяем, что пришел именно массив
        if (Array.isArray(data)) {
            setItems(data);
        } else {
            console.error("Data is not array:", data);
            setItems([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [category]);

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h2 className="text-3xl font-bold text-teal-800 mb-8 flex items-center gap-3">
        <MessageCircle size={32} />
        {title}
      </h2>

      {loading && (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin text-teal-600" size={40} />
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded mb-4">
            Ошибка: {error}. Проверьте консоль (F12).
        </div>
      )}

      {/* ЗАЩИТА: Проверяем items перед map */}
      {!loading && !error && items.length === 0 && (
        <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-500 text-lg">{t.empty}</p>
        </div>
      )}

      <div className="space-y-6">
        {items && items.map((item) => (
          <div key={item.id} className="bg-white p-6 rounded-xl shadow-md border-l-4 border-teal-500 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
              <span className="text-sm text-gray-400 bg-gray-100 px-2 py-1 rounded">
                {item.date}
              </span>
            </div>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}