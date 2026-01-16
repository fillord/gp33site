import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { ShieldAlert, Phone, FileText, ExternalLink } from 'lucide-react';

export default function AboutAnticorruption() {
  const { lang } = useOutletContext();

  const content = {
    ru: {
      breadcrumb: "ГЛАВНАЯ СТРАНИЦА / ПРОТИВОДЕЙСТВИЕ КОРРУПЦИИ",
      title: "ПРОТИВОДЕЙСТВИЕ КОРРУПЦИИ",
      mainText: "В Городской поликлинике №33 проводится целенаправленная работа по противодействию коррупции и формированию антикоррупционной культуры. Мы придерживаемся принципа «Нулевой терпимости» к любым правонарушениям.",
      helplineTitle: "Телефон доверия / Служба комплаенс",
      helplineText: "Если вы столкнулись с фактами коррупции, вымогательства или неэтичного поведения со стороны сотрудников поликлиники, просим незамедлительно сообщить:",
      linksTitle: "Полезные ссылки и Нормативно-правовые акты",
      links: [
        { 
          title: "Закон Республики Казахстан «О противодействии коррупции»", 
          url: "https://adilet.zan.kz/rus/docs/Z1500000410" 
        },
        { 
          title: "Об утверждении Типового антикоррупционного стандарта поведения", 
          url: "https://adilet.zan.kz/rus/docs/V2000021890" 
        },
        { 
          title: "Концепция антикоррупционной политики РК на 2022–2026 годы", 
          url: "https://adilet.zan.kz/rus/docs/U2200000802" 
        }
      ]
    },
    kz: {
      breadcrumb: "БАСТЫ БЕТ / СЫБАЙЛАС ЖЕМҚОРЛЫҚҚА ҚАРСЫ ІС-ҚИМЫЛ",
      title: "СЫБАЙЛАС ЖЕМҚОРЛЫҚҚА ҚАРСЫ ІС-ҚИМЫЛ",
      mainText: "№33 Қалалық емханада сыбайлас жемқорлыққа қарсы іс-қимыл және сыбайлас жемқорлыққа қарсы мәдениетті қалыптастыру бойынша мақсатты жұмыстар жүргізілуде. Біз кез келген құқық бұзушылыққа «Мүлдем төзбеушілік» қағидатын ұстанамыз.",
      helplineTitle: "Сенім телефоны / Комплаенс қызметі",
      helplineText: "Егер сіз емхана қызметкерлері тарапынан сыбайлас жемқорлық, бопсалау немесе әдепсіз мінез-құлық фактілеріне тап болсаңыз, дереу хабарлауыңызды сұраймыз:",
      linksTitle: "Пайдалы сілтемелер және Нормативтік-құқықтық актілер",
      links: [
        { 
          title: "«Сыбайлас жемқорлыққа қарсы іс-қимыл туралы» ҚР Заңы", 
          url: "https://adilet.zan.kz/rus/docs/Z1500000410" 
        },
        { 
          title: "Сыбайлас жемқорлыққа қарсы мінез-құлықтың үлгілік стандартын бекіту туралы", 
          url: "https://adilet.zan.kz/rus/docs/V2000021890" 
        },
        { 
          title: "ҚР Сыбайлас жемқорлыққа қарсы саясатының 2022–2026 жылдарға арналған тұжырымдамасы", 
          url: "https://adilet.zan.kz/rus/docs/U2200000802" 
        }
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
        <div className="bg-white max-w-4xl">
          
          {/* Intro Text */}
          <div className="flex items-start gap-4 mb-8">
            <ShieldAlert className="text-red-500 flex-shrink-0 mt-1" size={40} />
            <p className="text-lg text-gray-700 leading-relaxed font-medium">
              {t.mainText}
            </p>
          </div>

          <hr className="border-gray-200 my-8" />

          {/* Helpline Block */}
          <div className="bg-red-50 border border-red-100 p-6 rounded-xl mb-10">
            <h3 className="text-xl font-bold text-red-800 mb-2 flex items-center">
              <Phone className="mr-2" size={24}/> {t.helplineTitle}
            </h3>
            <p className="text-gray-700 mb-4">{t.helplineText}</p>
            <div className="text-3xl font-bold text-red-600">
              +7 (***) ***-**-**
            </div>
          </div>

          {/* Useful Links Block */}
          <h3 className="text-2xl font-bold text-teal-800 mb-6 border-l-4 border-yellow-400 pl-3">
            {t.linksTitle}
          </h3>
          <div className="space-y-4">
            {t.links.map((link, idx) => (
              <a 
                key={idx} 
                href={link.url} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-teal-50 hover:border-teal-200 transition group"
              >
                <FileText className="text-gray-400 group-hover:text-teal-600 mr-3" size={24} />
                <span className="flex-grow font-semibold text-gray-700 group-hover:text-teal-800">
                  {link.title}
                </span>
                <ExternalLink className="text-gray-400 opacity-0 group-hover:opacity-100 transition" size={18} />
              </a>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}