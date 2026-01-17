import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Calendar, Clock, MapPin, Phone, User } from 'lucide-react';

export default function ServicesReception() {
  const { lang } = useOutletContext();

  const t = {
    breadcrumb: lang === 'ru' ? "ГЛАВНАЯ / ПРИЕМ ГРАЖДАН" : "БАСТЫ БЕТ / АЗАМАТТАРДЫ ҚАБЫЛДАУ",
    title: lang === 'ru' ? "График приема граждан администрацией" : "Әкімшіліктің азаматтарды қабылдау кестесі",
    subtitle: lang === 'ru' ? "Предварительная запись на прием осуществляется через приемную или колл-центр" : "Қабылдауға алдын ала жазылу қабылдау бөлмесі немесе колл-орталығы арқылы жүзеге асырылады",
    
    tableHeaders: {
      name: lang === 'ru' ? "ФИО / Должность" : "Аты-жөні / Лауазымы",
      day: lang === 'ru' ? "Дни приема" : "Қабылдау күндері",
      time: lang === 'ru' ? "Время" : "Уақыты",
      room: lang === 'ru' ? "Кабинет" : "Кабинет"
    },

    schedule: [
      {
        name: { ru: "Абдрасилов Гани Болатович", kz: "Абдрасилов Ғани Болатұлы" },
        role: { ru: "Директор", kz: "Директор" },
        days: { ru: "********", kz: "********" },
        time: "**:** - **:**",
        room: "401/1"
      },
      {
        name: { ru: "ОРЫНОВ АЛМАЗ МЕДЕУХАНОВИЧ", kz: "ОРЫНОВ АЛМАЗ МЕДЕУХАНОВИЧ" },
        role: { ru: "Зам. директора по лечебной части", kz: "Директордың емдеу ісі жөніндегі орынбасары" },
        days: { ru: "********", kz: "********" },
        time: "**:** - **:**",
        room: "401/2"
      },
      {
        name: { ru: "АХМЕТБЕКОВА НУРКАН КАБИЖАНОВНА", kz: "АХМЕТБЕКОВА НУРКАН КАБИЖАНОВНА" },
        role: { ru: "Главный бухгалтер", kz: "Бас есепші" },
        days: { ru: "********", kz: "********" },
        time: "**:** - **:**",
        room: "404"
      },
      {
        name: { ru: "САДАКБАЕВА ГУЛИМ КУАНЫШЕВНА", kz: "САДАКБАЕВА ГУЛИМ КУАНЫШЕВНА" },
        role: { ru: "Главная медсестра", kz: "Бас мейірбике" },
        days: { ru: "********", kz: "********" },
        time: "**:** - **:**",
        room: "311"
      }
    ],

    infoTitle: lang === 'ru' ? "Порядок записи на прием" : "Қабылдауға жазылу тәртібі",
    infoText: lang === 'ru' 
      ? "Личный прием граждан проводится по предварительной записи. Вы можете записаться, позвонив в приемную директора или обратившись в Службу поддержки пациентов."
      : "Азаматтарды жеке қабылдау алдын ала жазылу бойынша жүргізіледі. Сіз директордың қабылдау бөлмесіне қоңырау шалу немесе Пациенттерді қолдау қызметіне жүгіну арқылы жазыла аласыз.",
    phoneLabel: lang === 'ru' ? "Телефон для записи:" : "Жазылу телефоны:"
  };

  return (
    <div className="flex flex-col min-h-[60vh] bg-gray-50">
      
      {/* 1. HEADER */}
      <div className="bg-teal-700 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-xs font-bold text-yellow-400 uppercase tracking-widest mb-2">
            {t.breadcrumb}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold uppercase mb-4">
            {t.title}
          </h1>
          <p className="text-lg opacity-90">{t.subtitle}</p>
        </div>
      </div>

      {/* 2. CONTENT */}
      <div className="container mx-auto px-4 py-12">
        
        {/* Карточка с таблицей */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 mb-12">
           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-teal-50 text-teal-800 text-sm uppercase tracking-wider">
                       <th className="p-6 border-b border-teal-100">{t.tableHeaders.name}</th>
                       <th className="p-6 border-b border-teal-100">{t.tableHeaders.day}</th>
                       <th className="p-6 border-b border-teal-100">{t.tableHeaders.time}</th>
                       <th className="p-6 border-b border-teal-100 text-center">{t.tableHeaders.room}</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                    {t.schedule.map((person, index) => (
                       <tr key={index} className="hover:bg-gray-50 transition">
                          <td className="p-6">
                             <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center mr-4 flex-shrink-0">
                                   <User size={20} />
                                </div>
                                <div>
                                   <div className="font-bold text-gray-900">{person.name[lang]}</div>
                                   <div className="text-xs text-gray-500 uppercase mt-1">{person.role[lang]}</div>
                                </div>
                             </div>
                          </td>
                          <td className="p-6">
                             <div className="flex items-center text-gray-700">
                                <Calendar size={18} className="mr-2 text-teal-500" />
                                {person.days[lang]}
                             </div>
                          </td>
                          <td className="p-6">
                             <div className="flex items-center text-gray-700 font-medium">
                                <Clock size={18} className="mr-2 text-teal-500" />
                                {person.time}
                             </div>
                          </td>
                          <td className="p-6 text-center">
                             <div className="inline-flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm font-bold text-gray-600">
                                <MapPin size={14} className="mr-1" />
                                {person.room}
                             </div>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>

        {/* Инфоблок внизу */}
        <div className="bg-blue-50 rounded-xl p-8 border-l-4 border-blue-500 flex flex-col md:flex-row items-center justify-between gap-6">
           <div className="max-w-2xl">
              <h3 className="text-xl font-bold text-blue-900 mb-2">{t.infoTitle}</h3>
              <p className="text-blue-800/80">
                 {t.infoText}
              </p>
           </div>
           
           <div className="flex items-center gap-4 bg-white px-6 py-4 rounded-lg shadow-sm">
              <Phone className="text-green-500" size={32} />
              <div>
                 <div className="text-xs text-gray-400 uppercase font-bold">{t.phoneLabel}</div>
                 <div className="text-xl font-bold text-gray-900">+7 (727) 339-59-03</div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}