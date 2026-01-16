import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Briefcase, Mail, Phone, FileText } from 'lucide-react';

export default function Vacancies() {
  const { lang } = useOutletContext();

  const t = {
    breadcrumb: lang === 'ru' ? "ГЛАВНАЯ / О ПОЛИКЛИНИКЕ / ВАКАНСИИ" : "БАСТЫ БЕТ / ЕМХАНА ТУРАЛЫ / БОС ЖҰМЫС ОРЫНДАРЫ",
    title: lang === 'ru' ? "Вакансии" : "Бос жұмыс орындары",
    
    // Сообщение об отсутствии
    emptyTitle: lang === 'ru' ? "На данный момент открытых вакансий нет" : "Қазіргі уақытта бос жұмыс орындары жоқ",
    emptyDesc: lang === 'ru' 
      ? "Однако мы всегда рады квалифицированным специалистам. Вы можете отправить свое резюме в наш отдел кадров, и мы свяжемся с вами, как только появится подходящая позиция." 
      : "Дегенмен, біз білікті мамандарға әрқашан қуаныштымыз. Сіз түйіндемеңізді біздің кадрлар бөліміне жібере аласыз, сәйкес бос орын пайда болған жағдайда біз сізбен байланысамыз.",
    
    // Контакты
    contactTitle: lang === 'ru' ? "Куда отправлять резюме?" : "Түйіндемені қайда жіберу керек?",
    hrEmail: "prienmaya_gp33@mail.ru",
    hrPhone: "+7 (77) ***-**-**"
  };

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
        </div>
      </div>

      {/* 2. CONTENT */}
      <div className="container mx-auto px-4 py-16">
        
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden text-center p-10 md:p-16">
           
           {/* Иконка чемодана */}
           <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400 animate-pulse">
              <Briefcase size={48} strokeWidth={1.5} />
           </div>

           <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              {t.emptyTitle}
           </h2>
           
           <p className="text-gray-600 text-lg leading-relaxed mb-10">
              {t.emptyDesc}
           </p>

           {/* Карточка контактов HR */}
           <div className="bg-teal-50 rounded-xl p-8 border border-teal-100 flex flex-col items-center">
              <h3 className="text-teal-900 font-bold mb-6 flex items-center uppercase tracking-wide text-sm">
                 <FileText size={16} className="mr-2"/> {t.contactTitle}
              </h3>
              
              <div className="flex flex-col md:flex-row gap-6 md:gap-12">
                 <a href={`mailto:${t.hrEmail}`} className="flex items-center group">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-teal-600 shadow-sm mr-4 group-hover:scale-110 transition">
                       <Mail size={20} />
                    </div>
                    <div className="text-left">
                       <div className="text-xs text-gray-500 font-bold uppercase">E-mail</div>
                       <div className="text-lg font-bold text-gray-800 group-hover:text-teal-600 transition">{t.hrEmail}</div>
                    </div>
                 </a>

                 <div className="flex items-center">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-teal-600 shadow-sm mr-4">
                       <Phone size={20} />
                    </div>
                    <div className="text-left">
                       <div className="text-xs text-gray-500 font-bold uppercase">{lang === 'ru' ? "Отдел кадров" : "Кадрлар бөлімі"}</div>
                       <div className="text-lg font-bold text-gray-800">{t.hrPhone}</div>
                    </div>
                 </div>
              </div>
           </div>

        </div>

      </div>
    </div>
  );
}