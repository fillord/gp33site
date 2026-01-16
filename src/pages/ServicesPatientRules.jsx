import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { ShieldCheck, AlertCircle, BookOpen, Check, UserCheck, Heart } from 'lucide-react';

export default function ServicesPatientRules() {
  const { lang } = useOutletContext();
  const [activeTab, setActiveTab] = useState('rights'); // 'rights' or 'duties'

  const t = {
    breadcrumb: lang === 'ru' ? "ГЛАВНАЯ / ПРАВА И ОБЯЗАННОСТИ" : "БАСТЫ БЕТ / ҚҰҚЫҚТАР МЕН МІНДЕТТЕР",
    title: lang === 'ru' ? "Права и обязанности пациентов" : "Пациенттердің құқықтары мен міндеттері",
    subtitle: lang === 'ru' 
      ? "Согласно Кодексу Республики Казахстан «О здоровье народа и системе здравоохранения»" 
      : "«Халық денсаулығы және денсаулық сақтау жүйесі туралы» Қазақстан Республикасының Кодексіне сәйкес",
    
    tabRights: lang === 'ru' ? "Права пациента" : "Пациент құқықтары",
    tabDuties: lang === 'ru' ? "Обязанности пациента" : "Пациент міндеттері",
    
    rightsHeader: lang === 'ru' ? "Пациент имеет право на:" : "Пациенттің құқығы бар:",
    dutiesHeader: lang === 'ru' ? "Пациент обязан:" : "Пациент міндетті:",
  };

  // Данные из Кодекса РК (источник: gp5.kz и adilet.zan.kz)
  const content = {
    rights: [
      { ru: "Достойное обращение в процессе диагностики, лечения и ухода, уважительное отношение к своим культурным и личностным ценностям.", kz: "Диагностика, емдеу және күтім жасау процесінде өзіне лайықты түрде қарауға, өзінің мәдени және жеке басының құндылықтарына құрметпен қарауға." },
      { ru: "Медицинскую помощь в очередности, определяемой исключительно на основе медицинских критериев, без влияния дискриминационных факторов.", kz: "Қандай да бір кемсітушілік факторлардың ықпалынсыз, тек қана медициналық өлшемшарттар негізінде айқындалатын кезекте медициналық көмек алуға." },
      { ru: "Выбор, замену врача или медицинской организации.", kz: "Дәрігерді немесе медициналық ұйымды таңдауға және ауыстыруға." },
      { ru: "Поддержку со стороны семьи, родственников и друзей, а также служителей религиозных объединений.", kz: "Отбасының, туыстары мен достарының, сондай-ақ діни бірлестіктер қызметшілерінің тарапынан қолдау көрсетілуіне." },
      { ru: "Облегчение страданий в той мере, в какой это позволяет существующий уровень медицинских технологий.", kz: "Қазіргі медициналық технологиялар деңгейі мүмкіндік беретін шамада қасіретінің жеңілдетілуіне." },
      { ru: "Получение независимого мнения о состоянии своего здоровья и проведение консилиума.", kz: "Денсаулық жағдай туралы тәуелсіз пікір алуға және консилиум өткізілуіне." },
      { ru: "Получение информации о своих правах и обязанностях, оказываемых услугах и их стоимости.", kz: "Өз құқықтары мен міндеттері, көрсетілетін қызметтер мен олардың құны туралы ақпарат алуға." },
      { ru: "Информированное добровольное согласие на медицинское вмешательство.", kz: "Медициналық араласуға хабардар етілген ерікті келісім беруге." },
      { ru: "Отказ от получения медицинской помощи (кроме случаев, предусмотренных законом).", kz: "Медициналық көмек алудан бас тартуға." },
      { ru: "Исчерпывающую информацию о состоянии своего здоровья, диагнозе и прогнозе.", kz: "Өз денсаулығының жай-күйі, диагнозы және болжамы туралы толық ақпарат алуға." },
      { ru: "Конфиденциальность информации о факте обращения за медицинской помощью (врачебная тайна).", kz: "Медициналық көмекке жүгіну фактісі туралы ақпараттың құпиялылығына (дәрігерлік құпия)." },
      { ru: "Возмещение вреда, причиненного здоровью при оказании медицинской помощи.", kz: "Медициналық көмек көрсету кезінде денсаулығына келтірілген зиянның өтелуіне." }
    ],
    duties: [
      { ru: "Заботиться о сохранении своего здоровья.", kz: "Өз денсаулығын сақтауға қамқорлық жасауға." },
      { ru: "Принимать меры к сохранению и укреплению своего здоровья.", kz: "Өз денсаулығын сақтау және нығайту шараларын қабылдауға." },
      { ru: "Проявлять в общении с медицинскими работниками уважение и такт.", kz: "Медицина қызметкерлерімен қарым-қатынаста сыйластық пен әдептілік танытуға." },
      { ru: "Сообщать врачу всю информацию, необходимую для постановки диагноза и лечения.", kz: "Диагноз қою және емдеу үшін қажетті бүкіл ақпаратты дәрігерге хабарлауға." },
      { ru: "Неукоснительно выполнять все предписания лечащего врача.", kz: "Емдеуші дәрігердің барлық нұсқамаларын мүлтіксіз орындауға." },
      { ru: "Своевременно информировать об изменении состояния своего здоровья.", kz: "Денсаулық жағдайының өзгерісі туралы медицина қызметкерлерін уақтылы хабардар етуге." },
      { ru: "Соблюдать правила внутреннего распорядка медицинской организации.", kz: "Медициналық ұйымның ішкі тәртіп қағидаларын сақтауға." },
      { ru: "Бережно относиться к имуществу медицинской организации.", kz: "Медициналық ұйымның мүлкіне ұқыпты қарауға." },
      { ru: "Уплачивать взносы на обязательное социальное медицинское страхование (ОСМС).", kz: "Міндетті әлеуметтік медициналық сақтандыруға (МӘМС) жарналарды төлеуге." },
      { ru: "Не совершать действий, нарушающих права других пациентов.", kz: "Басқа пациенттердің құқықтарын бұзатын әрекеттер жасамауға." },
      { ru: "Беременные женщины обязаны встать на медицинский учет в срок до 12 недель.", kz: "Жүкті әйелдер 12 аптаға дейінгі мерзімде медициналық есепке тұруға міндетті." }
    ]
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
          <p className="text-lg opacity-90 max-w-3xl flex items-center">
            <BookOpen size={20} className="mr-2" />
            {t.subtitle}
          </p>
        </div>
      </div>

      {/* 2. CONTENT */}
      <div className="container mx-auto px-4 py-12">
        
        {/* Переключатель (Табы) */}
        <div className="flex justify-center mb-12">
           <div className="bg-white p-1 rounded-full shadow-md inline-flex border border-gray-200">
              <button 
                onClick={() => setActiveTab('rights')}
                className={`px-8 py-3 rounded-full text-sm md:text-base font-bold transition-all duration-300 flex items-center ${
                  activeTab === 'rights' 
                  ? 'bg-teal-600 text-white shadow-lg' 
                  : 'text-gray-500 hover:text-teal-600'
                }`}
              >
                 <ShieldCheck size={20} className="mr-2" />
                 {t.tabRights}
              </button>
              <button 
                onClick={() => setActiveTab('duties')}
                className={`px-8 py-3 rounded-full text-sm md:text-base font-bold transition-all duration-300 flex items-center ${
                  activeTab === 'duties' 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'text-gray-500 hover:text-blue-600'
                }`}
              >
                 <UserCheck size={20} className="mr-2" />
                 {t.tabDuties}
              </button>
           </div>
        </div>

        {/* Контент табов */}
        <div className="max-w-4xl mx-auto">
           
           {/* ПРАВА */}
           {activeTab === 'rights' && (
              <div className="animate-fade-in">
                 <div className="bg-white rounded-2xl shadow-lg border border-teal-100 overflow-hidden">
                    <div className="bg-teal-50 p-6 border-b border-teal-100 flex items-center">
                       <ShieldCheck className="text-teal-600 mr-3" size={32} />
                       <h2 className="text-2xl font-bold text-teal-800">{t.rightsHeader}</h2>
                    </div>
                    <div className="p-6 md:p-8">
                       <ul className="space-y-4">
                          {content.rights.map((item, idx) => (
                             <li key={idx} className="flex items-start">
                                <div className="mt-1 mr-4 flex-shrink-0 w-6 h-6 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center font-bold text-xs">
                                   {idx + 1}
                                </div>
                                <span className="text-gray-700 text-lg leading-relaxed">
                                   {lang === 'ru' ? item.ru : item.kz}
                                </span>
                             </li>
                          ))}
                       </ul>
                    </div>
                 </div>
              </div>
           )}

           {/* ОБЯЗАННОСТИ */}
           {activeTab === 'duties' && (
              <div className="animate-fade-in">
                 <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
                    <div className="bg-blue-50 p-6 border-b border-blue-100 flex items-center">
                       <UserCheck className="text-blue-600 mr-3" size={32} />
                       <h2 className="text-2xl font-bold text-blue-800">{t.dutiesHeader}</h2>
                    </div>
                    <div className="p-6 md:p-8">
                       <ul className="space-y-4">
                          {content.duties.map((item, idx) => (
                             <li key={idx} className="flex items-start">
                                <div className="mt-1 mr-4 flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                                   {idx + 1}
                                </div>
                                <span className="text-gray-700 text-lg leading-relaxed">
                                   {lang === 'ru' ? item.ru : item.kz}
                                </span>
                             </li>
                          ))}
                       </ul>
                    </div>
                 </div>
              </div>
           )}

           {/* Футер с напоминанием */}
           <div className="mt-8 bg-yellow-50 p-6 rounded-xl border border-yellow-200 flex items-start">
              <AlertCircle className="text-yellow-500 mr-4 flex-shrink-0" size={24} />
              <p className="text-sm text-gray-700 italic">
                 {lang === 'ru' 
                   ? "Взаимное уважение и соблюдение прав и обязанностей — залог успешного лечения и крепкого здоровья!" 
                   : "Өзара сыйластық пен құқықтар мен міндеттерді сақтау — табысты емделу мен зор денсаулықтың кепілі!"}
              </p>
           </div>

        </div>

      </div>
    </div>
  );
}