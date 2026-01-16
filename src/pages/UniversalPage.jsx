import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { pagesData } from '../data/pagesData'; // Импортируем нашу базу

export default function UniversalPage({ pageId }) {
  const { lang } = useOutletContext();
  
  // Ищем данные по ID
  const data = pagesData[pageId];

  // Если данных нет (забыли добавить в базу)
  if (!data) {
    return (
      <div className="container mx-auto px-4 py-12 text-center text-gray-500">
        Page ID "{pageId}" not found in database.
      </div>
    );
  }

  // Получаем контент на нужном языке
  const currentLangData = data[lang] || data['ru']; // Если нет KZ, покажем RU

  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-teal-800 mb-6 border-b pb-4">
        {currentLangData.title}
      </h2>
      
      {/* Рендерим HTML контент */}
      <div 
        className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 min-h-[300px] prose max-w-none"
        dangerouslySetInnerHTML={{ __html: currentLangData.content }} 
      />
    </div>
  );
}