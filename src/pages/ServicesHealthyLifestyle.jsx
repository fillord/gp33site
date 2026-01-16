import React, { useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { Heart, Apple, Activity, Moon, Smile, Calculator, ChevronRight, CheckCircle } from 'lucide-react';

export default function ServicesHealthyLifestyle() {
  const { lang } = useOutletContext();
  
  // Состояние для калькулятора ИМТ
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmiResult, setBmiResult] = useState(null);

  const calculateBMI = () => {
    if (weight && height) {
      const h = height / 100; // перевод в метры
      const bmi = (weight / (h * h)).toFixed(1);
      
      let status = '';
      let color = '';

      if (bmi < 18.5) {
        status = lang === 'ru' ? "Недостаточный вес" : "Салмақ жеткіліксіз";
        color = "text-blue-500";
      } else if (bmi >= 18.5 && bmi < 24.9) {
        status = lang === 'ru' ? "Норма" : "Қалыпты";
        color = "text-green-500";
      } else if (bmi >= 25 && bmi < 29.9) {
        status = lang === 'ru' ? "Избыточный вес" : "Артық салмақ";
        color = "text-orange-500";
      } else {
        status = lang === 'ru' ? "Ожирение" : "Семіздік";
        color = "text-red-500";
      }

      setBmiResult({ value: bmi, status, color });
    }
  };

  const t = {
    breadcrumb: lang === 'ru' ? "ГЛАВНАЯ / ЗОЖ" : "БАСТЫ БЕТ / СӨС",
    title: lang === 'ru' ? "Здоровый образ жизни" : "Салауатты өмір салты",
    subtitle: lang === 'ru' ? "5 простых шагов к долголетию и хорошему самочувствию" : "Ұзақ өмір сүру мен жақсы көңіл-күйге арналған 5 қарапайым қадам",
    
    // Калькулятор
    calcTitle: lang === 'ru' ? "Узнайте свой Индекс Массы Тела (ИМТ)" : "Дене салмағының индексін (ДСИ) біліңіз",
    weightLabel: lang === 'ru' ? "Вес (кг)" : "Салмақ (кг)",
    heightLabel: lang === 'ru' ? "Рост (см)" : "Бой (см)",
    calcBtn: lang === 'ru' ? "Рассчитать" : "Есептеу",
    yourBmi: lang === 'ru' ? "Ваш ИМТ:" : "Сіздің ДСИ:",

    // Правила
    rules: [
      {
        icon: Apple,
        color: "bg-green-500",
        title: { ru: "Правильное питание", kz: "Дұрыс тамақтану" },
        desc: { ru: "Используйте «Метод тарелки»: 1/2 овощи, 1/4 белки, 1/4 углеводы. Ограничьте сахар и соль.", kz: "«Тәрелке әдісін» қолданыңыз: 1/2 көкөністер, 1/4 ақуыздар, 1/4 көмірсулар. Қант пен тұзды шектеңіз." }
      },
      {
        icon: Activity,
        color: "bg-blue-500",
        title: { ru: "Активность", kz: "Белсенділік" },
        desc: { ru: "Минимум 150 минут умеренной активности в неделю. Даже простая ходьба укрепляет сердце.", kz: "Аптасына кемінде 150 минут орташа белсенділік. Тіпті қарапайым жаяу жүру жүректі нығайтады." }
      },
      {
        icon: Moon,
        color: "bg-indigo-500",
        title: { ru: "Здоровый сон", kz: "Салауатты ұйқы" },
        desc: { ru: "Спать нужно 7-8 часов. Ложитесь и вставайте в одно время, проветривайте комнату перед сном.", kz: "7-8 сағат ұйықтау керек. Бір уақытта жатып, бір уақытта тұрыңыз, ұйықтар алдында бөлмені желдетіңіз." }
      },
      {
        icon: Smile,
        color: "bg-yellow-500",
        title: { ru: "Нет стрессу", kz: "Күйзеліске жол жоқ" },
        desc: { ru: "Находите время для хобби и отдыха. Общение с близкими — лучшее лекарство от тревоги.", kz: "Хобби мен демалуға уақыт табыңыз. Жақындарыңызбен сөйлесу — мазасыздыққа қарсы ең жақсы дәрі." }
      },
      {
        icon: Heart,
        color: "bg-red-500",
        title: { ru: "Отказ от привычек", kz: "Әдеттерден бас тарту" },
        desc: { ru: "Курение и алкоголь — главные враги сосудов. Бросить никогда не поздно.", kz: "Темекі шегу мен алкоголь — тамырлардың басты жаулары. Тастау ешқашан кеш емес." }
      }
    ],

    schoolLink: {
      title: lang === 'ru' ? "Хотите узнать больше?" : "Көбірек білгіңіз келе ме?",
      text: lang === 'ru' ? "Посетите наши бесплатные Школы здоровья при поликлинике." : "Емхана жанындағы тегін Денсаулық мектептеріне келіңіз.",
      btn: lang === 'ru' ? "Перейти к графику школ" : "Мектептер кестесіне өту"
    }
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
          <p className="text-lg opacity-90 max-w-2xl">{t.subtitle}</p>
        </div>
      </div>

      {/* 2. CONTENT */}
      <div className="container mx-auto px-4 py-12">

        {/* Секция: 5 ПРАВИЛ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
           {t.rules.map((rule, idx) => (
             <div key={idx} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition border border-gray-100 flex flex-col items-start">
                <div className={`${rule.color} w-12 h-12 rounded-full flex items-center justify-center text-white mb-4 shadow-sm`}>
                   <rule.icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{rule.title[lang]}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                   {rule.desc[lang]}
                </p>
             </div>
           ))}
           
           {/* Карточка-ссылка на школы */}
           <div className="bg-teal-600 p-6 rounded-xl shadow-md text-white flex flex-col justify-center items-start">
              <h3 className="text-xl font-bold mb-2">{t.schoolLink.title}</h3>
              <p className="text-teal-100 text-sm mb-6">{t.schoolLink.text}</p>
              <Link to="/patients/schools" className="bg-white text-teal-700 font-bold py-2 px-4 rounded-lg hover:bg-teal-50 transition flex items-center text-sm">
                 {t.schoolLink.btn} <ChevronRight size={16} className="ml-1"/>
              </Link>
           </div>
        </div>

        {/* Секция: КАЛЬКУЛЯТОР ИМТ */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
           
           {/* Левая часть: Форма */}
           <div className="md:w-1/2 p-8 md:p-12">
              <div className="flex items-center gap-3 mb-6">
                 <div className="bg-teal-100 p-3 rounded-full text-teal-600">
                    <Calculator size={32} />
                 </div>
                 <h2 className="text-2xl font-bold text-gray-800">{t.calcTitle}</h2>
              </div>
              
              <div className="space-y-6">
                 <div>
                    <label className="block text-gray-700 font-bold mb-2">{t.weightLabel}</label>
                    <input 
                      type="number" 
                      value={weight} 
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-lg"
                      placeholder="70"
                    />
                 </div>
                 <div>
                    <label className="block text-gray-700 font-bold mb-2">{t.heightLabel}</label>
                    <input 
                      type="number" 
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-lg"
                      placeholder="175"
                    />
                 </div>
                 <button 
                   onClick={calculateBMI}
                   className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-lg transition shadow-md"
                 >
                    {t.calcBtn}
                 </button>
              </div>
           </div>

           {/* Правая часть: Результат */}
           <div className="md:w-1/2 bg-teal-50 p-8 md:p-12 flex flex-col justify-center items-center text-center border-t md:border-t-0 md:border-l border-gray-100">
              {bmiResult ? (
                 <div className="animate-fade-in">
                    <div className="text-gray-500 font-bold uppercase tracking-widest mb-2">{t.yourBmi}</div>
                    <div className={`text-6xl font-black mb-4 ${bmiResult.color}`}>
                       {bmiResult.value}
                    </div>
                    <div className={`text-2xl font-bold ${bmiResult.color} flex items-center justify-center gap-2`}>
                       {bmiResult.color === 'text-green-500' && <CheckCircle size={24} />}
                       {bmiResult.status}
                    </div>
                    <p className="text-gray-500 mt-4 text-sm max-w-xs mx-auto">
                       {lang === 'ru' 
                         ? "Индекс массы тела является ориентировочным показателем. Для точной диагностики обратитесь к врачу."
                         : "Дене салмағының индексі шамамен алынған көрсеткіш болып табылады. Нақты диагностика үшін дәрігерге қаралыңыз."}
                    </p>
                 </div>
              ) : (
                 <div className="opacity-50">
                    <Activity size={80} className="text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">
                       {lang === 'ru' ? "Введите рост и вес, чтобы увидеть результат" : "Нәтижені көру үшін бой мен салмақты енгізіңіз"}
                    </p>
                 </div>
              )}
           </div>

        </div>

      </div>
    </div>
  );
}