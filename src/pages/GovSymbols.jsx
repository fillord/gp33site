import React from 'react';
import { useOutletContext } from 'react-router-dom';

export default function GovSymbols() {
  const { lang } = useOutletContext();

  const t = {
    title: lang === 'ru' ? "Государственные символы Республики Казахстан" : "Қазақстан Республикасының мемлекеттік рәміздері",
    flag: {
      title: lang === 'ru' ? "Государственный Флаг" : "Мемлекеттік Ту",
      desc: lang === 'ru' ? "Голубой цвет означает бесконечное небо и мирное благополучие." : "Көгілдір түс шексіз аспан мен бейбітшілікті білдіреді."
    },
    emblem: {
      title: lang === 'ru' ? "Государственный Герб" : "Мемлекеттік Елтаңба",
      desc: lang === 'ru' ? "Образ шанырака — символ общего дома и единой Родины." : "Шаңырақ бейнесі — ортақ үй мен біртұтас Отанның символы."
    },
    anthem: {
      title: lang === 'ru' ? "Государственный Гимн" : "Мемлекеттік Әнұран",
      desc: lang === 'ru' ? "Музыкальное произведение, вобравшее в себя дух народа." : "Халықтың рухын бойына сіңірген музыкалық шығарма.",
      btn: lang === 'ru' ? "Читать текст" : "Мәтінді оқу"
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-teal-800 mb-10 text-center">{t.title}</h2>
      
      <div className="grid md:grid-cols-3 gap-8">
        {/* Флаг */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-teal-50 text-center hover:-translate-y-1 transition">
          <div className="h-40 bg-blue-100 mb-4 flex items-center justify-center rounded text-blue-300 font-bold text-4xl">🇰🇿</div>
          <h3 className="text-xl font-bold mb-2">{t.flag.title}</h3>
          <p className="text-sm text-gray-600">{t.flag.desc}</p>
        </div>

        {/* Герб */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-teal-50 text-center hover:-translate-y-1 transition">
          <div className="h-40 bg-yellow-100 mb-4 flex items-center justify-center rounded text-yellow-500 font-bold text-4xl">🔱</div>
          <h3 className="text-xl font-bold mb-2">{t.emblem.title}</h3>
          <p className="text-sm text-gray-600">{t.emblem.desc}</p>
        </div>

        {/* Гимн */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-teal-50 text-center hover:-translate-y-1 transition">
          <div className="h-40 bg-teal-100 mb-4 flex items-center justify-center rounded text-teal-500 font-bold text-4xl">♪</div>
          <h3 className="text-xl font-bold mb-2">{t.anthem.title}</h3>
          <p className="text-sm text-gray-600">{t.anthem.desc}</p>
          <button className="mt-4 text-teal-700 font-bold hover:underline">{t.anthem.btn} →</button>
        </div>
      </div>
    </div>
  );
}