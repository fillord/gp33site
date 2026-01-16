import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FileText, Search, ExternalLink, ClipboardCheck, ArrowRight } from 'lucide-react';

export default function ServicesRegulations() {
  const { lang } = useOutletContext();
  const [searchTerm, setSearchTerm] = useState('');

  const t = {
    breadcrumb: lang === 'ru' ? "ГЛАВНАЯ / РЕГЛАМЕНТЫ ГОСУСЛУГ" : "БАСТЫ БЕТ / МЕМЛЕКЕТТІК ҚЫЗМЕТТЕР РЕГЛАМЕНТТЕРІ",
    title: lang === 'ru' ? "Регламенты оказания государственных услуг" : "Мемлекеттік қызметтерді көрсету регламенттері",
    subtitle: lang === 'ru' ? "Порядок и процедуры оказания услуг населению" : "Халыққа қызмет көрсету тәртібі мен рәсімдері",
    search: lang === 'ru' ? "Поиск регламента..." : "Регламентті іздеу...",
    viewBtn: lang === 'ru' ? "Открыть регламент" : "Регламентті ашу"
  };

  // Список регламентов (обычно это те же приказы, описывающие порядок)
  const regulations = [
    {
      id: 1,
      title: { 
        ru: "Регламент государственной услуги «Вызов врача на дом»", 
        kz: "«Дәрігерді үйге шақыру» мемлекеттік көрсетілетін қызмет регламенті" 
      },
      desc: {
        ru: "Пошаговый порядок приема вызова, сроки обработки и визита врача.",
        kz: "Шақыруды қабылдаудың қадамдық тәртібі, өңдеу және дәрігердің келу мерзімдері."
      },
      link: "https://adilet.zan.kz/rus/docs/V1500011304"
    },
    {
      id: 2,
      title: { 
        ru: "Регламент государственной услуги «Запись на прием к врачу»", 
        kz: "«Дәрігердің қабылдауына жазылу» мемлекеттік көрсетілетін қызмет регламенті" 
      },
      desc: {
        ru: "Порядок записи через портал Egov, по телефону и при непосредственном обращении.",
        kz: "Egov порталы, телефон арқылы және тікелей жүгіну кезінде жазылу тәртібі."
      },
      link: "https://adilet.zan.kz/rus/docs/V1500011304"
    },
    {
      id: 3,
      title: { 
        ru: "Регламент услуги «Прикрепление к медицинской организации»", 
        kz: "«Медициналық ұйымға тіркелу» қызметінің регламенті" 
      },
      desc: {
        ru: "Процедура подачи заявки на прикрепление, сроки рассмотрения и причины отказа.",
        kz: "Тіркелуге өтінім беру рәсімі, қарау мерзімдері және бас тарту себептері."
      },
      link: "https://adilet.zan.kz/rus/docs/V2000021642"
    },
    {
      id: 4,
      title: { 
        ru: "Регламент выдачи справки с медицинской организации (ПМСП)", 
        kz: "Медициналық ұйымнан (МСАК) анықтама беру регламенті" 
      },
      desc: {
        ru: "Алгоритм получения справок о состоянии здоровья, больничных листов.",
        kz: "Денсаулық жағдай туралы анықтамаларды, аурухана парақтарын алу алгоритмі."
      },
      link: "https://adilet.zan.kz/rus/docs/V1500011304"
    },
    {
      id: 5,
      title: { 
        ru: "Регламент прохождения скрининговых осмотров", 
        kz: "Скринингтік тексерулерден өту регламенті" 
      },
      desc: {
        ru: "Порядок прохождения профилактических осмотров целевыми группами населения.",
        kz: "Халықтың нысаналы топтарының профилактикалық тексерулерден өту тәртібі."
      },
      link: "https://adilet.zan.kz/rus/docs/V2000021818"
    }
  ];

  const filtered = regulations.filter(r => 
    r.title[lang].toLowerCase().includes(searchTerm.toLowerCase())
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

        {/* Список регламентов */}
        <div className="grid gap-4">
           {filtered.map(item => (
             <div key={item.id} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition border-l-4 border-teal-500 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                
                <div className="flex items-start gap-4">
                   <div className="hidden md:flex w-12 h-12 bg-teal-50 text-teal-600 rounded-full items-center justify-center flex-shrink-0">
                      <ClipboardCheck size={24} />
                   </div>
                   <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-1">
                         {item.title[lang]}
                      </h3>
                      <p className="text-gray-500 text-sm">
                         {item.desc[lang]}
                      </p>
                   </div>
                </div>

                <a 
                  href={item.link} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex items-center text-sm font-bold text-blue-600 hover:text-blue-800 hover:underline flex-shrink-0"
                >
                  {t.viewBtn} <ArrowRight size={16} className="ml-1" />
                </a>
             </div>
           ))}
        </div>

        {filtered.length === 0 && (
           <div className="text-center text-gray-500 py-12">
              {lang === 'ru' ? "Документы не найдены" : "Құжаттар табылмады"}
           </div>
        )}

      </div>
    </div>
  );
}