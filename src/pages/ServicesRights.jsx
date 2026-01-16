import React from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { ShieldCheck, Info, HeartHandshake, Scale, MessageSquare, AlertCircle, FileText } from 'lucide-react';

export default function ServicesRights() {
  const { lang } = useOutletContext();

  const t = {
    breadcrumb: lang === 'ru' ? "ГЛАВНАЯ / ПРАВА УСЛУГОПОЛУЧАТЕЛЕЙ" : "БАСТЫ БЕТ / ҚЫЗМЕТ АЛУШЫЛАРДЫҢ ҚҰҚЫҚТАРЫ",
    title: lang === 'ru' ? "Права услугополучателей" : "Қызмет алушылардың құқықтары",
    subtitle: lang === 'ru' ? "Согласно Закону РК «О государственных услугах»" : "«Мемлекеттік көрсетілетін қызметтер туралы» ҚР Заңына сәйкес",
    
    // Вступление
    introTitle: lang === 'ru' ? "Ваши гарантии" : "Сіздің кепілдіктеріңіз",
    introText: lang === 'ru' 
      ? "Поликлиника №33 стремится к обеспечению прозрачности и высокого качества обслуживания. Каждый пациент, обращаясь за государственной услугой, обладает рядом неотъемлемых прав, гарантированных государством."
      : "№33 емхана қызмет көрсетудің ашықтығы мен жоғары сапасын қамтамасыз етуге ұмтылады. Мемлекеттік қызметке жүгінген әрбір пациент мемлекет кепілдік берген ажырамас құқықтарға ие.",

    // Список прав (карточки)
    rights: [
      {
        icon: Info,
        title: { ru: "Достоверная информация", kz: "Дұрыс ақпарат" },
        desc: { 
          ru: "Вы имеете право получать полную и достоверную информацию о порядке предоставления услуги, сроках и необходимых документах.", 
          kz: "Сіз қызмет көрсету тәртібі, мерзімдері және қажетті құжаттар туралы толық және дұрыс ақпарат алуға құқылысыз." 
        }
      },
      {
        icon: ShieldCheck,
        title: { ru: "Качество и Стандарт", kz: "Сапа және Стандарт" },
        desc: { 
          ru: "Услуга должна быть оказана в строгом соответствии с утвержденным Стандартом (соблюдение времени, перечня процедур).", 
          kz: "Қызмет бекітілген Стандартқа қатаң сәйкес (уақытты, рәсімдер тізбесін сақтау) көрсетілуі тиіс." 
        }
      },
      {
        icon: Scale,
        title: { ru: "Обжалование", kz: "Шағымдану" },
        desc: { 
          ru: "Вы имеете право обжаловать решения, действия или бездействие услугодателя в вышестоящие органы или в суд.", 
          kz: "Сіз қызмет көрсетушінің шешімдеріне, әрекеттеріне немесе әрекетсіздігіне жоғары тұрған органдарға немесе сотқа шағымдануға құқылысыз." 
        }
      },
      {
        icon: HeartHandshake,
        title: { ru: "Уважительное отношение", kz: "Құрметпен қарау" },
        desc: { 
          ru: "Вам гарантировано корректное, вежливое обращение со стороны персонала, не унижающее человеческое достоинство.", 
          kz: "Сізге қызметкерлер тарапынан адами қадір-қасиетті қорламайтын, сыпайы қарым-қатынасқа кепілдік беріледі." 
        }
      },
      {
        icon: FileText,
        title: { ru: "Сохранность документов", kz: "Құжаттардың сақталуы" },
        desc: { 
          ru: "Услугодатель обязан обеспечить сохранность любых документов, которые вы передаете для получения услуги.", 
          kz: "Қызмет көрсетуші қызмет алу үшін сіз тапсырған кез келген құжаттардың сақталуын қамтамасыз етуге міндетті." 
        }
      },
      {
        icon: MessageSquare,
        title: { ru: "Внесение предложений", kz: "Ұсыныстар енгізу" },
        desc: { 
          ru: "Вы вправе вносить предложения по улучшению качества государственных услуг и участвовать в публичных обсуждениях.", 
          kz: "Сіз мемлекеттік қызметтердің сапасын жақсарту бойынша ұсыныстар енгізуге және қоғамдық талқылауларға қатысуға құқылысыз." 
        }
      }
    ],

    // Блок "Что делать"
    helpTitle: lang === 'ru' ? "Ваши права нарушены?" : "Сіздің құқықтарыңыз бұзылды ма?",
    helpText: lang === 'ru' 
      ? "Если вы столкнулись с грубостью, нарушением сроков или необоснованным отказом, не молчите. Мы готовы разобраться в ситуации."
      : "Егер сіз дөрекілікке, мерзімдердің бұзылуына немесе негізсіз бас тартуға тап болсаңыз, үндемеңіз. Біз жағдайды түсінуге дайынбыз.",
    helpBtn: lang === 'ru' ? "Подать жалобу / Обращение" : "Шағым беру / Өтініш"
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
          <p className="text-lg opacity-90">{t.subtitle}</p>
        </div>
      </div>

      {/* 2. CONTENT */}
      <div className="container mx-auto px-4 py-12">
        
        {/* Вступление */}
        <div className="max-w-4xl mx-auto text-center mb-12">
           <h2 className="text-2xl font-bold text-gray-800 mb-4">{t.introTitle}</h2>
           <p className="text-gray-600 text-lg leading-relaxed">
             {t.introText}
           </p>
        </div>

        {/* Сетка карточек (Разнообразие!) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
           {t.rights.map((item, index) => (
             <div key={index} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-shadow border border-gray-100 flex flex-col items-start group">
                <div className="w-14 h-14 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                   <item.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-teal-700 transition-colors">
                   {item.title[lang]}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                   {item.desc[lang]}
                </p>
             </div>
           ))}
        </div>

        {/* Блок "Что делать если нарушены" (Call to Action) */}
        <div className="bg-red-50 border border-red-100 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="flex items-start gap-4">
              <AlertCircle size={48} className="text-red-500 flex-shrink-0" />
              <div>
                 <h3 className="text-2xl font-bold text-gray-900 mb-2">{t.helpTitle}</h3>
                 <p className="text-gray-700 max-w-xl">
                    {t.helpText}
                 </p>
              </div>
           </div>
           
           <Link 
             to="/blog/feedback" 
             className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 text-center whitespace-nowrap"
           >
             {t.helpBtn}
           </Link>
        </div>

        {/* Ссылка на закон (мелким шрифтом) */}
        <div className="mt-8 text-center">
           <a 
             href="https://adilet.zan.kz/rus/docs/Z1300000088" 
             target="_blank" 
             rel="noreferrer"
             className="text-gray-400 hover:text-teal-600 text-sm underline transition"
           >
             {lang === 'ru' ? "Закон РК «О государственных услугах» (Статья 4)" : "«Мемлекеттік көрсетілетін қызметтер туралы» ҚР Заңы (4-бап)"}
           </a>
        </div>

      </div>
    </div>
  );
}