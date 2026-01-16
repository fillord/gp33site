import React from 'react';
import { useOutletContext } from 'react-router-dom';

export default function TemplatePage({ title, content }) {
  const { lang } = useOutletContext();
  
  // Проверяем: если title - это объект {ru: "", kz: ""}, выбираем по языку. 
  // Если просто строка - оставляем строку.
  const displayTitle = typeof title === 'object' ? title[lang] : title;
  const displayContent = typeof content === 'object' ? content[lang] : content;

  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-teal-800 mb-6 border-b pb-4">{displayTitle}</h2>
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 min-h-[300px]">
        {displayContent ? displayContent : (
          <p className="text-gray-500 italic">
            {lang === 'ru' ? 'Контент в разработке.' : 'Мазмұны әзірленуде.'}
          </p>
        )}
      </div>
    </div>
  );
}