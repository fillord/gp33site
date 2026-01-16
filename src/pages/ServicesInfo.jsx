import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Info, CheckCircle, Wallet, Phone, Globe, Smartphone, CreditCard, MessageCircle, Youtube } from 'lucide-react';

export default function ServicesInfo() {
  const { lang } = useOutletContext();

  const content = {
    ru: {
      breadcrumb: "ГЛАВНАЯ / ИНФОРМАЦИОННЫЕ МАТЕРИАЛЫ",
      title: "ИНФОРМАЦИОННЫЕ МАТЕРИАЛЫ",
      tabs: ["Проверка статуса", "Как работает ОСМС", "Статус на год вперед", "Новости 2026"],
      
      // Блок 1: Проверка статуса
      section1: {
        title: "Памятка пациенту: 7 способов проверить статус ОСМС",
        text: "Уважаемые пациенты! Для получения плановой медицинской помощи необходимо иметь статус «Застрахован». Проверьте свой статус одним из способов:",
        methods: [
          { icon: Globe, title: "Сайты", desc: "msqory.kz и egov.kz" },
          { icon: Smartphone, title: "Приложения", desc: "Qoldau 24/7, Damumed" },
          { icon: CreditCard, title: "Банки", desc: "Kaspi, Halyk, BCC" },
          { icon: MessageCircle, title: "Telegram", desc: "Бот @SaqtandyryBot" },
          { icon: Phone, title: "Телефон", desc: "Единый номер 1414" }
        ]
      },

      // Блок 2: Как работает
      section2: {
        title: "Как работает система ОСМС",
        desc: "Система основана на солидарной ответственности государства, работодателей и граждан. Это не накопительная система: средства сразу идут на оплату лечения.",
        list: [
           "Консультации узких специалистов",
           "Дорогостоящие диагностические исследования (КТ, МРТ)",
           "Плановое стационарное лечение",
           "Медицинская реабилитация"
        ],
        footer: "ОСМС — здоровье каждого, ответственность всех!"
      },

      // Блок 3: Статус на год вперед
      section3: {
        title: "Как получить статус на год вперед (без погашения долгов)",
        desc: "Если у вас есть долги за прошлые периоды, вы можете не оплачивать их, а воспользоваться альтернативным механизмом:",
        steps: [
           "Оплатить взносы за 12 будущих месяцев.",
           "Платежи вносить отдельно за каждый месяц (не общей суммой).",
           "Отсчет начинать с текущего месяца, если помощь нужна сейчас."
        ]
      },

      // Блок 4: Изменения 2026
      section4: {
        title: "Расширение пакета ОСМС с 2026 года",
        items: [
           { title: "Хронические болезни", text: "Диабет, ревматизм, ДЦП полностью перейдут в пакет ОСМС (лекарства и обследования бесплатно)." },
           { title: "Гипертензия и почки", text: "Наблюдение для предотвращения инсультов, гемодиализ и трансплантация." },
           { title: "Низкие доходы", text: "Граждане категорий D и E будут застрахованы за счет государства." },
           { title: "Самозанятые", text: "Вход в систему с минимальным взносом (4 250 ₸/мес)." }
        ]
      },
      
      videoBtn: "Смотреть видео-инструкцию"
    },
    kz: {
      breadcrumb: "БАСТЫ БЕТ / АҚПАРАТТЫҚ МАТЕРИАЛДАР",
      title: "АҚПАРАТТЫҚ МАТЕРИАЛДАР",
      tabs: ["Мәртебені тексеру", "МӘМС қалай жұмыс істейді", "Бір жылға мәртебе", "Жаңалықтар 2026"],

      section1: {
        title: "Пациентке жадынама: МӘМС мәртебесін тексерудің 7 жолы",
        text: "Құрметті пациенттер! Жоспарлы медициналық көмек алу үшін «Сақтандырылған» мәртебесі болуы керек. Мәртебеңізді тексеріңіз:",
        methods: [
          { icon: Globe, title: "Сайттар", desc: "msqory.kz және egov.kz" },
          { icon: Smartphone, title: "Қосымшалар", desc: "Qoldau 24/7, Damumed" },
          { icon: CreditCard, title: "Банктер", desc: "Kaspi, Halyk, BCC" },
          { icon: MessageCircle, title: "Telegram", desc: "@SaqtandyryBot боты" },
          { icon: Phone, title: "Телефон", desc: "Бірыңғай нөмір 1414" }
        ]
      },

      section2: {
        title: "МӘМС жүйесі қалай жұмыс істейді",
        desc: "Жүйе мемлекеттің, жұмыс берушілердің және азаматтардың ынтымақты жауапкершілігіне негізделген. Бұл жинақтаушы жүйе емес: қаражат бірден емдеуге жұмсалады.",
        list: [
           "Бейінді мамандардың кеңестері",
           "Қымбат диагностикалық зерттеулер (КТ, МРТ)",
           "Жоспарлы стационарлық емдеу",
           "Медициналық оңалту"
        ],
        footer: "МӘМС — әркімнің денсаулығы, ортақ жауапкершілік!"
      },

      section3: {
        title: "Мәртебені алдағы бір жылға қалай алуға болады",
        desc: "Егер сізде өткен кезеңдер үшін қарыздар болса, оларды төлемей-ақ, балама механизмді қолдана аласыз:",
        steps: [
           "Алдағы 12 ай үшін жарналарды төлеу.",
           "Төлемдерді әр ай үшін жеке-жеке енгізу (жалпы сомамен емес).",
           "Егер көмек қазір қажет болса, есепті ағымдағы айдан бастау."
        ]
      },

      section4: {
        title: "2026 жылдан бастап МӘМС пакетін кеңейту",
        items: [
           { title: "Созылмалы аурулар", text: "Диабет, ревматизм, ДЦП толығымен МӘМС пакетіне өтеді (дәрі-дәрмек пен тексеру тегін)." },
           { title: "Гипертензия және бүйрек", text: "Инсульттың алдын алу, гемодиализ және трансплантация." },
           { title: "Төмен кірістер", text: "D және E санатындағы азаматтар мемлекет есебінен сақтандырылады." },
           { title: "Өзін-өзі жұмыспен қамтығандар", text: "Жүйеге минималды жарнамен кіру (айына 4 250 ₸)." }
        ]
      },
      
      videoBtn: "Бейне-нұсқаулықты көру"
    }
  };

  const t = content[lang] || content['ru'];

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
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        
        {/* БЛОК 1: ПРОВЕРКА СТАТУСА */}
        <section className="bg-white rounded-xl shadow-md p-8 mb-8 border-l-4 border-blue-500">
           <h2 className="text-2xl font-bold text-gray-800 mb-4">{t.section1.title}</h2>
           <p className="text-gray-600 mb-6">{t.section1.text}</p>
           
           <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {t.section1.methods.map((method, i) => (
                 <div key={i} className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition">
                    <div className="bg-white p-3 rounded-full shadow-sm mb-3 text-blue-600">
                       <method.icon size={24}/>
                    </div>
                    <div className="font-bold text-sm mb-1">{method.title}</div>
                    <div className="text-xs text-gray-500">{method.desc}</div>
                 </div>
              ))}
           </div>
        </section>

        {/* БЛОК 2 и 3: КАК РАБОТАЕТ и СТАТУС НА ГОД (В 2 колонки) */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
           
           {/* Как работает */}
           <section className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                 <Info className="mr-2 text-teal-500"/> {t.section2.title}
              </h2>
              <p className="text-gray-600 mb-4 text-sm">{t.section2.desc}</p>
              <ul className="space-y-2 mb-6">
                 {t.section2.list.map((li, i) => (
                    <li key={i} className="flex items-start text-sm font-medium text-gray-700">
                       <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0"/> {li}
                    </li>
                 ))}
              </ul>
              <div className="text-teal-700 font-bold text-center bg-teal-50 p-3 rounded">
                 {t.section2.footer}
              </div>
           </section>

           {/* Статус на год */}
           <section className="bg-white rounded-xl shadow-md p-8 border-t-4 border-yellow-400">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                 <Wallet className="mr-2 text-yellow-500"/> {t.section3.title}
              </h2>
              <p className="text-gray-600 mb-4 text-sm">{t.section3.desc}</p>
              <div className="space-y-4">
                 {t.section3.steps.map((step, i) => (
                    <div key={i} className="flex items-center bg-yellow-50 p-3 rounded-lg">
                       <span className="font-bold text-yellow-600 mr-3 text-xl">{i+1}</span>
                       <span className="text-sm text-gray-800">{step}</span>
                    </div>
                 ))}
              </div>
           </section>
        </div>

        {/* БЛОК 4: НОВОСТИ 2026 */}
        <section className="bg-gradient-to-r from-teal-800 to-teal-700 rounded-xl shadow-lg p-8 text-white">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <h2 className="text-2xl font-bold">{t.section4.title}</h2>
              <span className="bg-yellow-400 text-teal-900 text-xs font-bold px-3 py-1 rounded-full uppercase mt-2 md:mt-0">Важно</span>
           </div>
           
           <div className="grid md:grid-cols-2 gap-6">
              {t.section4.items.map((item, i) => (
                 <div key={i} className="bg-white/10 p-4 rounded-lg backdrop-blur-sm border border-white/20">
                    <h4 className="font-bold text-yellow-300 mb-2">{item.title}</h4>
                    <p className="text-sm opacity-90">{item.text}</p>
                 </div>
              ))}
           </div>
           
           <div className="mt-8 text-center">
              <button className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full transition shadow-lg">
                 <Youtube size={20} className="mr-2"/> {t.videoBtn}
              </button>
           </div>
        </section>

      </div>
    </div>
  );
}