import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FileText, Search, ExternalLink, Activity, Home, UserPlus, FileCheck, ClipboardList } from 'lucide-react';

export default function ServicesRegistry() {
  const { lang } = useOutletContext();
  const [searchTerm, setSearchTerm] = useState('');

  const t = {
    breadcrumb: lang === 'ru' ? "ГЛАВНАЯ / РЕЕСТР ГОСУСЛУГ" : "БАСТЫ БЕТ / МЕМЛЕКЕТТІК ҚЫЗМЕТТЕР ТІЗІЛІМІ",
    title: lang === 'ru' ? "Реестр государственных услуг" : "Мемлекеттік қызметтер тізілімі",
    subtitle: lang === 'ru' ? "Перечень услуг, оказываемых в рамках ГОБМП и ОСМС" : "ТМКЕК және МӘМС шеңберінде көрсетілетін қызметтер тізбесі",
    search: lang === 'ru' ? "Поиск услуги..." : "Қызметті іздеу...",
    egovBtn: lang === 'ru' ? "Получить на Egov.kz" : "Egov.kz арқылы алу"
  };

  // Список стандартных госуслуг поликлиники
  const services = [
    {
      id: 1,
      icon: Home,
      title: { ru: "Вызов врача на дом", kz: "Дәрігерді үйге шақыру" },
      link: "https://egov.kz/cms/ru/services/health_care/494pass_mz"
    },
    {
      id: 2,
      icon: Activity,
      title: { ru: "Запись на прием к врачу", kz: "Дәрігердің қабылдауына жазылу" },
      link: "https://egov.kz/cms/ru/services/495pass_mz"
    },
    {
      id: 3,
      icon: UserPlus,
      title: { ru: "Прикрепление к медицинской организации, оказывающей ПМСП", kz: "МСАК көрсететін медициналық ұйымға тіркелу" },
      link: "https://egov.kz/cms/ru/services/health_care/495pass_mz"
    },
    {
      id: 4,
      icon: FileCheck,
      title: { ru: "Выдача справки с медицинской организации, оказывающей ПМСП", kz: "МСАК көрсететін медициналық ұйымнан анықтама беру" },
      link: "https://egov.kz/cms/ru/services/2F128_mzsr"
    },
    {
      id: 5,
      icon: ClipboardList,
      title: { ru: "Выдача листа о временной нетрудоспособности (Больничный)", kz: "Уақытша еңбекке жарамсыздық туралы парақты беру" },
      link: "#" // Выдается врачом
    },
    {
      id: 6,
      icon: FileText,
      title: { ru: "Выдача справки о временной нетрудоспособности", kz: "Уақытша еңбекке жарамсыздық туралы анықтаманы беру" },
      link: "#" // Выдается врачом
    },
    {
      id: 7,
      icon: FileText,
      title: { ru: "Выдача выписки из медицинской карты стационарного больного", kz: "Стационарлық науқастың медициналық картасынан көшірме беру" },
      link: "https://egov.kz/cms/ru/services/2F131_mzsr"
    },
    {
      id: 8,
      icon: Activity,
      title: { ru: "Добровольное анонимное и обязательное конфиденциальное медобследование на ВИЧ", kz: "АИТВ-инфекциясына ерікті және міндетті құпия медициналық тексерілу" },
      link: "#" // Очно
    },
    {
      id: 9,
      icon: FileCheck,
      title: { ru: "Выдача справки с противотуберкулезной организации", kz: "Туберкулезге қарсы ұйымнан анықтама беру" },
      link: "https://egov.kz/cms/ru/services/2F00604003_mzsr"
    },
    {
      id: 10,
      icon: FileCheck,
      title: { ru: "Выдача справки с психоневрологической организации", kz: "Психоневрологиялық ұйымнан анықтама беру" },
      link: "https://egov.kz/cms/ru/services/2F161_mzsr"
    },
    {
      id: 11,
      icon: FileCheck,
      title: { ru: "Выдача справки с наркологической организации", kz: "Наркологиялық ұйымнан анықтама беру" },
      link: "https://egov.kz/cms/ru/services/2Fpassport"
    },
    {
      id: 12,
      icon: FileText,
      title: { ru: "Прохождение предварительных обязательных медицинских осмотров", kz: "Алдын ала міндетті медициналық тексерулерден өту" },
      link: "#" // Очно
    }
  ];

  const filtered = services.filter(s => s.title[lang].toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="flex flex-col min-h-[60vh] bg-gray-50">
      
      {/* 1. HEADER */}
      <div className="bg-teal-700 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-xs font-bold text-yellow-400 uppercase tracking-widest mb-2">
            {t.breadcrumb}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold uppercase mb-4">
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

        {/* Сетка услуг */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {filtered.map(service => (
             <div key={service.id} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition border border-gray-100 flex flex-col h-full group">
                <div className="mb-4 bg-teal-50 w-14 h-14 rounded-full flex items-center justify-center text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                   <service.icon size={28} />
                </div>
                
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex-grow">
                   {service.title[lang]}
                </h3>

                {service.link !== '#' ? (
                   <a 
                     href={service.link} 
                     target="_blank" 
                     rel="noreferrer" 
                     className="mt-auto inline-flex items-center text-sm font-bold text-blue-600 hover:text-blue-800 bg-blue-50 py-2 px-4 rounded-lg w-fit transition"
                   >
                     {t.egovBtn} <ExternalLink size={14} className="ml-2" />
                   </a>
                ) : (
                   <div className="mt-auto text-sm text-gray-400 font-medium py-2 px-4 bg-gray-50 rounded-lg w-fit">
                      {lang === 'ru' ? "Очно в поликлинике" : "Емханада офлайн"}
                   </div>
                )}
             </div>
           ))}
        </div>

        {filtered.length === 0 && (
           <div className="text-center text-gray-500 py-12 text-lg">
              {lang === 'ru' ? "Услуги не найдены" : "Қызметтер табылмады"}
           </div>
        )}

      </div>
    </div>
  );
}