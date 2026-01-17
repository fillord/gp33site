import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { MapPin, Info, Search, Layers } from 'lucide-react';

export default function ServicesArea() {
  const { lang } = useOutletContext();
  const [searchTerm, setSearchTerm] = useState('');

  const t = {
    breadcrumb: lang === 'ru' ? "ГЛАВНАЯ / ОБСЛУЖИВАЕМАЯ ТЕРРИТОРИЯ" : "БАСТЫ БЕТ / ҚЫЗМЕТ КӨРСЕТІЛЕТІН АУМАҚ",
    title: lang === 'ru' ? "Карта обслуживания поликлиники" : "Емхананың қызмет көрсету картасы",
    subtitle: lang === 'ru' 
      ? "Зона обслуживания разделена на 8 терапевтических участков в Жетысуском районе (квадрат улиц: Рыскулова — Райымбека — Кудерина)." 
      : "Қызмет көрсету аймағы Жетісу ауданындағы 8 терапиялық учаскеге бөлінген (көшелер шаршысы: Рысқұлов — Райымбек — Кудерин).",
    
    searchPlaceholder: lang === 'ru' ? "Поиск улицы..." : "Көшені іздеу...",
    
    stats: [
      { label: { ru: "Население", kz: "Халық саны" }, value: "15 000+" },
      { label: { ru: "Участков", kz: "Учаскелер" }, value: "8" },
      { label: { ru: "Район", kz: "Аудан" }, value: { ru: "Жетысуский", kz: "Жетісу" } }
    ],

    streetsTitle: lang === 'ru' ? "Улицы по участкам" : "Учаскелер бойынша көшелер",
    notFound: lang === 'ru' ? "Улица не найдена" : "Көше табылмады",
    legendTitle: lang === 'ru' ? "Условные обозначения:" : "Шартты белгілер:",
    uchastok: lang === 'ru' ? "Участок" : "Учаске"
  };

  const streets = [
    { ru: "проспект Райымбека", kz: "Райымбек даңғылы", houses: "Нечетная сторона (от ул. Кудерина)" },
    { ru: "проспект Рыскулова", kz: "Рысқұлов даңғылы", houses: "Четная сторона" },
    { ru: "улица Кудерина", kz: "Кудерин көшесі", houses: "Все дома" },
    { ru: "улица Сокпакбаева", kz: "Соқпақбаев көшесі", houses: "Все дома" },
    { ru: "улица Гончарова", kz: "Гончаров көшесі", houses: "Все дома" },
    { ru: "улица Скрябина", kz: "Скрябин көшесі", houses: "Все дома" },
    { ru: "улица Крылова", kz: "Крылов көшесі", houses: "Все дома" },
    { ru: "улица Есенова", kz: "Есенов көшесі", houses: "Все дома" },
    { ru: "улица Казакова", kz: "Казаков көшесі", houses: "Все дома" },
    { ru: "улица Тургута Озала", kz: "Тұрғыт Өзал көшесі", houses: "Частично (ниже Райымбека)" },
    { ru: "улица Боткина", kz: "Боткин көшесі", houses: "Все дома" },
    { ru: "улица Павленко", kz: "Павленко көшесі", houses: "Все дома" }
  ];

  // Цвета для участков (согласно вашему скриншоту)
  const districtColors = [
    { id: 1, color: 'bg-yellow-400' }, // Оранжевый/Желтый
    { id: 2, color: 'bg-green-400' },  // Салатовый
    { id: 3, color: 'bg-indigo-500' }, // Синий/Фиолетовый
    { id: 4, color: 'bg-pink-500' },   // Розовый
    { id: 5, color: 'bg-purple-500' }, // Фиолетовый
    { id: 6, color: 'bg-blue-400' },   // Голубой
    { id: 7, color: 'bg-teal-400' },   // Бирюзовый
    { id: 8, color: 'bg-violet-400' }  // Сиреневый
  ];

  const filteredStreets = streets.filter(s => 
    s[lang].toLowerCase().includes(searchTerm.toLowerCase())
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
          <p className="text-lg opacity-90 max-w-3xl">{t.subtitle}</p>
        </div>
      </div>

      {/* 2. CONTENT */}
      <div className="container mx-auto px-4 py-12">
        
        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
           {t.stats.map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-teal-500 flex items-center justify-between">
                 <div>
                    <div className="text-gray-500 text-sm uppercase font-bold">{stat.label[lang]}</div>
                    <div className="text-3xl font-bold text-gray-800">
                       {typeof stat.value === 'object' ? stat.value[lang] : stat.value}
                    </div>
                 </div>
                 <div className="bg-teal-50 p-3 rounded-full text-teal-600">
                    <Info size={24} />
                 </div>
              </div>
           ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:h-[600px]">
           
           {/* ЛЕВАЯ КОЛОНКА: СПИСОК УЛИЦ */}
           <div className="lg:w-1/3 bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col h-[500px] lg:h-auto">
              <div className="p-6 border-b border-gray-100 bg-gray-50 rounded-t-xl">
                 <h3 className="font-bold text-gray-800 mb-4">{t.streetsTitle}</h3>
                 <div className="relative">
                    <input 
                      type="text" 
                      placeholder={t.searchPlaceholder} 
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 outline-none"
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18}/>
                 </div>
              </div>
              
              <div className="flex-grow overflow-y-auto p-2 space-y-2">
                 {filteredStreets.length > 0 ? (
                    filteredStreets.map((street, i) => (
                       <div key={i} className="p-3 hover:bg-teal-50 rounded-lg transition group cursor-default border-b border-gray-50 last:border-0">
                          <div className="flex items-center text-teal-800 font-bold">
                             <MapPin size={16} className="mr-2 text-teal-500 group-hover:text-teal-700" />
                             {street[lang]}
                          </div>
                          <div className="text-xs text-gray-500 ml-6 mt-1 flex items-center">
                             <Layers size={12} className="mr-1"/> {street.houses}
                          </div>
                       </div>
                    ))
                 ) : (
                    <div className="text-center py-8 text-gray-400">{t.notFound}</div>
                 )}
              </div>
           </div>

           {/* ПРАВАЯ КОЛОНКА: КАРТА (ИЗОБРАЖЕНИЕ) */}
           <div className="lg:w-2/3 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 relative group">
              
              {/* ВАЖНО: Убедитесь, что файл map.png лежит в папке public */}
              <img 
                src="/map.png" 
                alt="Map of Service Area" 
                className="w-full h-full object-cover object-center transform transition duration-700 group-hover:scale-105"
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = "https://via.placeholder.com/800x600?text=Пожалуйста,+добавьте+файл+map.png+в+папку+public";
                }}
              />
              
              {/* ОБНОВЛЕННАЯ ЛЕГЕНДА (Условные обозначения) */}
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-md border border-gray-200 text-xs hidden md:block max-h-[300px] overflow-y-auto">
                 <div className="font-bold mb-3 uppercase text-gray-600">{t.legendTitle}</div>
                 <div className="space-y-2">
                    {districtColors.map(d => (
                       <div key={d.id} className="flex items-center">
                          <div className={`w-3 h-3 ${d.color} rounded-full mr-2 border border-gray-300 shadow-sm`}></div> 
                          <span className="font-medium text-gray-700">{d.id} {t.uchastok}</span>
                       </div>
                    ))}
                 </div>
              </div>

              {/* Плашка с названием */}
              <div className="absolute bottom-6 left-6 bg-teal-600/90 text-white p-4 rounded-xl shadow-lg backdrop-blur-md pointer-events-none">
                 <h4 className="font-bold leading-tight">
                    {lang === 'ru' ? "Карта участков ГП №33" : "№33 ҚЕ учаскелер картасы"}
                 </h4>
              </div>
           </div>

        </div>

      </div>
    </div>
  );
}