import React, { useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { Search, Calendar, User, CheckCircle, Info, Activity } from 'lucide-react';

export default function ServicesScreening() {
  const { lang } = useOutletContext();

  const [age, setAge] = useState('');
  const [gender, setGender] = useState('female'); // male, female
  const [result, setResult] = useState(null);

  const t = {
    breadcrumb: lang === 'ru' ? "ГЛАВНАЯ / СКРИНИНГИ" : "БАСТЫ БЕТ / СКРИНИНГТЕР",
    title: lang === 'ru' ? "Проверьте свое здоровье бесплатно" : "Денсаулығыңызды тегін тексеріңіз",
    subtitle: lang === 'ru' 
      ? "Узнайте, какие профилактические осмотры (скрининги) доступны вам в этом году в рамках ГОБМП." 
      : "Осы жылы ТМКЕК аясында сізге қандай профилактикалық тексерулер (скринингтер) қолжетімді екенін біліңіз.",
    formTitle: lang === 'ru' ? "Введите свои данные" : "Деректеріңізді енгізіңіз",
    ageLabel: lang === 'ru' ? "Ваш возраст (полных лет):" : "Сіздің жасыңыз (толық жыл):",
    genderLabel: lang === 'ru' ? "Ваш пол:" : "Сіздің жынысыңыз:",
    male: lang === 'ru' ? "Мужской" : "Ер",
    female: lang === 'ru' ? "Женский" : "Әйел",
    btn: lang === 'ru' ? "Проверить" : "Тексеру",
    
    resultTitle: lang === 'ru' ? "Вам доступны следующие обследования:" : "Сізге келесі тексерулер қолжетімді:",
    noResult: lang === 'ru' 
      ? "В этом году для вашего возраста скрининги не предусмотрены. Однако вы всегда можете пройти профилактический осмотр у терапевта." 
      : "Бұл жылы сіздің жасыңызға скринингтер қарастырылмаған. Дегенмен, сіз әрқашан терапевттен профилактикалық тексеруден өте аласыз.",
    note: lang === 'ru'
      ? "Для прохождения скрининга обратитесь в доврачебный кабинет (№103) без записи. При себе иметь удостоверение личности."
      : "Скринингтен өту үшін дәрігерге дейінгі кабинетке (№103) жазылусыз хабарласыңыз. Өзіңізбен бірге жеке куәлігіңіз болуы керек."
  };

  // База данных скринингов РК (Упрощенная актуальная версия)
  const checkScreening = () => {
    if (!age) return;
    const userAge = parseInt(age);
    let screenings = [];

    // 1. Артериальная гипертония, ИБС, Сахарный диабет (Мужчины и Женщины 40-70 лет)
    // Периодичность: раз в 2 года (четные/нечетные года не учитываем для простоты, берем диапазон)
    if (userAge >= 40 && userAge <= 70) {
      screenings.push({
        id: 1,
        title: { ru: "Раннее выявление болезней системы кровообращения и диабета", kz: "Қанайналым жүйесі ауруларын және диабетті ерте анықтау" },
        desc: { ru: "Измерение давления, холестерина, глюкозы крови, ЭКГ.", kz: "Қан қысымын, холестеринді, қандағы глюкозаны өлшеу, ЭКГ." }
      });
    }

    // 2. Глаукома (Мужчины и Женщины 40-70 лет)
    if (userAge >= 40 && userAge <= 70) {
      screenings.push({
        id: 2,
        title: { ru: "Скрининг на глаукому", kz: "Глаукомаға скрининг" },
        desc: { ru: "Измерение внутриглазного давления.", kz: "Көз ішілік қысымды өлшеу." }
      });
    }

    // 3. Рак молочной железы (Женщины 40-70 лет)
    if (gender === 'female' && userAge >= 40 && userAge <= 70) {
      screenings.push({
        id: 3,
        title: { ru: "Профилактика рака молочной железы", kz: "Сүт безі обырының алдын алу" },
        desc: { ru: "Маммография (рентген молочных желез).", kz: "Маммография (сүт бездерінің рентгені)." }
      });
    }

    // 4. Рак шейки матки (Женщины 30-70 лет)
    if (gender === 'female' && userAge >= 30 && userAge <= 70) {
      screenings.push({
        id: 4,
        title: { ru: "Профилактика рака шейки матки", kz: "Жатыр мойны обырының алдын алу" },
        desc: { ru: "Цитологическое исследование мазка.", kz: "Жағындыны цитологиялық зерттеу." }
      });
    }

    // 5. Колоректальный рак (Мужчины и Женщины 50-70 лет)
    if (userAge >= 50 && userAge <= 70) {
      screenings.push({
        id: 5,
        title: { ru: "Профилактика колоректального рака", kz: "Колоректальды обырдың алдын алу" },
        desc: { ru: "Анализ кала на скрытую кровь.", kz: "Жасырын қанға нәжісті талдау." }
      });
    }

    // Молодежный центр (Пример)
    if (userAge >= 18 && userAge <= 29) {
       screenings.push({
        id: 6,
        title: { ru: "Профилактика в Молодежном центре здоровья", kz: "Жастар денсаулық орталығындағы профилактика" },
        desc: { ru: "Консультация психолога, уролога/гинеколога, дерматовенеролога.", kz: "Психолог, уролог/гинеколог, дерматовенеролог кеңесі." }
      });
    }

    setResult(screenings);
  };

  return (
    <div className="flex flex-col min-h-[60vh] bg-gray-50">
      
      {/* HEADER */}
      <div className="bg-teal-700 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-xs font-bold text-yellow-400 uppercase tracking-widest mb-2">
            {t.breadcrumb}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold uppercase mb-4">
            {t.title}
          </h1>
          <p className="text-lg opacity-90 max-w-2xl">{t.subtitle}</p>
        </div>
      </div>

      {/* CONTENT */}
      <div className="container mx-auto px-4 py-12">
        
        <div className="flex flex-col lg:flex-row gap-8 items-start">
           
           {/* ФОРМА */}
           <div className="w-full lg:w-1/3 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                 <User className="text-teal-500 mr-2"/> {t.formTitle}
              </h3>
              
              <div className="space-y-6">
                 <div>
                    <label className="block text-gray-700 font-bold mb-2">{t.ageLabel}</label>
                    <input 
                      type="number" 
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-lg"
                      placeholder="35"
                    />
                 </div>

                 <div>
                    <label className="block text-gray-700 font-bold mb-2">{t.genderLabel}</label>
                    <div className="flex gap-4">
                       <button 
                         onClick={() => setGender('male')}
                         className={`flex-1 py-3 px-4 rounded-lg font-bold border-2 transition ${gender === 'male' ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                       >
                          {t.male}
                       </button>
                       <button 
                         onClick={() => setGender('female')}
                         className={`flex-1 py-3 px-4 rounded-lg font-bold border-2 transition ${gender === 'female' ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                       >
                          {t.female}
                       </button>
                    </div>
                 </div>

                 <button 
                   onClick={checkScreening}
                   className="w-full bg-yellow-400 hover:bg-yellow-500 text-teal-900 font-bold py-4 rounded-lg transition shadow-md flex items-center justify-center"
                 >
                    <Search size={20} className="mr-2"/> {t.btn}
                 </button>
              </div>
           </div>

           {/* РЕЗУЛЬТАТ */}
           <div className="w-full lg:w-2/3">
              {result !== null ? (
                 <div className="animate-fade-in">
                    {result.length > 0 ? (
                       <div className="bg-white rounded-xl shadow-lg border border-teal-100 overflow-hidden">
                          <div className="bg-teal-600 text-white p-6">
                             <h3 className="text-xl font-bold flex items-center">
                                <CheckCircle className="mr-3" size={24}/> {t.resultTitle}
                             </h3>
                          </div>
                          <div className="divide-y divide-gray-100">
                             {result.map((item) => (
                                <div key={item.id} className="p-6 hover:bg-gray-50 transition">
                                   <div className="flex items-start">
                                      <div className="w-10 h-10 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center flex-shrink-0 mr-4 mt-1">
                                         <Activity size={20} />
                                      </div>
                                      <div>
                                         <h4 className="text-lg font-bold text-gray-800 mb-1">{item.title[lang]}</h4>
                                         <p className="text-gray-600">{item.desc[lang]}</p>
                                      </div>
                                   </div>
                                </div>
                             ))}
                          </div>
                          <div className="bg-yellow-50 p-6 border-t border-yellow-100 flex items-start text-yellow-800 text-sm">
                             <Info size={20} className="mr-3 flex-shrink-0 mt-0.5"/>
                             {t.note}
                          </div>
                       </div>
                    ) : (
                       <div className="bg-white rounded-xl shadow p-8 text-center border border-gray-100">
                          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                             <Calendar size={40}/>
                          </div>
                          <h3 className="text-xl font-bold text-gray-800 mb-2">{t.noResult}</h3>
                       </div>
                    )}
                 </div>
              ) : (
                 // Заглушка, пока не нажали кнопку
                 <div className="bg-white/50 border-2 border-dashed border-gray-300 rounded-xl p-12 text-center h-full flex flex-col items-center justify-center text-gray-400">
                    <Activity size={64} className="mb-4 opacity-50"/>
                    <p className="text-lg">
                       {lang === 'ru' ? "Заполните форму слева, чтобы увидеть результат" : "Нәтижені көру үшін сол жақтағы форманы толтырыңыз"}
                    </p>
                 </div>
              )}
           </div>

        </div>
      </div>
    </div>
  );
}