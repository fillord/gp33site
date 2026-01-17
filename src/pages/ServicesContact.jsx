import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Facebook, Mail, MessageCircle, Phone, ExternalLink, Instagram } from 'lucide-react';

export default function ServicesContact() {
  const { lang } = useOutletContext();

  const content = {
    ru: {
      breadcrumb: "ГЛАВНАЯ СТРАНИЦА / ЕДИНЫЙ КОНТАКТ-ЦЕНТР ДЛЯ КОНСУЛЬТАЦИИ ПО УСЛУГАМ",
      title: "ЕДИНЫЙ КОНТАКТ-ЦЕНТР ДЛЯ КОНСУЛЬТАЦИИ ПО УСЛУГАМ",
      subtitle: "Единый контакт-центр",
      freeCall: "ЗВОНОК БЕСПЛАТНЫЙ",
      egovText: "EGOV ГОСУДАРСТВЕННЫЕ УСЛУГИ И ИНФОРМАЦИЯ ОНЛАЙН"
    },
    kz: {
      breadcrumb: "БАСТЫ БЕТ / ҚЫЗМЕТТЕР БОЙЫНША КЕҢЕС БЕРУГЕ АРНАЛҒАН БІРЫҢҒАЙ БАЙЛАНЫС ОРТАЛЫҒЫ",
      title: "ҚЫЗМЕТТЕР БОЙЫНША КЕҢЕС БЕРУГЕ АРНАЛҒАН БІРЫҢҒАЙ БАЙЛАНЫС ОРТАЛЫҒЫ",
      subtitle: "Бірыңғай байланыс орталығы",
      freeCall: "ҚОҢЫРАУ ШАЛУ ТЕГІН",
      egovText: "EGOV МЕМЛЕКЕТТІК ҚЫЗМЕТТЕР ЖӘНЕ ОНЛАЙН АҚПАРАТ"
    }
  };

  const t = content[lang] || content['ru'];

  return (
    <div className="flex flex-col min-h-[60vh]">
      {/* 1. HEADER (Темно-бирюзовый фон) */}
      <div className="bg-teal-700 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-xs font-bold text-yellow-400 uppercase tracking-widest mb-2">
            {t.breadcrumb}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold uppercase">
            {t.title}
          </h1>
        </div>
      </div>

      {/* 2. CONTENT (Белый фон) */}
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white max-w-5xl">
          
          <h2 className="text-2xl font-bold text-gray-900 mb-6 uppercase">
            {t.title}
          </h2>

          <p className="text-gray-700 mb-4">{t.subtitle}</p>

          {/* Телефоны */}
          <div className="text-blue-700 text-xl md:text-2xl font-medium mb-4 flex flex-col md:flex-row gap-2 md:gap-4">
             <a href="tel:1414" className="hover:underline">1414</a>
             <span className="hidden md:inline text-gray-400">|</span>
             <a href="tel:88000807777" className="hover:underline">8-800-080-7777</a>
          </div>

          <p className="text-gray-600 uppercase mb-8 text-sm tracking-wide">
             {t.freeCall}
          </p>

          {/* Ссылка на EGOV */}
          <a 
            href="https://egov.kz" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block text-blue-500 hover:text-blue-700 uppercase mb-12 hover:underline font-medium"
          >
             {t.egovText}
          </a>

          {/* 3. SOCIAL ICONS */}
          <div className="flex space-x-3">
             {/* Facebook */}
             <a href="https://www.instagram.com/emhana33_almaty/" className="w-10 h-10 bg-[#3b5998] text-white rounded flex items-center justify-center hover:opacity-90 transition">
                <Instagram size={20} />
             </a>
             
             {/* Whatsapp */}
             <a href="tel:+77273395903" className="w-10 h-10 bg-[#25d366] text-white rounded flex items-center justify-center hover:opacity-90 transition">
                <MessageCircle size={20} />
             </a>
             {/* Mail */}
             <a href="mailto:priemnaya_gp33@mail.ru" className="w-10 h-10 bg-[#dd4b39] text-white rounded flex items-center justify-center hover:opacity-90 transition">
                <Mail size={20} />
             </a>
          </div>

        </div>
      </div>
    </div>
  );
}