import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Heart, Activity, Apple, ChevronDown, ChevronUp, AlertCircle, Phone, Globe, Shield } from 'lucide-react';

export default function ServicesUseful() {
  const { lang } = useOutletContext();
  const [openFaq, setOpenFaq] = useState(null);

  const t = {
    breadcrumb: lang === 'ru' ? "ГЛАВНАЯ / ПОЛЕЗНАЯ ИНФОРМАЦИЯ" : "БАСТЫ БЕТ / ПАЙДАЛЫ АҚПАРАТ",
    title: lang === 'ru' ? "Полезная информация для пациентов" : "Пациенттерге арналған пайдалы ақпарат",
    subtitle: lang === 'ru' ? "Советы по здоровью, ответы на вопросы и важные контакты" : "Денсаулық бойынша кеңестер, сұрақтарға жауаптар және маңызды байланыстар",
    
    // Секция советов
    tipsTitle: lang === 'ru' ? "Азбука здоровья" : "Денсаулық әліппесі",
    tips: [
      {
        icon: Heart,
        color: "bg-red-500",
        title: { ru: "Профилактика сердечных заболеваний", kz: "Жүрек ауруларының алдын алу" },
        text: { 
          ru: "Контролируйте артериальное давление, следите за уровнем холестерина и больше двигайтесь. 30 минут ходьбы в день снижают риск инфаркта.", 
          kz: "Қан қысымын бақылаңыз, холестерин деңгейін қадағалаңыз және көбірек қимылдаңыз. Күніне 30 минут жаяу жүру инфаркт қаупін азайтады." 
        }
      },
      {
        icon: Apple,
        color: "bg-green-500",
        title: { ru: "Правильное питание", kz: "Дұрыс тамақтану" },
        text: { 
          ru: "Уменьшите потребление соли и сахара. Добавьте в рацион больше овощей, фруктов и клетчатки. Пейте достаточное количество воды.", 
          kz: "Тұз бен қантты тұтынуды азайтыңыз. Рационыңызға көкөністер, жемістер мен жасұнық қосыңыз. Суды жеткілікті мөлшерде ішіңіз." 
        }
      },
      {
        icon: Activity,
        color: "bg-blue-500",
        title: { ru: "Физическая активность", kz: "Физикалық белсенділік" },
        text: { 
          ru: "Регулярные упражнения укрепляют иммунитет, улучшают настроение и сон. Найдите вид спорта, который приносит вам удовольствие.", 
          kz: "Тұрақты жаттығулар иммунитетті нығайтады, көңіл-күй мен ұйқыны жақсартады. Сізге қуаныш сыйлайтын спорт түрін табыңыз." 
        }
      }
    ],

    // FAQ
    faqTitle: lang === 'ru' ? "Часто задаваемые вопросы (FAQ)" : "Жиі қойылатын сұрақтар (FAQ)",
    faqs: [
      {
        q: { ru: "Как прикрепиться к поликлинике?", kz: "Емханаға қалай тіркелуге болады?" },
        a: { 
          ru: "Вы можете подать заявку через портал Egov.kz (услуга «Прикрепление к медицинской организации») или обратиться в регистратуру с удостоверением личности.", 
          kz: "Сіз өтінімді Egov.kz порталы арқылы («Медициналық ұйымға тіркелу» қызметі) бере аласыз немесе жеке куәлікпен тіркеу бөліміне жүгіне аласыз." 
        }
      },
      {
        q: { ru: "Как вызвать врача на дом?", kz: "Дәрігерді үйге қалай шақыруға болады?" },
        a: { 
          ru: "Вызов врача осуществляется при острых состояниях (высокая температура, давление) через Call-центр по номеру 339-59-03 или мобильное приложение DamuMed до 11:00.", 
          kz: "Дәрігерді шақыру жіті жағдайларда (жоғары температура, қан қысымы) Call-орталықтың 339-59-03 нөмірі немесе DamuMed қосымшасы арқылы сағат 11:00-ге дейін жүзеге асырылады." 
        }
      },
      {
        q: { ru: "Что такое скрининг и зачем он нужен?", kz: "Скрининг дегеніміз не және ол не үшін қажет?" },
        a: { 
          ru: "Скрининг — это профилактический осмотр здоровых людей для раннего выявления заболеваний. Проводится бесплатно по возрасту (на диабет, глаукому, онкологию).", 
          kz: "Скрининг — бұл ауруларды ерте анықтау үшін сау адамдарды профилактикалық тексеру. Жасына қарай тегін жүргізіледі (диабет, глаукома, онкологияға)." 
        }
      }
    ],

    // Полезные ссылки
    linksTitle: lang === 'ru' ? "Полезные ресурсы" : "Пайдалы ресурстар",
    links: [
      { name: "Egov.kz - Электронное правительство", url: "https://egov.kz", icon: Globe },
      { name: "Fms.kz - Фонд медстрахования", url: "https://fms.kz", icon: Shield },
      { name: "103.kz - Лекарства и аптеки", url: "https://103.kz", icon: Activity }
    ]
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
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
        
        {/* Секция: СОВЕТЫ (Карточки) */}
        <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
           <Heart className="text-red-500 mr-3" /> {t.tipsTitle}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
           {t.tips.map((tip, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition group">
                 <div className={`${tip.color} p-4 flex justify-center items-center h-32 group-hover:scale-105 transition duration-500`}>
                    <tip.icon size={48} className="text-white" />
                 </div>
                 <div className="p-6">
                    <h3 className="font-bold text-xl text-gray-900 mb-3">{tip.title[lang]}</h3>
                    <p className="text-gray-600 leading-relaxed text-sm">
                       {tip.text[lang]}
                    </p>
                 </div>
              </div>
           ))}
        </div>

        {/* Секция: FAQ (Аккордеон) и Ссылки */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
           
           {/* FAQ (Занимает 2/3 ширины) */}
           <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                 <AlertCircle className="text-teal-500 mr-3" /> {t.faqTitle}
              </h2>
              <div className="space-y-4">
                 {t.faqs.map((item, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                       <button 
                         onClick={() => toggleFaq(index)}
                         className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-gray-50 transition"
                       >
                          <span className="font-bold text-lg text-gray-800">{item.q[lang]}</span>
                          {openFaq === index ? <ChevronUp className="text-teal-500"/> : <ChevronDown className="text-gray-400"/>}
                       </button>
                       {openFaq === index && (
                          <div className="p-5 border-t border-gray-100 bg-teal-50/30 text-gray-700 leading-relaxed animate-fade-in">
                             {item.a[lang]}
                          </div>
                       )}
                    </div>
                 ))}
              </div>
           </div>

           {/* Полезные ссылки (Занимает 1/3) */}
           <div>
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                 <Globe className="text-blue-500 mr-3" /> {t.linksTitle}
              </h2>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
                 {t.links.map((link, i) => (
                    <a 
                      key={i} 
                      href={link.url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex items-center p-3 rounded-lg hover:bg-blue-50 transition group"
                    >
                       <div className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3 group-hover:bg-blue-600 group-hover:text-white transition">
                          <link.icon size={20} />
                       </div>
                       <span className="font-medium text-gray-700 group-hover:text-blue-700">{link.name}</span>
                    </a>
                 ))}
                 
                 <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="flex items-center gap-3 bg-yellow-50 p-4 rounded-lg">
                       <Phone className="text-yellow-600" />
                       <div>
                          <div className="text-xs font-bold text-gray-400 uppercase">Call-центр</div>
                          <div className="font-bold text-gray-800">1406 (ФОМС)</div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

        </div>

      </div>
    </div>
  );
}