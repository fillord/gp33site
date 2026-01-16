import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Flag, Award, Music, User, FileText } from 'lucide-react';

export default function StateSymbols() {
  const { lang } = useOutletContext();

  const t = {
    breadcrumb: lang === 'ru' ? "ГЛАВНАЯ / ГОСУДАРСТВЕННЫЕ СИМВОЛЫ" : "БАСТЫ БЕТ / МЕМЛЕКЕТТІК РӘМІЗДЕР",
    title: lang === 'ru' ? "Государственные символы Республики Казахстан" : "Қазақстан Республикасының Мемлекеттік рәміздері",
    subtitle: lang === 'ru' ? "Священные атрибуты независимости и суверенитета" : "Тәуелсіздік пен егемендіктің қасиетті атрибуттары",
    
    // Флаг
    flagTitle: lang === 'ru' ? "Государственный Флаг" : "Мемлекеттік Ту",
    flagAuthorLabel: lang === 'ru' ? "Автор флага:" : "Тудың авторы:",
    flagAuthor: lang === 'ru' ? "Шакен Ниязбеков" : "Шәкен Ниязбеков",
    flagDesc: lang === 'ru' 
      ? "Государственный Флаг Республики Казахстан представляет собой прямоугольное полотнище голубого цвета с изображением в центре солнца с лучами, под которым – парящий орел. У древка – национальный орнамент в виде вертикальной полосы. Изображение солнца, его лучей, орла и национального орнамента – цвета золота."
      : "Қазақстан Республикасының Мемлекеттік Туы – ортасында шұғылалы күн, оның астында қалықтап ұшқан қыран бейнеленген тік бұрышты көгілдір түсті мата. Сабының тұсында ұлттық өрнек нақышталған тік жолақ бар. Күн, оның шұғыласы, қыран және ұлттық өрнек бейнесі алтын түстес.",

    // Герб
    emblemTitle: lang === 'ru' ? "Государственный Герб" : "Мемлекеттік Елтаңба",
    emblemAuthorLabel: lang === 'ru' ? "Авторы герба:" : "Елтаңба авторлары:",
    emblemAuthor: lang === 'ru' ? "Жандарбек Малибеков, Шота Уалиханов" : "Жандарбек Мәлібеков, Шота Уәлиханов",
    emblemDesc: lang === 'ru'
      ? "Государственный Герб представляет собой изображение шанырака (верхняя сводчатая часть юрты) на голубом фоне, от которого во все стороны в виде солнечных лучей расходятся уыки (опоры). Справа и слева от шанырака расположены изображения мифических крылатых коней. В верхней части расположена объемная пятиконечная звезда, а в нижней части надпись «QAZAQSTAN»."
      : "Мемлекеттік Елтаңба – көгілдір түс аясындағы шаңырақ (киіз үйдің жоғарғы күмбез тәрізді бөлігі) бейнесі, одан барлық жаққа күн сәулесі түрінде уықтар (тіреулер) тарайды. Шаңырақтың оң жағы мен сол жағында аңызға айналған қанатты тұлпарлар бейнеленген. Жоғарғы бөлігінде көлемді бес бұрышты жұлдыз, ал төменгі бөлігінде «QAZAQSTAN» жазуы бар.",

    // Гимн
    anthemTitle: lang === 'ru' ? "Государственный Гимн" : "Мемлекеттік Әнұран",
    musicBy: lang === 'ru' ? "Музыка:" : "Әнін жазған:",
    lyricsBy: lang === 'ru' ? "Слова:" : "Сөзін жазған:",
    musicAuthor: lang === 'ru' ? "Шамши Калдаяков" : "Шәмші Қалдаяқов",
    lyricsAuthor: lang === 'ru' ? "Жумекен Нажимеденов, Нурсултан Назарбаев" : "Жұмекен Нәжімеденов, Нұрсұлтан Назарбаев",
    
    // Полный текст гимна
    anthemLyrics: [
      {
        type: "verse",
        lines: [
          "Алтын күн аспаны,",
          "Алтын дән даласы,",
          "Ерліктің дастаны –",
          "Еліңе қарашы!",
          "Ежелгі ер деген,",
          "Даңқымыз шықты ғой,",
          "Намысын бермеген,",
          "Қазағым мықты ғой!"
        ]
      },
      {
        type: "chorus",
        label: lang === 'ru' ? "Припев:" : "Қайырмасы:",
        lines: [
          "Менің елім, менің елім,",
          "Гүлің болып егілемін,",
          "Жырың болып төгілемін, елім!",
          "Туған жерім менің — Қазақстаным!"
        ]
      },
      {
        type: "verse",
        lines: [
          "Ұрпаққа жол ашқан,",
          "Кең байтақ жерім бар.",
          "Бірлігі жарасқан,",
          "Тәуелсіз елім бар.",
          "Қарсы алған уақытты,",
          "Мәңгілік досындай.",
          "Біздің ел бақытты,",
          "Біздің ел осындай!"
        ]
      },
      {
        type: "chorus",
        label: lang === 'ru' ? "Припев:" : "Қайырмасы:",
        lines: [
          "Менің елім, менің елім,",
          "Гүлің болып егілемін,",
          "Жырың болып төгілемін, елім!",
          "Туған жерім менің — Қазақстаным!"
        ]
      }
    ]
  };

  return (
    <div className="flex flex-col min-h-[60vh] bg-gray-50">
      
      {/* 1. HERO SECTION */}
      <div className="relative bg-gradient-to-br from-sky-500 to-blue-700 text-white py-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-400 opacity-20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full blur-2xl"></div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="text-xs font-bold text-yellow-300 uppercase tracking-widest mb-3">
            {t.breadcrumb}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-md">
            {t.title}
          </h1>
          <div className="w-32 h-1.5 bg-yellow-400 mx-auto rounded mb-6"></div>
          <p className="text-xl md:text-2xl opacity-90 font-light max-w-3xl mx-auto">
            {t.subtitle}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 space-y-20">
        
        {/* === 1. ФЛАГ (FLAG) === */}
        <div className="flex flex-col lg:flex-row items-center gap-12 group">
           <div className="lg:w-1/2 relative">
              <div className="absolute inset-0 bg-sky-200 rounded-3xl transform rotate-3 scale-95 opacity-50 transition group-hover:rotate-6"></div>
              <div className="relative bg-white p-4 rounded-3xl shadow-xl overflow-hidden border-4 border-sky-100">
                 {/* Ссылка на флаг */}
                 <img 
                   src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Flag_of_Kazakhstan.svg/800px-Flag_of_Kazakhstan.svg.png" 
                   alt="Flag of Kazakhstan" 
                   className="w-full h-auto object-cover rounded-xl transform transition hover:scale-105 duration-700"
                 />
              </div>
           </div>
           
           <div className="lg:w-1/2">
              <div className="flex items-center gap-3 mb-4">
                 <div className="p-3 bg-sky-100 text-sky-600 rounded-full">
                    <Flag size={28} />
                 </div>
                 <h2 className="text-3xl md:text-4xl font-bold text-gray-800 uppercase">{t.flagTitle}</h2>
              </div>
              
              <div className="prose text-gray-600 text-lg leading-relaxed mb-8 text-justify">
                 {t.flagDesc}
              </div>

              <div className="flex items-center bg-white p-4 rounded-xl shadow-sm border-l-4 border-yellow-400">
                 <User className="text-gray-400 mr-4" size={24} />
                 <div>
                    <span className="block text-xs text-gray-500 uppercase font-bold">{t.flagAuthorLabel}</span>
                    <span className="text-lg font-bold text-gray-800">{t.flagAuthor}</span>
                 </div>
              </div>
           </div>
        </div>

        {/* === 2. ГЕРБ (EMBLEM) === */}
        <div className="flex flex-col lg:flex-row-reverse items-center gap-12 group">
           <div className="lg:w-1/2 relative">
              <div className="absolute inset-0 bg-yellow-200 rounded-full transform -rotate-3 scale-95 opacity-50 transition group-hover:-rotate-6"></div>
              <div className="relative bg-white p-8 rounded-full shadow-xl overflow-hidden border-4 border-yellow-100 flex items-center justify-center aspect-square">
                 {/* Обновленная ссылка на Герб */}
                 <img 
                   src="https://upload.wikimedia.org/wikipedia/commons/e/ee/Emblem_of_Kazakhstan_latin.svg" 
                   alt="Emblem of Kazakhstan" 
                   className="w-full h-full object-contain transform transition hover:scale-105 duration-700"
                 />
              </div>
           </div>
           
           <div className="lg:w-1/2">
              <div className="flex items-center gap-3 mb-4">
                 <div className="p-3 bg-yellow-100 text-yellow-600 rounded-full">
                    <Award size={28} />
                 </div>
                 <h2 className="text-3xl md:text-4xl font-bold text-gray-800 uppercase">{t.emblemTitle}</h2>
              </div>
              
              <div className="prose text-gray-600 text-lg leading-relaxed mb-8 text-justify">
                 {t.emblemDesc}
              </div>

              <div className="flex items-center bg-white p-4 rounded-xl shadow-sm border-l-4 border-sky-500">
                 <User className="text-gray-400 mr-4" size={24} />
                 <div>
                    <span className="block text-xs text-gray-500 uppercase font-bold">{t.emblemAuthorLabel}</span>
                    <span className="text-lg font-bold text-gray-800">{t.emblemAuthor}</span>
                 </div>
              </div>
           </div>
        </div>

        {/* === 3. ГИМН (ANTHEM) === */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
           <div className="bg-teal-800 text-white p-8 md:p-12 text-center">
              <Music size={48} className="mx-auto mb-4 text-yellow-400 opacity-80" />
              <h2 className="text-3xl md:text-5xl font-bold uppercase mb-2">{t.anthemTitle}</h2>
              <div className="text-sm opacity-70 uppercase tracking-widest">Mening Qazaqstanym</div>
           </div>

           <div className="p-8 md:p-12 flex flex-col md:flex-row gap-12">
              
              {/* Информация об авторах (Слева) */}
              <div className="md:w-1/3 space-y-6">
                 <div className="flex items-start">
                    <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mr-4 flex-shrink-0">
                       <Music size={20} />
                    </div>
                    <div>
                       <h4 className="text-sm font-bold text-gray-400 uppercase">{t.musicBy}</h4>
                       <p className="text-xl font-bold text-gray-800">{t.musicAuthor}</p>
                    </div>
                 </div>
                 <div className="flex items-start">
                    <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mr-4 flex-shrink-0">
                       <FileText size={20} />
                    </div>
                    <div>
                       <h4 className="text-sm font-bold text-gray-400 uppercase">{t.lyricsBy}</h4>
                       <p className="text-xl font-bold text-gray-800">{t.lyricsAuthor}</p>
                    </div>
                 </div>
              </div>

              {/* ПОЛНЫЙ ТЕКСТ (Справа) */}
              <div className="md:w-2/3 space-y-8">
                 {t.anthemLyrics.map((part, index) => (
                    <div 
                       key={index} 
                       className={`
                         ${part.type === 'chorus' ? 'bg-yellow-50 p-6 rounded-2xl border-2 border-yellow-200 relative overflow-hidden' : ''}
                       `}
                    >
                       {part.label && (
                         <h4 className="font-bold text-yellow-700 uppercase mb-3 tracking-wider text-sm">{part.label}</h4>
                       )}
                       
                       <div className="space-y-1">
                          {part.lines.map((line, i) => (
                             <p key={i} className={`
                               ${part.type === 'chorus' 
                                 ? 'text-lg md:text-xl font-bold text-teal-900 italic' 
                                 : 'text-lg text-gray-700'
                               }
                             `}>
                                {line}
                             </p>
                          ))}
                       </div>
                    </div>
                 ))}
              </div>

           </div>
        </div>

      </div>
    </div>
  );
}