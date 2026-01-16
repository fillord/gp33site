import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Facebook, Mail, MessageCircle, ExternalLink, FileText } from 'lucide-react';

export default function ServicesActs() {
  const { lang } = useOutletContext();

  const content = {
    ru: {
      breadcrumb: "ГЛАВНАЯ СТРАНИЦА / НОРМАТИВНО-ПРАВОВЫЕ АКТЫ",
      title: "НОРМАТИВНО-ПРАВОВЫЕ АКТЫ",
      headline: "НОРМАТИВНО-ПРАВОВАЯ БАЗА",
      text: "Нормативно-правовые акты (НПА) в здравоохранении Республики Казахстан регулируют деятельность медицинских организаций, профессиональную деятельность медицинских работников, права и обязанности пациентов, а также финансирование, лицензирование и контроль в сфере здравоохранения. Ниже приведён обзор ключевых НПА, действующих в этой области:",
      linkText: "Перейти к списку НПА на сайте adilet.zan.kz",
      url: "https://adilet.zan.kz/rus/search/docs/ir=1_024"
    },
    kz: {
      breadcrumb: "БАСТЫ БЕТ / НОРМАТИВТІК-ҚҰҚЫҚТЫҚ АКТІЛЕР",
      title: "НОРМАТИВТІК-ҚҰҚЫҚТЫҚ АКТІЛЕР",
      headline: "НОРМАТИВТІК-ҚҰҚЫҚТЫҚ БАЗА",
      text: "Қазақстан Республикасының денсаулық сақтау саласындағы нормативтік-құқықтық актілері (НҚА) медициналық ұйымдардың қызметін, медицина қызметкерлерінің кәсіби қызметін, пациенттердің құқықтары мен міндеттерін, сондай-ақ денсаулық сақтау саласындағы қаржыландыруды, лицензиялауды және бақылауды реттейді. Төменде осы салада қолданылатын негізгі НҚА-ға шолу келтірілген:",
      linkText: "adilet.zan.kz сайтындағы НҚА тізіміне өту",
      url: "https://adilet.zan.kz/kaz/search/docs/ir=1_024" // Казахская версия ссылки
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
          <h1 className="text-4xl md:text-5xl font-bold uppercase">
            {t.title}
          </h1>
        </div>
      </div>

      {/* 2. CONTENT (Белый фон) */}
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white max-w-5xl">
          
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 uppercase">
            {t.headline}
          </h2>

          <div className="text-gray-700 leading-relaxed text-lg mb-8">
             <p>{t.text}</p>
          </div>

          {/* Ссылка на закон */}
          <a 
            href={t.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 p-4 bg-blue-50 border border-blue-100 rounded-lg text-blue-700 hover:bg-blue-100 transition group mb-12"
          >
             <FileText size={24}/>
             <span className="font-semibold underline">{t.url}</span>
             <ExternalLink size={18} className="opacity-50 group-hover:opacity-100"/>
          </a>

          {/* 3. SOCIAL ICONS */}
          <div className="flex space-x-3">
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