import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Search, FileText, ChevronDown, ChevronUp, Tag, Stethoscope, Activity, Eye, Baby } from 'lucide-react';

export default function ServicesPrices() {
  const { lang } = useOutletContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [openCategory, setOpenCategory] = useState(null);

  const t = {
    breadcrumb: lang === 'ru' ? "ГЛАВНАЯ / ПЛАТНЫЕ УСЛУГИ" : "БАСТЫ БЕТ / АҚЫЛЫ ҚЫЗМЕТТЕР",
    title: lang === 'ru' ? "Прейскурант цен на 2025 год" : "2025 жылға арналған баға тізбесі",
    subtitle: lang === 'ru' 
      ? "Утвержден директором КГП на ПХВ «Городская поликлиника №33»" 
      : "«№33 Қалалық емхана» ШЖҚ КМК директорымен бекітілген",
    searchPlaceholder: lang === 'ru' ? "Поиск услуги (например: УЗИ, массаж)..." : "Қызметті іздеу (мысалы: УЗИ, массаж)...",
    priceHeader: lang === 'ru' ? "Цена (тенге)" : "Бағасы (теңге)",
    code: lang === 'ru' ? "Код" : "Код",
    notFound: lang === 'ru' ? "Услуги не найдены" : "Қызметтер табылмады"
  };

  // Данные из вашего PDF файла [cite: 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]
  const categories = [
    {
      id: 'consult',
      icon: Stethoscope,
      title: { ru: "Консультация врачей", kz: "Дәрігерлердің кеңесі" },
      items: [
        { code: "1", name: "Прием врача гастроэнтеролога (Профессор)", price: "15 000 / 12 000" },
        { code: "4", name: "Консультация педиатра", price: "4 950 / 3 550" },
        { code: "5", name: "Консультация офтальмолога", price: "4 950 / 3 550" },
        { code: "9", name: "Консультация кардиолога", price: "4 950 / 3 550" },
        { code: "12", name: "Консультация дерматовенеролога", price: "4 950 / 3 550" },
        { code: "13", name: "Консультация хирурга", price: "4 950 / 3 550" },
        { code: "16", name: "Консультация терапевта", price: "7 550 / 6 000" },
        { code: "17", name: "Консультация гинеколога", price: "4 950 / 3 550" },
        { code: "21", name: "Консультация эндокринолога", price: "4 950 / 3 550" }
      ]
    },
    {
      id: 'checkup',
      icon: Activity,
      title: { ru: "Check Up программы", kz: "Check Up бағдарламалары" },
      items: [
        { code: "26", name: "Базовый Check Up печени (Фиброскан, УЗИ ОБП)", price: "20 000" },
        { code: "27", name: "Базовый Check Up гастроэнтеролога", price: "35 000" },
        { code: "28", name: "Prestige Check-up гастроэнтеролога", price: "50 000" }
      ]
    },
    {
      id: 'massage',
      icon: Baby,
      title: { ru: "Массаж и Физиотерапия", kz: "Массаж және Физиотерапия" },
      items: [
        { code: "29", name: "Лазерная терапия (1 процедура)", price: "2 150" },
        { code: "35", name: "Электрофорез", price: "2 050" },
        { code: "36", name: "Общий массаж (детям до года)", price: "3 120" },
        { code: "39", name: "Массаж шейно-воротниковой зоны (взрослый)", price: "2 150" },
        { code: "45", name: "Массаж спины (взрослый)", price: "2 150" },
        { code: "47", name: "Массаж спины (детский)", price: "1 370" }
      ]
    },
    {
      id: 'instrumental',
      icon: Eye,
      title: { ru: "УЗИ и Рентген", kz: "УДЗ және Рентген" },
      items: [
        { code: "180", name: "Рентгенография грудной клетки (обзорная)", price: "2 430" },
        { code: "206", name: "Флюорография (1 проекция)", price: "1 350" },
        { code: "210", name: "Маммография (2 проекции)", price: "5 450" },
        { code: "213", name: "УЗИ одного органа", price: "5 950" },
        { code: "217", name: "Комплексное УЗИ (печень, желчный, поджелудочная, селезенка)", price: "6 890" },
        { code: "218", name: "УЗИ почек и надпочечников", price: "5 950" },
        { code: "231", name: "Эхокардиография (УЗИ сердца)", price: "5 970" }
      ]
    },
    {
      id: 'lab',
      icon: Tag,
      title: { ru: "Лабораторные исследования", kz: "Зертханалық зерттеулер" },
      items: [
        { code: "119", name: "Общий анализ крови (ОАК)", price: "1 850" },
        { code: "120", name: "Общий анализ мочи (ОАМ)", price: "950" },
        { code: "121", name: "АЛТ (Аланинаминотрансфераза)", price: "1 150" },
        { code: "128", name: "Билирубин общий", price: "1 200" },
        { code: "130", name: "Триглицериды", price: "1 300" },
        { code: "132", name: "Холестерин общий", price: "1 200" }
      ]
    },
    {
      id: 'other',
      icon: FileText,
      title: { ru: "Справки и прочие услуги", kz: "Анықтамалар және басқа қызметтер" },
      items: [
        { code: "244", name: "Дневной стационар (1 койко-день)", price: "5 000" },
        { code: "245", name: "Медосмотр 086-у (на учебу)", price: "3 000" },
        { code: "246", name: "Медосмотр 075-у (на работу)", price: "3 000" },
        { code: "248", name: "Шоферская комиссия (073-у)", price: "2 000" },
        { code: "249", name: "Справка в бассейн", price: "3 000" },
        { code: "250", name: "Санитарная книжка", price: "2 500" }
      ]
    }
  ];

  // Логика поиска
  const filterCategories = () => {
    if (!searchTerm) return categories;

    return categories.map(cat => ({
      ...cat,
      items: cat.items.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.code.includes(searchTerm)
      )
    })).filter(cat => cat.items.length > 0);
  };

  const filteredData = filterCategories();

  const toggleCategory = (id) => {
    setOpenCategory(openCategory === id ? null : id);
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
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        
        {/* Поиск */}
        <div className="relative mb-8 shadow-md rounded-xl">
           <input 
             type="text" 
             placeholder={t.searchPlaceholder} 
             className="w-full pl-12 pr-4 py-4 rounded-xl border-none outline-none text-lg focus:ring-2 focus:ring-teal-500"
             value={searchTerm}
             onChange={e => {
               setSearchTerm(e.target.value);
               if (e.target.value) setOpenCategory('all'); // Раскрыть всё при поиске
             }}
           />
           <Search className="absolute left-4 top-4.5 text-gray-400" size={24}/>
        </div>

        {/* Список категорий */}
        <div className="space-y-4">
           {filteredData.length > 0 ? (
             filteredData.map(cat => (
                <div key={cat.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                   
                   {/* Заголовок категории */}
                   <button 
                     onClick={() => toggleCategory(cat.id)}
                     className={`w-full flex items-center justify-between p-6 transition-colors ${
                        (openCategory === cat.id || searchTerm) ? 'bg-teal-50 text-teal-800' : 'bg-white hover:bg-gray-50'
                     }`}
                   >
                      <div className="flex items-center gap-4">
                         <div className={`p-2 rounded-lg ${(openCategory === cat.id || searchTerm) ? 'bg-teal-200' : 'bg-gray-100'}`}>
                            <cat.icon size={24} />
                         </div>
                         <span className="text-xl font-bold">{cat.title[lang]}</span>
                      </div>
                      {(openCategory === cat.id || searchTerm) ? <ChevronUp /> : <ChevronDown />}
                   </button>

                   {/* Таблица услуг */}
                   {((openCategory === cat.id) || searchTerm) && (
                      <div className="border-t border-gray-100 animate-fade-in">
                         <div className="overflow-x-auto">
                            <table className="w-full text-left">
                               <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                                  <tr>
                                     <th className="p-4 w-20">{t.code}</th>
                                     <th className="p-4">{lang === 'ru' ? "Наименование услуги" : "Қызмет атауы"}</th>
                                     <th className="p-4 text-right">{t.priceHeader}</th>
                                  </tr>
                               </thead>
                               <tbody className="divide-y divide-gray-50">
                                  {cat.items.map((item, idx) => (
                                     <tr key={idx} className="hover:bg-teal-50/30 transition">
                                        <td className="p-4 text-gray-400 font-mono text-sm">{item.code}</td>
                                        <td className="p-4 font-medium text-gray-800">{item.name}</td>
                                        <td className="p-4 text-right font-bold text-teal-700 whitespace-nowrap">
                                           {item.price} ₸
                                        </td>
                                     </tr>
                                  ))}
                               </tbody>
                            </table>
                         </div>
                      </div>
                   )}
                </div>
             ))
           ) : (
              <div className="text-center py-12 text-gray-500">
                 {t.notFound}
              </div>
           )}
        </div>

        {/* Ссылка на скачивание полного PDF (Опционально) */}
        <div className="mt-12 text-center">
           <a 
             href="/price_2025.pdf" // Загрузите файл в папку public
             target="_blank"
             className="inline-flex items-center text-teal-600 hover:text-teal-800 font-bold hover:underline"
           >
             <FileText size={20} className="mr-2"/>
             {lang === 'ru' ? "Скачать полный прейскурант (PDF)" : "Толық прейскурантты жүктеу (PDF)"}
           </a>
        </div>

      </div>
    </div>
  );
}