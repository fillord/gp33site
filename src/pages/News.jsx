import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Activity, Loader, X, Calendar, ChevronRight } from 'lucide-react';

// 👇 ЛОКАЛЬНЫЕ АДРЕСА
export const API_URL = "https://almgp33.kz/api";
export const DOMAIN_URL = "https://almgp33.kz";

export default function News() {
  const { lang } = useOutletContext();
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/news`) 
      .then(res => res.json())
      .then(data => {
        setNewsList(data);
        setLoading(false);
      })
      .catch(err => setLoading(false));
  }, []);

  const t = {
    title: lang === 'ru' ? "Новости поликлиники" : "Емхана жаңалықтары",
    empty: lang === 'ru' ? "Новостей пока нет" : "Жаңалықтар әзірге жоқ",
    readMore: lang === 'ru' ? "Читать полностью" : "Толығырақ оқу",
    close: lang === 'ru' ? "Закрыть" : "Жабу"
  };

  return (
    <div className="container mx-auto px-4 py-12 relative">
      <h2 className="text-3xl font-bold text-teal-800 mb-8 border-l-8 border-teal-500 pl-4">
        {t.title}
      </h2>

      {loading ? (
        <div className="flex justify-center py-20"><Loader className="animate-spin text-teal-600" size={40}/></div>
      ) : newsList.length === 0 ? (
        <p className="text-gray-500">{t.empty}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsList.map((item) => {
            const displayTitle = (lang === 'kz' && item.titleKz) ? item.titleKz : item.title;
            const displayText = (lang === 'kz' && item.textKz) ? item.textKz : item.text;

            return (
              <div 
                key={item.id} 
                onClick={() => setSelectedNews(item)}
                className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col overflow-hidden border border-gray-100 cursor-pointer group transform hover:-translate-y-1"
              >
                {/* === ФОТО === */}
                <div className="h-48 relative overflow-hidden bg-gray-100">
                    {item.image ? (
                        // 👇 УБРАЛИ ЛИШНИЙ СЛЭШ
                        <img 
                            src={`${DOMAIN_URL}${item.image}`} 
                            alt={displayTitle} 
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-teal-50 to-teal-100 flex items-center justify-center text-teal-300">
                             <Activity size={64} className="group-hover:scale-110 transition"/>
                        </div>
                    )}
                    
                    <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded-full text-xs font-bold text-teal-700 shadow flex items-center">
                        <Calendar size={12} className="mr-1"/> {item.date}
                    </div>
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                   <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-teal-700 transition line-clamp-2">
                      {displayTitle}
                   </h3>
                   <p className="text-gray-600 mb-4 line-clamp-3 text-sm flex-grow">
                      {displayText}
                   </p>
                   <div className="mt-auto pt-4 border-t border-gray-100 flex items-center text-teal-600 font-bold text-sm uppercase tracking-wide group-hover:underline">
                      {t.readMore} <ChevronRight size={16} className="ml-1"/>
                   </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* === МОДАЛЬНОЕ ОКНО === */}
      {selectedNews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative animate-scale-in flex flex-col">
             
             {selectedNews.image && (
                 <div className="w-full h-64 sm:h-80 flex-shrink-0">
                     {/* 👇 И ТУТ ТОЖЕ БЕЗ СЛЭША */}
                     <img 
                        src={`${DOMAIN_URL}${selectedNews.image}`} 
                        alt="News Cover" 
                        className="w-full h-full object-cover"
                     />
                 </div>
             )}

             <button 
               onClick={() => setSelectedNews(null)}
               className="absolute top-4 right-4 bg-white/80 hover:bg-white p-2 rounded-full transition z-10 shadow"
             >
               <X size={24} className="text-gray-800"/>
             </button>

             <div className="p-8">
                <div className="flex items-center text-teal-600 font-bold mb-4 text-sm">
                   <Calendar size={16} className="mr-2"/> 
                   {selectedNews.date}
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                   {(lang === 'kz' && selectedNews.titleKz) ? selectedNews.titleKz : selectedNews.title}
                </h2>
                <div className="prose prose-teal max-w-none text-gray-700 whitespace-pre-line leading-relaxed">
                   {(lang === 'kz' && selectedNews.textKz) ? selectedNews.textKz : selectedNews.text}
                </div>
             </div>
             
             <div className="bg-gray-50 p-6 border-t flex justify-end">
                <button 
                  onClick={() => setSelectedNews(null)}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-6 rounded-lg transition"
                >
                  {t.close}
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}