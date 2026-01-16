import React from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { Facebook, Instagram, Mail, Phone } from 'lucide-react'; // Убедитесь, что lucide-react установлен

export default function AboutGeneral() {
  const { lang } = useOutletContext();

  // === РЕАЛЬНЫЕ ДАННЫЕ О ПОЛИКЛИНИКЕ №33 ===
  const content = {
    ru: {
      breadcrumb: "ГЛАВНАЯ СТРАНИЦА / ОБЩАЯ ИНФОРМАЦИЯ",
      title: "ОБЩАЯ ИНФОРМАЦИЯ",
      text: [
        "КГП на ПХВ «Городская поликлиника №33» Управления общественного здравоохранения г. Алматы организована в 2024 году.",
        "Расположена по адресу: город Алматы, Жетысуский район, проспект Райымбека, 263/2.",
        "Специалисты поликлиники оказывают первичную медико-санитарную помощь жителям Жетысуского района (в том числе жителям массива «Рабочий поселок»).",
        "Плановая мощность поликлиники — 240 посещений в смену.",
        "Прикрепленное население составляет более 30 000 человек.",
        "Штат сотрудников включает 234 высококвалифицированных специалиста (ВОП, педиатры, профильные специалисты)."
      ]
    },
    kz: {
      breadcrumb: "БАСТЫ БЕТ / ЖАЛПЫ АҚПАРАТ",
      title: "ЖАЛПЫ АҚПАРАТ",
      text: [
        "Алматы қаласы Қоғамдық денсаулық сақтау басқармасының «№33 қалалық емхана» ШЖҚ КМК 2024 жылы құрылған.",
        "Орналасқан жері: Алматы қаласы, Жетісу ауданы, Райымбек даңғылы, 263/2.",
        "Емхана мамандары Жетісу ауданының тұрғындарына (соның ішінде «Жұмысшы ауылы» тұрғындарына) алғашқы медициналық-санитарлық көмек көрсетеді.",
        "Емхананың жоспарлы қуаты — ауысымына 240 келуші.",
        "Тіркелген халық саны 30 000-нан астам адамды құрайды.",
        "Қызметкерлер штатында 234 жоғары білікті маман (ЖТД, педиатрлар, бейінді мамандар) бар."
      ]
    }
  };

  const t = content[lang] || content['ru'];

  return (
    <div className="flex flex-col min-h-[60vh]">
      {/* 1. HEADER SECTION (Зеленый блок как на фото) */}
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

      {/* 2. WHITE CONTENT SECTION */}
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white max-w-4xl">
          <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
            {t.text.map((paragraph, index) => (
              <p key={index} className="border-l-4 border-teal-500 pl-4">
                {paragraph}
              </p>
            ))}
          </div>

          {/* 3. SOCIAL ICONS (Как на фото внизу) */}
          <div className="mt-12 flex space-x-3">
            <a href="#" className="w-10 h-10 bg-blue-800 text-white rounded flex items-center justify-center hover:opacity-80 transition">
              <Facebook size={20} />
            </a>
            <a href="#" className="w-10 h-10 bg-blue-500 text-white rounded flex items-center justify-center hover:opacity-80 transition">
              <span className="font-bold text-sm">VK</span>
            </a>
            <a href="#" className="w-10 h-10 bg-orange-500 text-white rounded flex items-center justify-center hover:opacity-80 transition">
               <span className="font-bold text-sm">OK</span>
            </a>
            <a href="#" className="w-10 h-10 bg-green-500 text-white rounded flex items-center justify-center hover:opacity-80 transition">
               <Phone size={20} />
            </a>
            <a href="#" className="w-10 h-10 bg-red-500 text-white rounded flex items-center justify-center hover:opacity-80 transition">
               <Mail size={20} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}