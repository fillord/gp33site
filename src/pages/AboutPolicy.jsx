import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Facebook, Mail, Phone, MessageCircle } from 'lucide-react';

export default function AboutPolicy() {
  const { lang } = useOutletContext();

  const content = {
    ru: {
      breadcrumb: "ГЛАВНАЯ СТРАНИЦА / АНТИКОРРУПЦИОННАЯ ПОЛИТИКА",
      title: "АНТИКОРРУПЦИОННАЯ ПОЛИТИКА",
      headline: "Антикоррупционная комплаенс-служба",
      greeting: "Уважаемые посетители сайта!",
      intro: "Добро пожаловать на страницу Антикоррупционной комплаенс-службы КГП на ПХВ «Городская поликлиника №33» Управления общественного здравоохранения города Алматы.",
      goal: "Основной целью деятельности антикоррупционной комплаенс-службы является обеспечение соблюдения Поликлиникой и его работниками законодательства Республики Казахстан о противодействии коррупции, а также мониторинг за реализацией мероприятий по противодействию коррупции.",
      callToAction: "Если Вы столкнулись с фактом нарушения законодательства Республики Казахстан о противодействии коррупции, в том числе нормативных правовых актов уполномоченного органа и этических норм, Вы можете сообщить об этом в Антикоррупционную комплаенс-службу, по номеру: +7 (***) ***-**-**",
      contactTitle: "Обращение можно подать:",
      contacts: [
        "1. Письменно по адресу: г. Алматы, Жетысуский район, пр. Райымбека, 263/2",
        "2. Электронная почта: priemnaya_gp33@mail.ru"
      ]
    },
    kz: {
      breadcrumb: "БАСТЫ БЕТ / СЫБАЙЛАС ЖЕМҚОРЛЫҚҚА ҚАРСЫ САЯСАТ",
      title: "СЫБАЙЛАС ЖЕМҚОРЛЫҚҚА ҚАРСЫ САЯСАТ",
      headline: "Сыбайлас жемқорлыққа қарсы комплаенс-қызметі",
      greeting: "Құрметті сайтқа келушілер!",
      intro: "Алматы қаласы Қоғамдық денсаулық сақтау басқармасының «№33 қалалық емхана» ШЖҚ КМК Сыбайлас жемқорлыққа қарсы комплаенс-қызметінің парақшасына қош келдіңіздер.",
      goal: "Сыбайлас жемқорлыққа қарсы комплаенс-қызметінің негізгі мақсаты Емхананың және оның қызметкерлерінің Қазақстан Республикасының сыбайлас жемқорлыққа қарсы іс-қимыл туралы заңнамасын сақтауын қамтамасыз ету, сондай-ақ сыбайлас жемқорлыққа қарсы іс-қимыл жөніндегі іс-шаралардың іске асырылуына мониторинг жүргізу болып табылады.",
      callToAction: "Егер Сіз Қазақстан Республикасының сыбайлас жемқорлыққа қарсы іс-қимыл туралы заңнамасын, оның ішінде уәкілетті органның нормативтік құқықтық актілерін және әдеп нормаларын бұзу фактісіне тап болсаңыз, бұл туралы Сыбайлас жемқорлыққа қарсы комплаенс-қызметіне +7 (***) ***-**-** нөмірі бойынша хабарлай аласыз.",
      contactTitle: "Өтінішті беруге болады:",
      contacts: [
        "1. Жазбаша мекенжай бойынша: Алматы қ., Жетісу ауданы, Райымбек даңғ., 263/2",
        "2. Электрондық пошта: priemnaya_gp33@mail.ru"
      ]
    }
  };

  const t = content[lang] || content['ru'];

  return (
    <div className="flex flex-col min-h-[60vh]">
      {/* 1. HEADER (Темно-бирюзовый фон, как на фото) */}
      <div className="bg-teal-700 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-xs font-bold text-yellow-400 uppercase tracking-widest mb-2">
            {t.breadcrumb}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold uppercase">
            {t.title}
          </h1>
        </div>
      </div>

      {/* 2. CONTENT (Белый фон) */}
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white max-w-5xl">
          
          <h2 className="text-3xl font-bold text-gray-900 mb-6">{t.headline}</h2>
          
          {/* Повторение заголовка поменьше (как на фото) */}
          <h3 className="text-lg font-bold text-gray-800 mb-4">{t.headline}</h3>

          <div className="space-y-6 text-gray-700 leading-relaxed">
             <p><strong>{t.greeting}</strong><br/>{t.intro}</p>
             <p>{t.goal}</p>
             <p className="bg-teal-50 p-4 border-l-4 border-teal-500 rounded-r">
                {t.callToAction}
             </p>
             
             <div>
                <p className="mb-2">{t.contactTitle}</p>
                <ul className="list-none space-y-1 pl-0">
                   {t.contacts.map((line, i) => (
                      <li key={i}>{line}</li>
                   ))}
                </ul>
             </div>
          </div>

          {/* 3. SOCIAL ICONS (Цветные кнопки внизу) */}
          <div className="mt-12 flex space-x-3">
             {/* Facebook */}
             <a href="#" className="w-10 h-10 bg-[#3b5998] text-white rounded flex items-center justify-center hover:opacity-90 transition">
               <Facebook size={20} />
             </a>
             {/* VK */}
             <a href="#" className="w-10 h-10 bg-[#4c75a3] text-white rounded flex items-center justify-center hover:opacity-90 transition">
                <span className="font-bold text-xs">VK</span>
             </a>
             {/* OK */}
             <a href="#" className="w-10 h-10 bg-[#ff7f00] text-white rounded flex items-center justify-center hover:opacity-90 transition">
                <span className="font-bold text-xs">OK</span>
             </a>
             {/* Whatsapp */}
             <a href="#" className="w-10 h-10 bg-[#25d366] text-white rounded flex items-center justify-center hover:opacity-90 transition">
                <MessageCircle size={20} />
             </a>
             {/* Mail */}
             <a href="#" className="w-10 h-10 bg-[#dd4b39] text-white rounded flex items-center justify-center hover:opacity-90 transition">
                <Mail size={20} />
             </a>
          </div>

        </div>
      </div>
    </div>
  );
}