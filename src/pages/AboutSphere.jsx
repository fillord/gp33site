import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Facebook, Instagram, Mail, Phone, CheckCircle } from 'lucide-react';

export default function AboutSphere() {
  const { lang } = useOutletContext();

  const content = {
    ru: {
      breadcrumb: "ГЛАВНАЯ СТРАНИЦА / СФЕРА ДЕЯТЕЛЬНОСТИ",
      title: "СФЕРА ДЕЯТЕЛЬНОСТИ",
      intro: "В разделе сфера деятельности:",
      mainText: "КГП на ПХВ «Городская поликлиника №33» оказывает амбулаторно-поликлиническую помощь взрослому и детскому населению по следующим специальностям:",
      services: [
        "Первичная медико-санитарная помощь (квалифицированная): прием участковых врачей (ВОП), педиатров.",
        "Доврачебная помощь: фильтр, процедурный кабинет, прививочный кабинет.",
        "Консультативно-диагностическая помощь профильных специалистов: кардиология, невропатология, хирургия, оториноларингология (ЛОР), офтальмология, эндокринология, травматология, стоматология, акушерство и гинекология.",
        "Диагностика: функциональная (УЗИ, ЭКГ, Холтер, СМАД), рентгенологическая (флюорография, рентген), эндоскопическая.",
        "Лабораторная диагностика: общеклинические, биохимические, иммунологические исследования.",
        "Медицинская реабилитология и восстановительное лечение: лечебная физкультура (ЛФК), массаж, физиотерапия.",
        "Стационарозамещающая помощь: дневной стационар для взрослых и детей.",
        "Экспертиза временной нетрудоспособности (выдача больничных листов).",
        "Профилактическая деятельность: скрининги, школы здоровья, планирование семьи."
      ]
    },
    kz: {
      breadcrumb: "БАСТЫ БЕТ / ҚЫЗМЕТ САЛАСЫ",
      title: "ҚЫЗМЕТ САЛАСЫ",
      intro: "Қызмет саласы бөлімінде:",
      mainText: "«№33 қалалық емхана» ШЖҚ КМК ересектер мен балаларға келесі мамандықтар бойынша амбулаториялық-емханалық көмек көрсетеді:",
      services: [
        "Алғашқы медициналық-санитарлық көмек (білікті): учаскелік дәрігерлердің (ЖТД), педиатрлардың қабылдауы.",
        "Дәрігерге дейінгі көмек: сүзгі, емшара кабинеті, егу кабинеті.",
        "Бейінді мамандардың консультациялық-диагностикалық көмегі: кардиология, невропатология, хирургия, оториноларингология (ЛОР), офтальмология, эндокринология, травматология, стоматология, акушерство және гинекология.",
        "Диагностика: функционалдық (УДЗ, ЭКГ, Холтер, ТҚБ), рентгенологиялық (флюорография, рентген), эндоскопиялық.",
        "Зертханалық диагностика: жалпы клиникалық, биохимиялық, иммунологиялық зерттеулер.",
        "Медициналық оңалту және қалпына келтіру емі: емдік дене шынықтыру (ЕДШ), массаж, физиотерапия.",
        "Стационарды алмастыратын көмек: ересектер мен балаларға арналған күндізгі стационар.",
        "Уақытша еңбекке жарамсыздық сараптамасы (еңбекке жарамсыздық парақтарын беру).",
        "Профилактикалық қызмет: скринингтер, денсаулық мектептері, отбасын жоспарлау."
      ]
    }
  };

  const t = content[lang] || content['ru'];

  return (
    <div className="flex flex-col min-h-[60vh]">
      {/* 1. HEADER */}
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

      {/* 2. CONTENT */}
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white max-w-5xl">
          <p className="text-gray-500 text-sm mb-4 italic">{t.intro}</p>
          
          <h3 className="text-xl font-bold text-teal-800 mb-6 leading-relaxed">
            {t.mainText}
          </h3>

          <ul className="space-y-4 text-gray-700">
            {t.services.map((item, index) => (
              <li key={index} className="flex items-start">
                <CheckCircle className="text-teal-500 mt-1 mr-3 flex-shrink-0" size={20} />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          {/* 3. SOCIAL ICONS */}
          <div className="mt-12 flex space-x-3">
            <a href="https://www.instagram.com/emhana33_almaty/" className="w-10 h-10 bg-blue-800 text-white rounded flex items-center justify-center hover:opacity-80 transition">
              <Instagram size={20} />
            </a>
            <a href="tel:+77273395903" className="w-10 h-10 bg-green-500 text-white rounded flex items-center justify-center hover:opacity-80 transition">
                <Phone size={20} />
            </a>
            <a href="mailto:priemnaya_gp33@mail.ru" className="w-10 h-10 bg-red-500 text-white rounded flex items-center justify-center hover:opacity-80 transition">
                <Mail size={20} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}