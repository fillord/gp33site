import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FileText, Search, ExternalLink, Scale, ScrollText } from 'lucide-react';

export default function ServicesStandards() {
  const { lang } = useOutletContext();
  const [searchTerm, setSearchTerm] = useState('');

  const t = {
    breadcrumb: lang === 'ru' ? "ГЛАВНАЯ / СТАНДАРТЫ ГОСУСЛУГ" : "БАСТЫ БЕТ / МЕМЛЕКЕТТІК ҚЫЗМЕТТЕР СТАНДАРТТАРЫ",
    title: lang === 'ru' ? "Стандарты оказания государственных услуг" : "Мемлекеттік қызметтерді көрсету стандарттары",
    subtitle: lang === 'ru' ? "Нормативные требования, сроки и порядок оказания услуг" : "Нормативтік талаптар, қызмет көрсету мерзімдері мен тәртібі",
    search: lang === 'ru' ? "Поиск стандарта..." : "Стандартты іздеу...",
    linkText: lang === 'ru' ? "Смотреть на Adilet.zan.kz" : "Adilet.zan.kz сайтында көру"
  };

  // Список стандартов (Приказы Министра)
  const standards = [
    {
      id: 1,
      title: { 
        ru: "Стандарт государственной услуги «Вызов врача на дом»", 
        kz: "«Дәрігерді үйге шақыру» мемлекеттік көрсетілетін қызмет стандарты" 
      },
      order: {
        ru: "Приказ Министра здравоохранения РК от 27 апреля 2015 года № 272",
        kz: "ҚР Денсаулық сақтау министрінің 2015 жылғы 27 сәуірдегі № 272 бұйрығы"
      },
      link: "https://adilet.zan.kz/rus/docs/V1500011304"
    },
    {
      id: 2,
      title: { 
        ru: "Стандарт государственной услуги «Запись на прием к врачу»", 
        kz: "«Дәрігердің қабылдауына жазылу» мемлекеттік көрсетілетін қызмет стандарты" 
      },
      order: {
        ru: "Приказ Министра здравоохранения РК от 27 апреля 2015 года № 272",
        kz: "ҚР Денсаулық сақтау министрінің 2015 жылғы 27 сәуірдегі № 272 бұйрығы"
      },
      link: "https://adilet.zan.kz/rus/docs/V1500011304"
    },
    {
      id: 3,
      title: { 
        ru: "Стандарт государственной услуги «Прикрепление к медицинской организации, оказывающей ПМСП»", 
        kz: "«МСАК көрсететін медициналық ұйымға тіркелу» мемлекеттік көрсетілетін қызмет стандарты" 
      },
      order: {
        ru: "Приказ Министра здравоохранения РК от 13 ноября 2020 года № ҚР ДСМ-194/2020",
        kz: "ҚР Денсаулық сақтау министрінің 2020 жылғы 13 қарашадағы № ҚР ДСМ-194/2020 бұйрығы"
      },
      link: "https://adilet.zan.kz/rus/docs/V2000021642"
    },
    {
      id: 4,
      title: { 
        ru: "Стандарт государственной услуги «Выдача справки с медицинской организации, оказывающей ПМСП»", 
        kz: "«МСАК көрсететін медициналық ұйымнан анықтама беру» мемлекеттік көрсетілетін қызмет стандарты" 
      },
      order: {
        ru: "Приказ Министра здравоохранения РК от 27 апреля 2015 года № 272",
        kz: "ҚР Денсаулық сақтау министрінің 2015 жылғы 27 сәуірдегі № 272 бұйрығы"
      },
      link: "https://adilet.zan.kz/rus/docs/V1500011304"
    },
    {
      id: 5,
      title: { 
        ru: "Стандарт государственной услуги «Добровольное анонимное и обязательное конфиденциальное медобследование на ВИЧ»", 
        kz: "«АИТВ-инфекциясына ерікті және міндетті құпия медициналық тексерілу» қызмет стандарты" 
      },
      order: {
        ru: "Приказ Министра здравоохранения РК от 2020 года № ҚР ДСМ-138/2020",
        kz: "ҚР Денсаулық сақтау министрінің 2020 жылғы бұйрығы № ҚР ДСМ-138/2020"
      },
      link: "https://adilet.zan.kz/rus/docs/V2000021469"
    },
    {
      id: 6,
      title: { 
        ru: "Стандарт государственной услуги «Выдача справки с противотуберкулезной организации»", 
        kz: "«Туберкулезге қарсы ұйымнан анықтама беру» мемлекеттік көрсетілетін қызмет стандарты" 
      },
      order: {
        ru: "Приказ Министра здравоохранения РК от 18 мая 2020 года № ҚР ДСМ-49/2020",
        kz: "ҚР Денсаулық сақтау министрінің 2020 жылғы 18 мамырдағы № ҚР ДСМ-49/2020 бұйрығы"
      },
      link: "https://adilet.zan.kz/rus/docs/V2000020666"
    }
  ];

  const filtered = standards.filter(s => 
    s.title[lang].toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.order[lang].toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-[60vh] bg-gray-50">
      
      {/* 1. HEADER */}
      <div className="bg-teal-700 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-xs font-bold text-yellow-400 uppercase tracking-widest mb-2">
            {t.breadcrumb}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold uppercase mb-4">
            {t.title}
          </h1>
          <p className="text-lg opacity-90">{t.subtitle}</p>
        </div>
      </div>

      {/* 2. CONTENT */}
      <div className="container mx-auto px-4 py-12">
        
        {/* Поиск */}
        <div className="max-w-xl mb-10 relative">
          <input 
            type="text" 
            placeholder={t.search} 
            className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-transparent shadow-sm focus:border-teal-500 focus:ring-0 outline-none text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-4 top-4.5 text-gray-400" size={24}/>
        </div>

        {/* Список стандартов */}
        <div className="grid gap-6">
           {filtered.map(item => (
             <div key={item.id} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 flex flex-col md:flex-row items-start md:items-center gap-6 group">
                {/* Иконка */}
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                   <Scale size={32} />
                </div>
                
                {/* Текст */}
                <div className="flex-grow">
                   <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {item.title[lang]}
                   </h3>
                   <div className="flex items-center text-gray-500 text-sm mb-4 md:mb-0">
                      <ScrollText size={16} className="mr-2" />
                      {item.order[lang]}
                   </div>
                </div>

                {/* Кнопка */}
                <a 
                  href={item.link} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex-shrink-0 inline-flex items-center text-sm font-bold text-teal-700 hover:text-white border border-teal-700 hover:bg-teal-700 py-3 px-6 rounded-lg transition"
                >
                  {t.linkText} <ExternalLink size={16} className="ml-2" />
                </a>
             </div>
           ))}
        </div>

        {filtered.length === 0 && (
           <div className="text-center text-gray-500 py-12 text-lg">
              {lang === 'ru' ? "Стандарты не найдены" : "Стандарттар табылмады"}
           </div>
        )}

      </div>
    </div>
  );
}