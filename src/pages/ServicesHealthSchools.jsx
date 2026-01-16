import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { BookOpen, Heart, Activity, Baby, Users, Calendar, Clock, MapPin, Smile } from 'lucide-react';

export default function ServicesHealthSchools() {
  const { lang } = useOutletContext();

  const t = {
    breadcrumb: lang === 'ru' ? "ГЛАВНАЯ / ШКОЛЫ ЗДОРОВЬЯ" : "БАСТЫ БЕТ / ДЕНСАУЛЫҚ МЕКТЕПТЕРІ",
    title: lang === 'ru' ? "График работы школ здоровья" : "Денсаулық мектептерінің жұмыс кестесі",
    subtitle: lang === 'ru' 
      ? "Бесплатные обучающие занятия для пациентов по управлению заболеваниями и профилактике" 
      : "Пациенттерге ауруларды басқару және алдын алу бойынша тегін оқыту сабақтары",
    
    // Заголовки карточек
    school: lang === 'ru' ? "Школа" : "Мектеп",
    topic: lang === 'ru' ? "Тема занятий:" : "Сабақ тақырыбы:",
    when: lang === 'ru' ? "Когда:" : "Қашан:",
    where: lang === 'ru' ? "Где:" : "Қайда:",
    free: lang === 'ru' ? "БЕСПЛАТНО" : "ТЕГІН"
  };

  // Список школ (Типовой набор для поликлиник РК)
  const schools = [
    {
      id: 1,
      icon: Activity,
      color: "bg-blue-500",
      title: { ru: "Школа диабета", kz: "Диабет мектебі" },
      desc: { 
        ru: "Питание, контроль сахара, инсулинотерапия и профилактика осложнений.", 
        kz: "Тамақтану, қантты бақылау, инсулин терапиясы және асқынулардың алдын алу." 
      },
      schedule: { ru: "Вторник, 14:00", kz: "Сейсенбі, 14:00" },
      cabinet: "205"
    },
    {
      id: 2,
      icon: Heart,
      color: "bg-red-500",
      title: { ru: "Школа артериальной гипертонии / БСК", kz: "Артериялық гипертония / ЖҚА мектебі" },
      desc: { 
        ru: "Как правильно измерять давление, диета при гипертонии, первая помощь при кризе.", 
        kz: "Қысымды қалай дұрыс өлшеу керек, гипертония кезіндегі диета, криз кезіндегі алғашқы көмек." 
      },
      schedule: { ru: "Среда, 11:00", kz: "Сәрсенбі, 11:00" },
      cabinet: "208"
    },
    {
      id: 3,
      icon: Baby,
      color: "bg-pink-500",
      title: { ru: "Школа подготовки к родам", kz: "Босануға дайындық мектебі" },
      desc: { 
        ru: "Дыхательные техники, уход за новорожденным, грудное вскармливание.", 
        kz: "Тыныс алу техникалары, жаңа туған нәрестеге күтім жасау, емшек сүтімен емізу." 
      },
      schedule: { ru: "Четверг, 15:00", kz: "Бейсенбі, 15:00" },
      cabinet: "105 (Женская консультация)"
    },
    {
      id: 4,
      icon: Users,
      color: "bg-green-500",
      title: { ru: "Школа активного долголетия", kz: "Белсенді ұзақ өмір сүру мектебі" },
      desc: { 
        ru: "Гимнастика для пожилых, профилактика деменции, общение и досуг.", 
        kz: "Егде жастағы адамдарға арналған гимнастика, деменцияның алдын алу, қарым-қатынас." 
      },
      schedule: { ru: "Пятница, 10:00", kz: "Жұма, 10:00" },
      cabinet: "Актовый зал / Мәжіліс залы"
    },
    {
      id: 5,
      icon: Smile,
      color: "bg-yellow-500",
      title: { ru: "Школа поведенческих факторов риска", kz: "Мінез-құлық қауіп факторлары мектебі" },
      desc: { 
        ru: "Отказ от курения, борьба со стрессом, основы здорового питания.", 
        kz: "Темекі шегуден бас тарту, күйзеліспен күресу, дұрыс тамақтану негіздері." 
      },
      schedule: { ru: "Понедельник, 12:00", kz: "Дүйсенбі, 12:00" },
      cabinet: "210 (Психолог)"
    }
  ];

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
          <p className="text-lg opacity-90 max-w-2xl">{t.subtitle}</p>
        </div>
      </div>

      {/* 2. CONTENT */}
      <div className="container mx-auto px-4 py-12">
        
        {/* Инфо-блок */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-10 border-l-4 border-blue-500 flex items-start">
           <BookOpen className="text-blue-500 mr-4 flex-shrink-0" size={32} />
           <div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                 {lang === 'ru' ? "Зачем посещать школы здоровья?" : "Денсаулық мектептеріне неге бару керек?"}
              </h3>
              <p className="text-gray-600">
                 {lang === 'ru' 
                   ? "Это отличная возможность получить достоверную информацию от врачей, задать вопросы и научиться контролировать свое состояние. Занятия проходят в группах, вход свободный."
                   : "Бұл дәрігерлерден нақты ақпарат алудың, сұрақтар қоюдың және өз жағдайыңызды бақылауды үйренудің тамаша мүмкіндігі. Сабақтар топтарда өтеді, кіру тегін."}
              </p>
           </div>
        </div>

        {/* Сетка школ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {schools.map((school) => (
              <div key={school.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden border border-gray-100 flex flex-col group">
                 
                 {/* Цветная шапка карточки */}
                 <div className={`${school.color} p-4 flex items-center justify-between text-white`}>
                    <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                       <school.icon size={24} />
                    </div>
                    <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded uppercase tracking-wider">
                       {t.free}
                    </span>
                 </div>

                 <div className="p-6 flex-grow flex flex-col">
                    <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-teal-700 transition-colors">
                       {school.title[lang]}
                    </h3>
                    
                    <div className="mb-4 text-sm text-gray-600 flex-grow">
                       <span className="font-bold text-gray-400 block text-xs uppercase mb-1">{t.topic}</span>
                       {school.desc[lang]}
                    </div>

                    <div className="border-t border-gray-100 pt-4 space-y-2 mt-auto">
                       <div className="flex items-center text-sm">
                          <Calendar size={16} className="text-teal-500 mr-2" />
                          <span className="font-medium text-gray-800">{school.schedule[lang]}</span>
                       </div>
                       <div className="flex items-center text-sm">
                          <MapPin size={16} className="text-teal-500 mr-2" />
                          <span className="text-gray-600">{t.where} {t.cabinet} <span className="font-bold text-gray-800">{school.cabinet}</span></span>
                       </div>
                    </div>
                 </div>

              </div>
           ))}
        </div>

      </div>
    </div>
  );
}