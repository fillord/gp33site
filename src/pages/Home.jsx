import React, { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { Calendar, FileText, ArrowRight, Activity, Clock, Phone, MapPin, Loader } from 'lucide-react';

const API_URL = 'https://almgp33.kz'; // Адрес вашего сервера

export default function Home() {
  const { lang } = useOutletContext();
  const [latestNews, setLatestNews] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);

  // Загружаем новости при открытии главной страницы
  useEffect(() => {
    fetch(`${API_URL}/api/news`)
      .then(res => res.json())
      .then(data => {
        // Берем только первые 3 (самые свежие)
        setLatestNews(data.slice(0, 3));
        setLoadingNews(false);
      })
      .catch(err => setLoadingNews(false));
  }, []);

  const t = {
    title: lang === 'ru' ? "Городская поликлиника №33" : "№33 Қалалық емхана",
    subtitle: lang === 'ru' ? "Ваше здоровье — наш приоритет" : "Сіздің денсаулығыңыз — біздің басымдығымыз",
    desc: lang === 'ru' 
      ? "Современная поликлиника. Квалифицированные врачи, передовое оборудование и забота о каждом пациенте." 
      : "Заманауи емхана. Білікті дәрігерлер, озық жабдықтар және әрбір пациентке қамқорлық.",
    btnAppoint: lang === 'ru' ? "Записаться к врачу" : "Дәрігерге жазылу",
    btnServices: lang === 'ru' ? "Наши услуги" : "Біздің қызметтер",
    
    newsTitle: lang === 'ru' ? "Последние новости" : "Соңғы жаңалықтар",
    allNews: lang === 'ru' ? "Все новости" : "Барлық жаңалықтар",
    readMore: lang === 'ru' ? "Читать далее" : "Толығырақ",
    
    // Быстрые ссылки
    links: [
      { 
        icon: Clock, 
        title: { ru: "График работы", kz: "Жұмыс кестесі" }, 
        desc: "Пн-Пт: 08:00 - 20:00",
        color: "bg-blue-500"
      },
      { 
        icon: Phone, 
        title: { ru: "Call-центр", kz: "Call-орталық" }, 
        desc: "339-59-03",
        color: "bg-green-500"
      },
      { 
        icon: MapPin, 
        title: { ru: "Наш адрес", kz: "Біздің мекенжай" }, 
        desc: { ru: "пр. Райымбека, 263/2", kz: "Райымбек даңғылы, 263/2" },
        color: "bg-red-500"
      }
    ]
  };

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* === HERO SECTION === */}
      <div className="relative min-h-[500px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero-bg.jpg" 
            alt="Polyclinic" 
            className="w-full h-full object-cover"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-teal-900/95 via-teal-800/80 to-teal-900/40"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-white py-20">
          <div className="max-w-3xl animate-fade-in-up">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight drop-shadow-md">
              {t.title}
            </h1>
            <div className="w-24 h-1.5 bg-yellow-400 rounded mb-6"></div>
            <h2 className="text-xl md:text-2xl font-bold text-yellow-300 mb-4 uppercase tracking-wide">
               {t.subtitle}
            </h2>
            <p className="text-lg md:text-xl mb-10 text-gray-100 leading-relaxed max-w-2xl">
              {t.desc}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="https://damumed.kz" target="_blank" rel="noreferrer" className="bg-yellow-400 text-teal-900 font-bold py-4 px-8 rounded-full shadow-lg hover:bg-yellow-300 hover:scale-105 transition transform flex items-center justify-center">
                <Calendar className="mr-2" size={20}/> {t.btnAppoint}
              </a>
              <Link to="/services/registry" className="border-2 border-white text-white font-bold py-4 px-8 rounded-full hover:bg-white hover:text-teal-800 transition flex items-center justify-center">
                <FileText className="mr-2" size={20}/> {t.btnServices}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* БЫСТРЫЕ ССЫЛКИ */}
      <div className="relative z-20 -mt-10 mb-16 container mx-auto px-4">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {t.links.map((item, i) => (
               <div key={i} className="bg-white rounded-xl shadow-lg p-6 flex items-center hover:-translate-y-1 transition duration-300">
                  <div className={`${item.color} w-14 h-14 rounded-full flex items-center justify-center text-white mr-4 shadow-md flex-shrink-0`}>
                     <item.icon size={24} />
                  </div>
                  <div>
                     <h3 className="font-bold text-gray-800 text-lg">{item.title[lang]}</h3>
                     <p className="text-gray-600 font-medium">{typeof item.desc === 'object' ? item.desc[lang] : item.desc}</p>
                  </div>
               </div>
            ))}
         </div>
      </div>

      {/* === БЛОК НОВОСТЕЙ С ФОТО === */}
      <div className="container mx-auto px-4 pb-20">
        <div className="flex justify-between items-center mb-8 border-l-8 border-teal-500 pl-4">
           <h2 className="text-3xl font-bold text-gray-800">{t.newsTitle}</h2>
           <Link to="/news" className="text-teal-600 font-bold hover:underline flex items-center">
              {t.allNews} <ArrowRight size={20} className="ml-2"/>
           </Link>
        </div>
        
        {loadingNews ? (
           <div className="flex justify-center py-10"><Loader className="animate-spin text-teal-600" size={32}/></div>
        ) : latestNews.length === 0 ? (
           <div className="text-center text-gray-400 py-10">{lang === 'ru' ? 'Новостей пока нет' : 'Жаңалықтар әзірге жоқ'}</div>
        ) : (
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {latestNews.map((item) => {
                 const displayTitle = (lang === 'kz' && item.titleKz) ? item.titleKz : item.title;
                 const displayText = (lang === 'kz' && item.textKz) ? item.textKz : item.text;

                 return (
                   <div key={item.id} className="bg-white rounded-xl shadow hover:shadow-xl transition group overflow-hidden border border-gray-100 flex flex-col">
                      
                      {/* БЛОК С КАРТИНКОЙ */}
                      <div className="h-48 relative overflow-hidden bg-gray-100">
                          {item.image ? (
                              <img 
                                  src={`${API_URL}${item.image}`} 
                                  alt={displayTitle} 
                                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                              />
                          ) : (
                              // Заглушка, если фото нет
                              <div className="w-full h-full bg-teal-50 flex items-center justify-center text-teal-200">
                                   <Activity size={48} className="group-hover:scale-110 transition"/>
                              </div>
                          )}
                          
                          {/* Дата поверх картинки */}
                          <div className="absolute top-4 left-4 bg-white/90 px-2 py-1 rounded text-xs font-bold text-teal-700 shadow backdrop-blur-sm">
                              {item.date}
                          </div>
                      </div>

                      <div className="p-6 flex flex-col flex-grow">
                         <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-teal-600 transition line-clamp-2">
                            {displayTitle}
                         </h3>
                         <p className="text-gray-600 mb-4 line-clamp-3 text-sm flex-grow">
                            {displayText}
                         </p>
                         {/* Ссылка ведет на общую страницу новостей */}
                         <Link to="/news" className="mt-auto text-teal-600 font-bold hover:underline inline-flex items-center">
                            {t.readMore} <ArrowRight size={16} className="ml-1" />
                         </Link>
                      </div>
                   </div>
                 );
              })}
           </div>
        )}
      </div>

    </div>
  );
}