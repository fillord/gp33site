import React from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
// Не забудьте фигурные скобки, как мы исправили в прошлый раз
import { pagesData } from '../data/pagesData'; 
import DocumentsList from '../components/DocumentsList'; 

export default function UniversalPage({ pageId }) {
  const { lang } = useOutletContext();
  
  // Берем ID страницы из props или из URL
  const params = useParams();
  const id = pageId || params.id || '404';

  // Проверка на наличие базы данных
  if (!pagesData) {
    return <div className="p-10 text-center text-red-500">Ошибка: pagesData не найден</div>;
  }

  const data = pagesData[id];

  // Если страницы нет в базе данных
  if (!data) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-400">
            Страница не найдена / Парақ табылмады ({id})
        </h1>
        {/* Показываем документы, даже если описания страницы нет */}
        <DocumentsList category={id} />
      </div>
    );
  }

  // Получаем контент на нужном языке (или на русском по умолчанию)
  const content = data[lang] || data.ru || {};

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Заголовок (если есть) */}
      {content.title && (
        <h1 className="text-3xl md:text-4xl font-bold text-teal-800 mb-6 border-b-2 border-teal-500 pb-4 inline-block">
          {content.title}
        </h1>
      )}
      
      {/* Текст (только если он есть) */}
      {content.text && (
        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed mb-8">
          {content.text.split('\n').map((line, idx) => (
            <p key={idx} className="mb-4">{line}</p>
          ))}
        </div>
      )}

      {/* Список документов */}
      <DocumentsList category={id} />
    </div>
  );
}