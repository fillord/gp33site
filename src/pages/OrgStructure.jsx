import React from 'react';
import { useOutletContext } from 'react-router-dom';

export default function OrgStructure() {
  const { lang } = useOutletContext();

  const t = {
    breadcrumb: lang === 'ru' ? "ГЛАВНАЯ / СТРУКТУРА" : "БАСТЫ БЕТ / ҚҰРЫЛЫМ",
    title: lang === 'ru' ? "Организационная структура" : "Ұйымдастырушылық құрылым",
    subtitle: lang === 'ru' ? "ГКП на ПХВ «Городская поликлиника №33»" : "«№33 Қалалық емхана» ШЖҚ КМК"
  };

  // Компонент одной ячейки (Box)
  const Box = ({ children, className = "" }) => (
    <div className={`border border-gray-600 bg-white p-2 text-center text-xs md:text-sm font-medium shadow-sm flex items-center justify-center ${className}`}>
      {children}
    </div>
  );

  // Вертикальная линия
  const VLine = ({ height = "h-8" }) => (
    <div className={`w-px bg-gray-600 mx-auto ${height}`}></div>
  );

  // Горизонтальная линия
  const HLine = ({ width = "w-full" }) => (
    <div className={`h-px bg-gray-600 mx-auto ${width}`}></div>
  );

  return (
    <div className="flex flex-col min-h-[60vh] bg-gray-50">
      {/* ЗАГОЛОВОК */}
      <div className="bg-teal-700 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="text-xs font-bold text-yellow-400 uppercase tracking-widest mb-1">
            {t.breadcrumb}
          </div>
          <h1 className="text-3xl font-bold uppercase mb-2">
            {t.title}
          </h1>
          <p className="opacity-80 text-sm">{t.subtitle}</p>
        </div>
      </div>

      {/* ОБЛАСТЬ СХЕМЫ (Скролл, если не помещается) */}
      <div className="flex-grow overflow-x-auto p-8">
        {/* Контейнер фиксированной ширины, чтобы структура не ломалась */}
        <div className="min-w-[1100px] mx-auto flex flex-col items-center">
          
          {/* === 1 УРОВЕНЬ: Наблюдательный совет === */}
          <div className="flex items-center gap-8 mb-4 relative">
             <Box className="w-40 h-16">{lang === 'ru' ? "Комплаенс-офицер" : "Комплаенс-офицер"}</Box>
             
             {/* Линия связи между ними */}
             <div className="w-8 h-px bg-gray-600"></div> 

             <div className="flex flex-col items-center">
                <Box className="w-48 h-16 border-2 border-gray-800">{lang === 'ru' ? "Наблюдательный совет" : "Бақылау кеңесі"}</Box>
                <VLine h="h-8" />
             </div>

             <div className="w-8 h-px bg-gray-600"></div> 

             <Box className="w-40 h-16">{lang === 'ru' ? "Секретарь наблюдательного совета" : "Бақылау кеңесінің хатшысы"}</Box>
          </div>

          {/* === 2 УРОВЕНЬ: Директор === */}
          <div className="flex flex-col items-center mb-8">
             <Box className="w-64 h-12 border-2 border-gray-800 font-bold">{lang === 'ru' ? "Директор" : "Директор"}</Box>
             <VLine h="h-8" />
             {/* Главная горизонтальная линия разделения */}
             <div className="w-[800px] h-px bg-gray-600 relative">
                {/* Вертикальная линия влево (Бухгалтер) */}
                <div className="absolute left-0 top-0 w-px h-8 bg-gray-600"></div>
                {/* Вертикальная линия вправо (Зам. дир) */}
                <div className="absolute right-0 top-0 w-px h-8 bg-gray-600"></div>
             </div>
          </div>

          {/* === 3 УРОВЕНЬ: Две большие ветки === */}
          <div className="flex w-[1200px] justify-between items-start">
            
            {/* === ЛЕВАЯ КОЛОННА (Бухгалтерия и АХЧ) === */}
            <div className="flex flex-col items-center w-[350px]">
                {/* Главный бухгалтер */}
                <Box className="w-48 h-12 mt-8 mb-4">{lang === 'ru' ? "Главный бухгалтер" : "Бас есепші"}</Box>
                <VLine h="h-8" />

                {/* Блок Бухгалтерия + Экономист */}
                <div className="flex items-center gap-4 mb-4 relative">
                   <Box className="w-32 h-16">{lang === 'ru' ? "Бухгалтерия" : "Бухгалтерия"}</Box>
                   <div className="w-4 h-px bg-gray-600"></div>
                   <Box className="w-40 h-16 text-[10px]">{lang === 'ru' ? "Экономист, Специалист по госзакупкам" : "Экономист, Мем. сатып алу маманы"}</Box>
                </div>
                
                {/* Линия вниз от Бухгалтерии */}
                <div className="w-px h-8 bg-gray-600 -ml-44"></div>

                {/* Блок Кадры */}
                <div className="flex items-center gap-4 mb-4 relative">
                   <Box className="w-32 h-12">{lang === 'ru' ? "Начальник ОК" : "Кадр бөлімінің басшысы"}</Box>
                   <div className="w-4 h-px bg-gray-600"></div>
                   <Box className="w-40 h-12 text-[10px]">{lang === 'ru' ? "Специалист по кадрам" : "Кадр маманы"}</Box>
                </div>

                {/* Линия вниз от Кадров */}
                <div className="w-px h-8 bg-gray-600 -ml-44"></div>

                {/* Блок АХЧ */}
                <div className="flex items-center gap-4 mb-4 relative">
                   <Box className="w-32 h-20">{lang === 'ru' ? "Руководитель АХЧ" : "ШЖБ басшысы"}</Box>
                   <div className="w-4 h-px bg-gray-600"></div>
                   <Box className="w-40 h-20 text-[10px]">{lang === 'ru' ? "Юрист, Офис-менеджер, Инженер по ТБ и ЧС" : "Заңгер, Кеңсе менеджері, ТЖ және ҚТ инженері"}</Box>
                </div>

                 {/* Линия вниз от АХЧ */}
                 <div className="w-px h-8 bg-gray-600 -ml-44"></div>

                 {/* IT */}
                 <Box className="w-32 h-12 -ml-44">{lang === 'ru' ? "Специалист IT" : "IT маманы"}</Box>

            </div>

            {/* === ПРАВАЯ КОЛОННА (Медицинская часть) === */}
            <div className="flex flex-col items-center w-[500px]">
                {/* Зам. директора */}
                <Box className="w-56 h-16 mt-8 mb-4">{lang === 'ru' ? "Заместитель директора по лечебной части" : "Директордың емдеу ісі жөніндегі орынбасары"}</Box>
                <VLine h="h-8" />
                
                {/* Разветвление на 3 столбца под Замом */}
                <div className="w-[450px] h-px bg-gray-600 relative mb-8">
                    <div className="absolute left-0 top-0 w-px h-8 bg-gray-600"></div>
                    <div className="absolute left-1/2 top-0 w-px h-8 bg-gray-600"></div>
                    <div className="absolute right-0 top-0 w-px h-8 bg-gray-600"></div>
                </div>

                <div className="flex justify-between w-full gap-2">
                    
                    {/* Столбец 1: Медсестра */}
                    <div className="flex flex-col gap-6 items-center w-1/3">
                        <Box className="w-full h-16">{lang === 'ru' ? "Главная медсестра" : "Бас мейірбике"}</Box>
                        <VLine h="h-4" />
                        <Box className="w-full h-12">{lang === 'ru' ? "Регистратура" : "Тіркеу бөлімі"}</Box>
                        <VLine h="h-4" />
                        <Box className="w-full h-12">{lang === 'ru' ? "Младший персонал" : "Кіші қызметкерлер"}</Box>
                    </div>

                    {/* Столбец 2: Центры */}
                    <div className="flex flex-col gap-4 items-center w-1/3">
                        <Box className="w-full h-16">{lang === 'ru' ? "Центр семейного здоровья" : "Отбасылық денсаулық орталығы"}</Box>
                        <Box className="w-full h-16">{lang === 'ru' ? "Женская консультация" : "Әйелдер кеңесі"}</Box>
                        <Box className="w-full h-16">{lang === 'ru' ? "Дневной стационар" : "Күндізгі стационар"}</Box>
                    </div>

                    {/* Столбец 3: Аптека и др */}
                    <div className="flex flex-col gap-4 items-center w-1/3">
                        <Box className="w-full h-12">{lang === 'ru' ? "Аптечный пункт" : "Дәріхана пункті"}</Box>
                        <Box className="w-full h-16 text-[10px]">{lang === 'ru' ? "Служба поддержки пациентов" : "Пациенттерді қолдау қызметі"}</Box>
                        <Box className="w-full h-20 text-[10px]">{lang === 'ru' ? "Отделение профилактики и соц-псих. помощи" : "Профилактика және әлеум.-псих. көмек бөлімшесі"}</Box>
                        <Box className="w-full h-12">{lang === 'ru' ? "Статистическая служба" : "Статистикалық қызмет"}</Box>
                    </div>

                </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}