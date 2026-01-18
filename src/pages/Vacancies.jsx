import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Briefcase, DollarSign, Clock, Loader, ChevronDown, ChevronUp } from 'lucide-react';

const API_URL = 'https://almgp33.kz';

export default function Vacancies() {
  const { lang } = useOutletContext();
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Состояние для хранения ID раскрытой вакансии (null - все закрыты)
  const [expandedId, setExpandedId] = useState(null);

  const t = {
    title: lang === 'ru' ? "Вакансии" : "Бос жұмыс орындары",
    subtitle: lang === 'ru' 
      ? "Присоединяйтесь к нашей команде профессионалов" 
      : "Біздің кәсіби командамызға қосылыңыз",
    empty: lang === 'ru' ? "На данный момент открытых вакансий нет." : "Қазіргі уақытта бос жұмыс орындары жоқ.",
    salary: lang === 'ru' ? "Зарплата:" : "Жалақы:",
    posted: lang === 'ru' ? "Опубликовано:" : "Жарияланды:",
    contact: lang === 'ru' ? "Отдел кадров:" : "Кадрлар бөлімі:",
    phone: "+7 (727) 339-59-03",
    email: "priemnaya_gp33@mail.ru",
    details: lang === 'ru' ? "Подробнее" : "Толығырақ"
  };

  useEffect(() => {
    fetch(`${API_URL}/api/vacancies`)
      .then(res => res.json())
      .then(data => {
        setVacancies(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Ошибка загрузки вакансий:", err);
        setLoading(false);
      });
  }, []);

  // Функция переключения (открыть/закрыть)
  const toggleVacancy = (id) => {
    if (expandedId === id) {
      setExpandedId(null); // Если кликнули на уже открытую - закрываем
    } else {
      setExpandedId(id);   // Открываем новую
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Заголовок */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-teal-800 mb-4">{t.title}</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">{t.subtitle}</p>
      </div>

      {/* Контактная плашка */}
      <div className="bg-teal-50 border border-teal-100 rounded-xl p-6 mb-10 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
         <div>
            <h4 className="font-bold text-teal-800 text-lg mb-1">{t.contact}</h4>
            <p className="text-gray-600">Присылайте резюме на почту или звоните</p>
         </div>
         <div className="mt-4 md:mt-0 font-bold text-teal-700 text-lg">
            <a href={`tel:${t.phone}`} className="mr-4 hover:underline">{t.phone}</a>
            <a href={`mailto:${t.email}`} className="hover:underline">{t.email}</a>
         </div>
      </div>

      {/* Список */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader className="animate-spin text-teal-600" size={40}/></div>
      ) : vacancies.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl">
           <Briefcase className="mx-auto h-16 w-16 text-gray-300 mb-4"/>
           <p className="text-gray-500 text-lg">{t.empty}</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {vacancies.map((vac) => {
            const isOpen = expandedId === vac.id;

            return (
              <div 
                key={vac.id} 
                onClick={() => toggleVacancy(vac.id)}
                className={`bg-white rounded-xl border transition-all duration-300 cursor-pointer overflow-hidden
                  ${isOpen ? 'shadow-lg border-teal-200 ring-1 ring-teal-100' : 'shadow-sm border-gray-100 hover:shadow-md'}
                `}
              >
                {/* ЗАГОЛОВОК КАРТОЧКИ (Виден всегда) */}
                <div className="p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                   <div className="flex items-center w-full md:w-auto">
                      <div className={`p-3 rounded-full mr-4 transition-colors ${isOpen ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-500'}`}>
                         <Briefcase size={24} />
                      </div>
                      <h3 className="text-lg md:text-xl font-bold text-gray-800">
                         {vac.title}
                      </h3>
                   </div>

                   <div className="flex items-center justify-between w-full md:w-auto gap-6">
                      <div className="flex items-center text-green-700 font-bold bg-green-50 px-3 py-1 rounded-full whitespace-nowrap">
                         <DollarSign size={16} className="mr-1"/>
                         {vac.salary}
                      </div>
                      
                      {/* Иконка стрелочки */}
                      <div className="text-gray-400">
                        {isOpen ? <ChevronUp size={20}/> : <ChevronDown size={20}/>}
                      </div>
                   </div>
                </div>
                
                {/* СКРЫТЫЙ КОНТЕНТ (Появляется при клике) */}
                {isOpen && (
                  <div className="px-6 pb-6 pt-0 animate-fade-in-down">
                     <div className="border-t border-gray-100 pt-4 mt-2">
                        <div className="prose prose-teal max-w-none text-gray-600 mb-6 whitespace-pre-line leading-relaxed">
                           {vac.text}
                        </div>

                        <div className="flex items-center text-gray-400 text-sm">
                           <Clock size={16} className="mr-2"/>
                           {t.posted} {vac.date}
                        </div>
                     </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}