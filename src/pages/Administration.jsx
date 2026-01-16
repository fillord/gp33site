import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Mail, Phone, Clock, Search, Shield, User } from 'lucide-react';

export default function Administration() {
  const { lang } = useOutletContext();
  const [searchTerm, setSearchTerm] = useState('');

  const t = {
    breadcrumb: lang === 'ru' ? "ГЛАВНАЯ / АДМИНИСТРАЦИЯ" : "БАСТЫ БЕТ / ӘКІМШІЛІК",
    title: lang === 'ru' ? "Руководство поликлиники" : "Емхана басшылығы",
    subtitle: lang === 'ru' ? "Административно-управленческий персонал ГП №33" : "№33 ҚЕ әкімшілік-басқару қызметкерлері",
    reception: lang === 'ru' ? "Прием граждан:" : "Азаматтарды қабылдау:",
    phone: lang === 'ru' ? "Телефон:" : "Телефон:",
    email: lang === 'ru' ? "Почта:" : "Пошта:",
    search: lang === 'ru' ? "Поиск сотрудника..." : "Қызметкерді іздеу...",
    soviet: lang === 'ru' ? "Наблюдательный совет" : "Бақылау кеңесі"
  };

  // === СПИСОК СОТРУДНИКОВ ===
  const administration = [
    // --- ТОП МЕНЕДЖМЕНТ ---
    {
      id: "director",
      category: "top",
      role: { ru: "Директор", kz: "Директор" },
      name: { ru: "Абдрасилов Гани Болатович", kz: "Абдрасилов Ғани Болатұлы" },
      desc: { ru: "Организатор здравоохранения высшей категории.", kz: "Жоғары санатты денсаулық сақтау ұйымдастырушысы." },
      reception: { ru: "Среда, 14:00 - 16:00 (Каб. 301)", kz: "Сәрсенбі, 14:00 - 16:00 (301 каб.)" },
      phone: "+7 (727) 339-59-03",
      email: "director@gp33.kz",
      img: "/director.jpg"
    },
    {
      id: "deputy_med",
      category: "top",
      role: { ru: "Заместитель директора по лечебной части", kz: "Директордың емдеу ісі жөніндегі орынбасары" },
      name: { ru: "ОРЫНОВ АЛМАЗ МЕДЕУХАНОВИЧ", kz: "ОРЫНОВ АЛМАЗ МЕДЕУХАНОВИЧ" },
      reception: { ru: "Вторник, Четверг 10:00 - 12:00", kz: "Сейсенбі, Бейсенбі 10:00 - 12:00" },
      phone: "+7 (727) 339-59-05",
      email: "zam_med@gp33.kz",
      img: "/zam_lech.jpg"
    },
    {
      id: "accountant",
      category: "top",
      role: { ru: "Главный бухгалтер", kz: "Бас есепші" },
      name: { ru: "АХМЕТБЕКОВА НУРКАН КАБИЖАНОВНА", kz: "АХМЕТБЕКОВА НУРКАН КАБИЖАНОВНА" },
      reception: { ru: "Понедельник 15:00 - 17:00", kz: "Дүйсенбі 15:00 - 17:00" },
      phone: "+7 (727) 339-59-06",
      email: "buh@gp33.kz",
      img: "/glbuh.jpg"
    },

    // --- ЗАВЕДУЮЩИЕ ОТДЕЛЕНИЯМИ ---
    {
      id: "zav_csz1",
      category: "head",
      role: { ru: "Начальник отдела кадров", kz: "Кадрлар бөлімінің бастығы" },
      name: { ru: "ЖАНГУТДИНОВА НАЗИГУЛЬ САРКЫТБЕКОВНА", kz: "ЖАНГУТДИНОВА НАЗИГУЛЬ САРКЫТБЕКОВНА" },
      phone: "Вн. 101",
      email: "csz1@gp33.kz",
      img: "https://via.placeholder.com/150"
    },
    {
      id: "zav_csz2",
      category: "head",
      role: { ru: "Заведующая отделением ЦСЗ-1", kz: "ЦСЗ-1 бөлімшесінің меңгерушісі" },
      name: { ru: "ТӨЛЕБИ АЙНҰР АБДЫҚАДЫРҚЫЗЫ", kz: "ТӨЛЕБИ АЙНҰР АБДЫҚАДЫРҚЫЗЫ" },
      phone: "Вн. 102",
      email: "csz2@gp33.kz",
      img: "https://via.placeholder.com/150"
    },
    {
      id: "zav_spec",
      category: "head",
      role: { ru: "Зав. отд. специализированной помощи", kz: "Мамандандырылған көмек бөлімшесінің меңгерушісі" },
      name: { ru: "ДУЙСЕНОВА ГУЛДАНА МАЛКАЙДАРОВНА", kz: "ДУЙСЕНОВА ГУЛДАНА МАЛКАЙДАРОВНА" },
      phone: "Вн. 104",
      email: "spec@gp33.kz",
      img: "https://via.placeholder.com/150"
    },
    {
      id: "zav_women",
      category: "head",
      role: { ru: "Зав. отделением Женской консультации", kz: "Әйелдер кеңесі бөлімшесінің меңгерушісі" },
      name: { ru: "КОИГЕЛДИЕВА АЛИЯ ТУМЕНБАЕВНА", kz: "КОИГЕЛДИЕВА АЛИЯ ТУМЕНБАЕВНА" },
      phone: "Вн. 105",
      email: "women@gp33.kz",
      img: "https://via.placeholder.com/150"
    },

    // --- АХЧ И ПРОЧИЕ ---
    {
      id: "head_nurse",
      category: "support",
      role: { ru: "Главная медсестра", kz: "Бас мейірбике" },
      name: { ru: "САДАКБАЕВА ГУЛИМ КУАНЫШЕВНА", kz: "САДАКБАЕВА ГУЛИМ КУАНЫШЕВНА" },
      phone: "Вн. 201",
      email: "medsestra@gp33.kz",
      img: "https://via.placeholder.com/150"
    },
    {
      id: "goszakup",
      category: "support",
      role: { ru: "Специалист по госзакупкам", kz: "Мемлекеттік сатып алу маманы" },
      name: { ru: "САТАЕВА ЗАРИНА АБДИНАСИЛОВНА", kz: "САТАЕВА ЗАРИНА АБДИНАСИЛОВНА" },
      phone: "Вн. 202",
      email: "goszakup@gp33.kz",
      img: "https://via.placeholder.com/150"
    },
    {
      id: "expert",
      category: "support",
      role: { ru: "Эксперт", kz: "Сарапшы" },
      name: { ru: "ҚАЛДЫБАЙ ДӘУЛЕТ НҰРҒАЛИҰЛЫ", kz: "ҚАЛДЫБАЙ ДӘУЛЕТ НҰРҒАЛИҰЛЫ" },
      phone: "Вн. 203",
      email: "expert@gp33.kz",
      img: "https://via.placeholder.com/150"
    },
    {
      id: "ahch",
      category: "support",
      role: { ru: "Руководитель АХЧ", kz: "ШЖБ басшысы" },
      name: { ru: "КУЛУНШАКОВ МУКСЫМХАН ЖАРАСОВИЧ", kz: "КУЛУНШАКОВ МУКСЫМХАН ЖАРАСОВИЧ" },
      phone: "Вн. 204",
      email: "ahch@gp33.kz",
      img: "https://via.placeholder.com/150"
    },
    {
      id: "sklad",
      category: "support",
      role: { ru: "Заведующий складом", kz: "Қойма меңгерушісі" },
      name: { ru: "АЖИБАЕВ АЗАТ ТУРСУНОВИЧ", kz: "АЖИБАЕВ АЗАТ ТУРСУНОВИЧ" },
      phone: "Вн. 205",
      email: "sklad@gp33.kz",
      img: "https://via.placeholder.com/150"
    }
  ];

  const compliance = {
    role: { ru: "Комплаенс-офицер", kz: "Комплаенс-офицер" },
    name: { ru: "Иванов И.И.", kz: "Иванов И.И." }, 
    email: "priemnaya_gp33@mail.ru"
  };

  // Фильтрация
  const filteredList = administration.filter(p => 
    p.name[lang].toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.role[lang].toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-[60vh] bg-gray-50">
      {/* HEADER */}
      <div className="bg-teal-700 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-xs font-bold text-yellow-400 uppercase tracking-widest mb-2">
            {t.breadcrumb}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold uppercase mb-4">
            {t.title}
          </h1>
          <p className="text-lg opacity-90 max-w-2xl">{t.subtitle}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        
        {/* БЛОК ПОИСКА И НАБЛЮДАТЕЛЬНОГО СОВЕТА */}
        <div className="flex flex-col md:flex-row gap-8 mb-12">
           <div className="md:w-1/3">
              <div className="relative">
                 <input 
                   type="text" 
                   placeholder={t.search} 
                   className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-teal-500 outline-none"
                   value={searchTerm}
                   onChange={e => setSearchTerm(e.target.value)}
                 />
                 <Search className="absolute left-3 top-3.5 text-gray-400" size={20}/>
              </div>
           </div>

           <div className="md:w-2/3 bg-white border-l-4 border-indigo-500 p-4 shadow-sm rounded-r-lg flex items-center justify-between">
               <div>
                  <h3 className="font-bold text-gray-800 flex items-center">
                     <Shield className="mr-2 text-indigo-600" size={18}/> {t.soviet}
                  </h3>
               </div>
               <div className="text-right text-sm">
                  <div className="text-xs text-gray-400 uppercase font-bold">{compliance.role[lang]}</div>
                  <div className="font-medium">{compliance.name[lang]}</div>
                  <a href={`mailto:${compliance.email}`} className="text-indigo-600">{compliance.email}</a>
               </div>
           </div>
        </div>

        {/* 1. ДИРЕКТОР (Всегда сверху, если не скрыт поиском) */}
        {filteredList.find(p => p.id === 'director') && (
           <div className="mb-12">
             {filteredList.filter(p => p.id === 'director').map(person => (
               <div key={person.id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 flex flex-col md:flex-row">
                  <div className="md:w-1/3 bg-gray-200 relative min-h-[300px]">
                     <img src={person.img} alt={person.name[lang]} className="w-full h-full object-cover" />
                  </div>
                  <div className="md:w-2/3 p-8 flex flex-col justify-center">
                     <span className="inline-block bg-teal-600 text-white text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider mb-3 w-fit">
                       {person.role[lang]}
                     </span>
                     <h2 className="text-3xl font-bold text-gray-900 mb-4">{person.name[lang]}</h2>
                     <p className="text-gray-600 text-lg mb-6 border-l-4 border-teal-500 pl-4 italic">
                       {person.desc[lang]}
                     </p>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-auto">
                        <div className="flex items-start">
                           <Clock className="text-teal-600 mt-1 mr-3" size={20}/>
                           <div>
                              <span className="block text-xs text-gray-400 uppercase font-bold">{t.reception}</span>
                              <span className="font-medium">{person.reception[lang]}</span>
                           </div>
                        </div>
                        <div className="flex items-start">
                           <Phone className="text-teal-600 mt-1 mr-3" size={20}/>
                           <div>
                              <span className="block text-xs text-gray-400 uppercase font-bold">{t.phone}</span>
                              <span className="font-medium">{person.phone}</span>
                           </div>
                        </div>
                        <div className="flex items-start">
                           <Mail className="text-teal-600 mt-1 mr-3" size={20}/>
                           <div>
                              <span className="block text-xs text-gray-400 uppercase font-bold">{t.email}</span>
                              <a href={`mailto:${person.email}`} className="text-teal-700 hover:underline">{person.email}</a>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
             ))}
           </div>
        )}

        {/* 2. СЕТКА ОСТАЛЬНЫХ СОТРУДНИКОВ */}
        {filteredList.filter(p => p.id !== 'director').length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredList.filter(p => p.id !== 'director').map(person => (
                <div key={person.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition border border-gray-100 p-6 flex flex-col group">
                    <div className="flex items-center mb-4">
                        <div className="w-40 h-40 rounded-full overflow-hidden border-2 border-teal-100 mr-4 flex-shrink-0 group-hover:border-teal-500 transition">
                            <img src={person.img} alt={person.name[lang]} className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <div className={`text-[10px] font-bold uppercase leading-tight mb-1 ${
                                person.category === 'head' ? 'text-blue-600' : 
                                person.category === 'support' ? 'text-green-600' : 'text-teal-600'
                            }`}>
                                {person.role[lang]}
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 leading-tight">{person.name[lang]}</h3>
                        </div>
                    </div>
                    
                    <div className="mt-auto space-y-2 text-sm text-gray-600 pt-4 border-t border-gray-50">
                        {person.reception && (
                            <div className="flex items-center">
                                <Clock size={14} className="text-gray-400 mr-2"/> {person.reception[lang]}
                            </div>
                        )}
                        <div className="flex items-center">
                            <Phone size={14} className="text-gray-400 mr-2"/> {person.phone}
                        </div>
                        <div className="flex items-center">
                            <Mail size={14} className="text-gray-400 mr-2"/> 
                            <a href={`mailto:${person.email}`} className="hover:text-teal-600 truncate">{person.email}</a>
                        </div>
                    </div>
                </div>
            ))}
            </div>
        )}

        {filteredList.length === 0 && (
            <div className="text-center py-12 text-gray-500">
                Сотрудники не найдены
            </div>
        )}

      </div>
    </div>
  );
}