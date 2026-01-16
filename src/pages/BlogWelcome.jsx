import React from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { Quote, PenTool, Calendar } from 'lucide-react';

export default function BlogWelcome() {
  const { lang } = useOutletContext();

  const content = {
    ru: {
      breadcrumb: "ГЛАВНАЯ / БЛОГ / ПРИВЕТСТВЕННОЕ СЛОВО",
      title: "Блог Главного Врача",
      role: "Директор ГКП на ПХВ «Городская поликлиника №33»",
      name: "Абдрасилов Гани Болатович",
      quote: "Здоровье нации — это наше главное богатство. Мы работаем для того, чтобы качественная медицина была доступна каждому жителю нашего района.",
      text: [
        "Уважаемые посетители сайта!",
        "Рад приветствовать вас на официальном веб-ресурсе Городской поликлиники №33! Наша поликлиника — это новая, современная медицинская организация, созданная для обеспечения жителей Жетысуского района качественной и доступной медицинской помощью.",
        "Мы собрали команду высококвалифицированных специалистов и оснастили кабинеты передовым оборудованием. Наша цель — не просто лечить болезни, но и предотвращать их, создавая культуру заботы о здоровье.",
        "Я открыт для диалога. Если у вас есть предложения по улучшению нашей работы, жалобы или благодарности, вы всегда можете написать мне напрямую через этот блог. Ни одно обращение не останется без внимания.",
        "Желаю вам и вашим близким крепкого здоровья и благополучия!"
      ],
      btn: "Написать обращение директору",
      date: "Февраль, 2026"
    },
    kz: {
      breadcrumb: "БАСТЫ БЕТ / БЛОГ / АЛҒЫ СӨЗ",
      title: "Бас Дәрігердің Блогы",
      role: "«№33 Қалалық емхана» ШЖҚ КМК Директоры",
      name: "Абдрасилов Ғани Болатұлы",
      quote: "Ұлт денсаулығы — біздің басты байлығымыз. Біз сапалы медицинаның ауданымыздың әрбір тұрғынына қолжетімді болуы үшін жұмыс істейміз.",
      text: [
        "Құрметті сайтқа келушілер!",
        "Сіздерді №33 Қалалық емхананың ресми веб-ресурсында қарсы алуға қуаныштымын! Біздің емхана — Жетісу ауданының тұрғындарын сапалы әрі қолжетімді медициналық көмекпен қамтамасыз ету үшін құрылған жаңа, заманауи медициналық ұйым.",
        "Біз жоғары білікті мамандар командасын жинап, кабинеттерді озық жабдықтармен жабдықтадық. Біздің мақсатымыз — ауруларды емдеп қана қоймай, олардың алдын алу, денсаулыққа қамқорлық жасау мәдениетін қалыптастыру.",
        "Мен диалогқа ашықпын. Егер сізде біздің жұмысымызды жақсарту бойынша ұсыныстарыңыз, шағымдарыңыз немесе алғыстарыңыз болса, осы блог арқылы маған тікелей жаза аласыз. Бірде-бір өтініш назардан тыс қалмайды.",
        "Сізге және жақындарыңызға зор денсаулық пен амандық тілеймін!"
      ],
      btn: "Директорға өтініш жазу",
      date: "Ақпан, 2026"
    }
  };

  const t = content[lang] || content['ru'];

  return (
    <div className="flex flex-col min-h-[60vh] bg-gray-50">
      
      {/* 1. КРАСИВАЯ ШАПКА С ГРАДИЕНТОМ */}
      <div className="bg-gradient-to-r from-teal-800 to-teal-600 text-white py-16 relative overflow-hidden">
        {/* Декоративные круги */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-20 w-64 h-64 bg-yellow-400 opacity-10 rounded-full blur-2xl"></div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="text-xs font-bold text-yellow-300 uppercase tracking-widest mb-3">
            {t.breadcrumb}
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">
            {t.title}
          </h1>
          <div className="w-24 h-1 bg-yellow-400 mx-auto rounded"></div>
        </div>
      </div>

      {/* 2. ОСНОВНОЙ КОНТЕНТ */}
      <div className="w-full px-4 py-12 -mt-10 relative z-20">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden max-w-[95%] mx-auto flex flex-col md:flex-row">
          
          {/* ЛЕВАЯ КОЛОНКА: ФОТО */}
          <div className="md:w-1/2 bg-gray-100 relative min-h-[400px]">
            {/* Замените ссылку на реальное фото директора */}
            <img 
              src="/director.jpg" 
              alt={t.name} 
              className="w-full h-full object-cover absolute inset-0"
            />
            {/* Наложение градиента снизу для текста на фото (опционально) */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white md:hidden">
                <div className="font-bold text-xl">{t.name}</div>
                <div className="text-sm opacity-90">{t.role}</div>
            </div>
          </div>

          {/* ПРАВАЯ КОЛОНКА: ТЕКСТ */}
          <div className="md:w-1/2 p-8 md:p-12 flex flex-col">
            
            {/* Имя и должность (видны только на ПК, на мобильном они на фото) */}
            <div className="hidden md:block mb-8">
               <h2 className="text-3xl font-bold text-gray-800 mb-2">{t.name}</h2>
               <p className="text-teal-600 font-bold uppercase tracking-wide text-sm">{t.role}</p>
            </div>

            {/* Цитата */}
            <div className="bg-teal-50 border-l-4 border-teal-500 p-6 mb-8 rounded-r-lg italic text-gray-700 relative">
               <Quote className="absolute top-2 left-2 text-teal-200 transform -scale-x-100" size={40} />
               <p className="relative z-10 pl-4">"{t.quote}"</p>
            </div>

            {/* Текст обращения */}
            <div className="prose text-gray-600 leading-relaxed mb-8 text-lg">
              {t.text.map((paragraph, idx) => (
                <p key={idx} className={idx === 0 ? "font-bold text-gray-800 mb-4" : "mb-4"}>
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Подпись и Дата */}
            <div className="mt-auto pt-8 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
               <div className="flex items-center text-gray-400 text-sm">
                  <Calendar size={16} className="mr-2"/> {t.date}
               </div>
               
               {/* Имитация подписи */}
               <div className="font-handwriting text-3xl text-teal-800 rotate-[-5deg] opacity-80">
                  Абдрасилов Г.Б.
               </div>
            </div>

            {/* Кнопка действия */}
            <div className="mt-8 text-center md:text-right">
               <Link 
                 to="/blog/feedback" 
                 className="inline-flex items-center bg-teal-600 text-white px-8 py-4 rounded-full font-bold hover:bg-teal-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
               >
                 <PenTool size={18} className="mr-2" />
                 {t.btn}
               </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}