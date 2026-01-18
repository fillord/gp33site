import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Loader2, MessageCircle } from 'lucide-react';

export default function GuestAppealsList({ category }) {
  const { lang } = useOutletContext();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Тексты для заголовков
  const texts = {
    ru: {
      thanks: "Благодарности пациентов",
      complaint: "Жалобы и обращения",
      empty: "В данной категории пока нет записей.",
      readMore: "Читать полностью"
    },
    kz: {
      thanks: "Пациенттердің алғыстары",
      complaint: "Шағымдар мен өтініштер",
      empty: "Бұл санатта әзірге жазбалар жоқ.",
      readMore: "Толығырақ оқу"
    }
  };

  const t = texts[lang] || texts.ru;
  const title = category === 'thanks' ? t.thanks : t.complaint;

  // Адрес бэкенда
  const API_URL = 'http://localhost:8000';

  useEffect(() => {
    setLoading(true);
    // Запрашиваем с сервера (category передается пропсом: 'thanks' или 'complaint')
    fetch(`${API_URL}/api/appeals?category=${category}`)
      .then(res => res.json())
      .then(data => {
        setItems(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
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

      {!loading && items.length === 0 && (
        <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-500 text-lg">{t.empty}</p>
        </div>
      )}

      <div className="space-y-6">
        {items.map((item) => (
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