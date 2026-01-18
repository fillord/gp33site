import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Calendar, Clock, MapPin, Phone, User, ChevronRight, FileText } from 'lucide-react';

export default function PersonalReception() {
  const { lang } = useOutletContext();

  const t = {
    breadcrumb: lang === 'ru' ? "ГЛАВНАЯ / ЛИЧНЫЙ ПРИЕМ" : "БАСТЫ БЕТ / ЖЕКЕ ҚАБЫЛДАУ",
    title: lang === 'ru' ? "График личного приема граждан" : "Азаматтарды жеке қабылдау кестесі",
    subtitle: lang === 'ru' ? "Администрация ГП №33 на 2026 год" : "№33 ҚЕ әкімшілігі, 2026 жыл",
    
    // Тексты на карточках
    cabinet: lang === 'ru' ? "Кабинет" : "Кабинет",
    time: lang === 'ru' ? "Время приема" : "Қабылдау уақыты",
    
    // Блок записи
    signupTitle: lang === 'ru' ? "Как записаться на прием?" : "Қабылдауға қалай жазылуға болады?",
    signupText: lang === 'ru' 
       ? "Запись осуществляется через приемную директора или Службу поддержки пациентов."
       : "Жазылу директордың қабылдау бөлмесі немесе Пациенттерді қолдау қызметі арқылы жүзеге асырылады.",
    callBtn: lang === 'ru' ? "Позвонить в приемную" : "Қабылдау бөлмесіне қоңырау шалу"
  };

  // Данные (Адаптированы под ГП №33, как в ваших предыдущих запросах)
  const schedule = [
    {
      id: 1,
      role: { ru: "Директор", kz: "Директор" },
      name: { ru: "Абдрасилов Гани Болатович", kz: "Абдрасилов Ғани Болатұлы" },
      // Берем данные, похожие на PDF, но адаптированные
      day: { ru: "Среда", kz: "Сәрсенбі" }, 
      time: "14:00 - 16:00",
      cabinet: "401/1",
      color: "bg-teal-600",
      img: "/director.jpg" // Замените на фото
    },
    {
      id: 2,
      role: { ru: "Зам. директора по лечебной части", kz: "Директордың емдеу ісі жөніндегі орынбасары" },
      name: { ru: "ОРЫНОВ АЛМАЗ МЕДЕУХАНОВИЧ", kz: "ОРЫНОВ АЛМАЗ МЕДЕУХАНОВИЧ" },
      day: { ru: "Вторник, Четверг", kz: "Сейсенбі, Бейсенбі" },
      time: "10:00 - 12:00",
      cabinet: "401/2",
      color: "bg-blue-600",
      img: "/zam_lech.jpg" // Замените на фото
    },
   //  {
   //    id: 3,
   //    role: { ru: "Зам. директора по ККМУ", kz: "Директордың МҚСБ жөніндегі орынбасары" },
   //    name: { ru: "Вакансия", kz: "Вакансия" }, // Если есть человек, впишите
   //    day: { ru: "Среда", kz: "Сәрсенбі" },
   //    time: "14:00 - 16:00",
   //    cabinet: "225",
   //    color: "bg-indigo-600",
   //    img: "https://via.placeholder.com/150?text=Quality"
   //  },
   //  {
   //    id: 4,
   //    role: { ru: "Зам. директора по ОМР", kz: "Директордың ҰӘЖ жөніндегі орынбасары" },
   //    name: { ru: "Вакансия", kz: "Вакансия" },
   //    day: { ru: "Четверг", kz: "Бейсенбі" },
   //    time: "14:00 - 18:00",
   //    cabinet: "223",
   //    color: "bg-purple-600",
   //    img: "https://via.placeholder.com/150?text=Org"
   //  },
    {
      id: 5,
      role: { ru: "Главная медсестра", kz: "Бас мейірбике" },
      name: { ru: "САДАКБАЕВА ГУЛИМ КУАНЫШЕВНА", kz: "САДАКБАЕВА ГУЛИМ КУАНЫШЕВНА" },
      day: { ru: "Пятница", kz: "Жұма" }, // В PDF ГП5 пятница - у гл. медсестры [cite: 5]
      time: "14:00 - 18:00",
      cabinet: "311",
      color: "bg-pink-600",
      img: "/glmed.png" // Замените на фото
    }
  ];

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
        
        {/* Сетка красивых карточек */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
           {schedule.map((person) => (
             <div key={person.id} className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row group hover:shadow-2xl transition duration-300 border border-gray-100">
                
                {/* Левая часть: Фото и цветная полоса */}
                <div className={`md:w-1/3 ${person.color} p-6 flex flex-col items-center justify-center text-white relative overflow-hidden`}>
                   <div className="absolute inset-0 bg-black opacity-10 group-hover:opacity-0 transition"></div>
                   <div className="w-24 h-24 rounded-full border-4 border-white/30 overflow-hidden mb-4 shadow-lg z-10">
                      <img src={person.img} alt={person.name[lang]} className="w-full h-full object-cover" />
                   </div>
                   <div className="text-center z-10">
                      <div className="font-bold text-lg leading-tight mb-1">{person.name[lang]}</div>
                   </div>
                </div>

                {/* Правая часть: Информация */}
                <div className="md:w-2/3 p-6 flex flex-col justify-center">
                   <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                      {person.role[lang]}
                   </div>
                   
                   <div className="space-y-4">
                      {/* День недели (крупно) */}
                      <div className="flex items-center">
                         <div className={`w-10 h-10 rounded-lg ${person.color} bg-opacity-10 text-${person.color.replace('bg-', '')} flex items-center justify-center mr-4`}>
                            <Calendar size={20} className={person.color.replace('bg-', 'text-')} />
                         </div>
                         <div>
                            <div className="font-bold text-xl text-gray-800">{person.day[lang]}</div>
                         </div>
                      </div>

                      {/* Время */}
                      <div className="flex items-center">
                         <div className="w-10 flex justify-center mr-4">
                            <Clock size={18} className="text-gray-400" />
                         </div>
                         <div className="text-gray-600 font-medium">
                            {person.time}
                         </div>
                      </div>

                      {/* Кабинет */}
                      <div className="flex items-center">
                         <div className="w-10 flex justify-center mr-4">
                            <MapPin size={18} className="text-gray-400" />
                         </div>
                         <div className="text-gray-600">
                            {t.cabinet} <span className="font-bold text-gray-800">{person.cabinet}</span>
                         </div>
                      </div>
                   </div>
                </div>

             </div>
           ))}
        </div>

        {/* Блок "Как записаться" */}
        <div className="bg-teal-50 border border-teal-100 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
           <div className="flex items-start gap-4">
              <div className="bg-teal-100 p-3 rounded-full text-teal-600 hidden md:block">
                 <Phone size={32} />
              </div>
              <div>
                 <h3 className="text-xl font-bold text-teal-900 mb-2">{t.signupTitle}</h3>
                 <p className="text-teal-800/80 max-w-xl">
                    {t.signupText}
                 </p>
              </div>
           </div>
           
           <a 
             href="tel:+77273395903" 
             className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition flex items-center whitespace-nowrap"
           >
             <Phone size={18} className="mr-2" />
             {t.callBtn}
           </a>
        </div>

      </div>
    </div>
  );
}