import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { HeartHandshake, Phone, Mail, MapPin, AlertTriangle, CheckCircle, Send, Loader2 } from 'lucide-react';

export default function ServicesSupport() {
  const { lang } = useOutletContext();
  
  // === НАСТРОЙКИ TELEGRAM (ВСТАВЬТЕ СВОИ ДАННЫЕ) ===
  const TG_BOT_TOKEN = '8306642177:AAFXtM2zpIJ-Tolx3x4p-cAxLfPlgdwZIJw'; // Например: 7000000:AAFg...
  const TG_CHAT_ID = '1027958463'; // Например: 12345678

  // Состояния формы
  const [formData, setFormData] = useState({ name: '', phone: '', message: '' });
  const [status, setStatus] = useState(null); // 'loading', 'success', 'error'

  const t = {
    breadcrumb: lang === 'ru' ? "ГЛАВНАЯ / СЛУЖБА ПОДДЕРЖКИ ПАЦИЕНТОВ" : "БАСТЫ БЕТ / ПАЦИЕНТТЕРДІ ҚОЛДАУ ҚЫЗМЕТІ",
    title: lang === 'ru' ? "Служба поддержки пациентов и внутреннего аудита" : "Пациенттерді қолдау және ішкі аудит қызметі",
    slogan: lang === 'ru' ? "Мы готовы помочь вам «ЗДЕСЬ И СЕЙЧАС»" : "Біз сізге «ОСЫ ЖЕРДЕ ЖӘНЕ ҚАЗІР» көмектесуге дайынбыз",
    whenTitle: lang === 'ru' ? "В каких случаях обращаться?" : "Қандай жағдайларда хабарласу керек?",
    reasons: [
      { ru: "Если вы остались недовольны качеством оказания медицинской помощи", kz: "Егер сіз медициналық көмек сапасына көңіліңіз толмаса" },
      { ru: "Столкнулись с грубым отношением со стороны персонала", kz: "Персонал тарапынан дөрекі қарым-қатынасқа тап болсаңыз" },
      { ru: "Столкнулись с фактами вымогательства денежных средств", kz: "Ақша бопсалау фактілеріне тап болсаңыз" },
      { ru: "Если нарушены ваши права как пациента", kz: "Егер сіздің пациент ретіндегі құқықтарыңыз бұзылса" },
      { ru: "Есть предложения по улучшению работы поликлиники", kz: "Емхана жұмысын жақсарту бойынша ұсыныстарыңыз болса" }
    ],
    contactsTitle: lang === 'ru' ? "Наши контакты" : "Біздің байланыстар",
    office: lang === 'ru' ? "1 этаж, Кабинет Службы поддержки пациентов" : "1 қабат, Пациенттерді қолдау қызметінің кабинеті",
    hotline: lang === 'ru' ? "Телефон доверия:" : "Сенім телефоны:",
    formTitle: lang === 'ru' ? "Написать обращение онлайн" : "Онлайн өтініш жазу",
    formName: lang === 'ru' ? "Ваше имя" : "Сіздің атыңыз",
    formPhone: lang === 'ru' ? "Ваш телефон" : "Сіздің телефоныңыз",
    formMsg: lang === 'ru' ? "Суть обращения" : "Өтініштің мәні",
    formBtn: lang === 'ru' ? "Отправить обращение" : "Өтінішті жіберу",
    sending: lang === 'ru' ? "Отправка..." : "Жіберілуде...",
    success: lang === 'ru' ? "Ваше обращение принято! Мы свяжемся с вами." : "Сіздің өтінішіңіз қабылданды! Біз сізбен хабарласамыз.",
    error: lang === 'ru' ? "Ошибка отправки. Попробуйте позже." : "Жіберу қатесі. Кейінірек қайталаңыз."
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    const text = `
🚨 <b>СЛУЖБА ПОДДЕРЖКИ (Сайт)</b>

👤 <b>Имя:</b> ${formData.name}
📞 <b>Телефон:</b> ${formData.phone}
📝 <b>Сообщение:</b> 
${formData.message}
    `;

    try {
      const response = await fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TG_CHAT_ID,
          text: text,
          parse_mode: 'HTML'
        })
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', phone: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <div className="flex flex-col min-h-[60vh] bg-gray-50">
      
      {/* HEADER */}
      <div className="bg-teal-700 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-xs font-bold text-yellow-400 uppercase tracking-widest mb-2">
            {t.breadcrumb}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold uppercase mb-4">
            {t.title}
          </h1>
        </div>
      </div>

      {/* CONTENT */}
      <div className="container mx-auto px-4 py-12">
        
        {/* SLOGAN */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-12 text-center border-t-8 border-teal-500">
           <HeartHandshake size={64} className="mx-auto text-teal-500 mb-6" />
           <h2 className="text-2xl md:text-4xl font-bold text-gray-800 uppercase tracking-wide">
              {t.slogan}
           </h2>
           <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              {lang === 'ru' 
                ? "Наша цель — решение проблемных вопросов на месте, не доводя до жалоб в вышестоящие инстанции. Мы открыты к диалогу."
                : "Біздің мақсатымыз — мәселелерді жоғары тұрған органдарға шағымданбай, сол жерде шешу. Біз диалогқа ашықпыз."}
           </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
           
           {/* LEFT INFO */}
           <div className="space-y-8">
              <div className="bg-white rounded-xl shadow-sm p-8">
                 <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                    <AlertTriangle className="text-orange-500 mr-3" /> {t.whenTitle}
                 </h3>
                 <ul className="space-y-4">
                    {t.reasons.map((item, index) => (
                       <li key={index} className="flex items-start">
                          <CheckCircle size={20} className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                          <span className="text-gray-700 font-medium">{lang === 'ru' ? item.ru : item.kz}</span>
                       </li>
                    ))}
                 </ul>
              </div>

              <div className="bg-blue-50 rounded-xl p-8 border border-blue-100">
                 <h3 className="text-xl font-bold text-blue-900 mb-6">{t.contactsTitle}</h3>
                 <div className="space-y-6">
                    <div className="flex items-center">
                       <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-sm mr-4">
                          <Phone size={24} />
                       </div>
                       <div>
                          <div className="text-xs font-bold text-gray-400 uppercase">{t.hotline}</div>
                          <div className="text-2xl font-bold text-gray-800">+7 (727) 339-59-03</div>
                       </div>
                    </div>
                    <div className="flex items-center">
                       <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-sm mr-4">
                          <MapPin size={24} />
                       </div>
                       <div>
                          <div className="text-lg font-medium text-gray-800">{t.office}</div>
                       </div>
                    </div>
                    <div className="flex items-center">
                       <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-sm mr-4">
                          <Mail size={24} />
                       </div>
                       <div>
                          <div className="text-lg font-medium text-gray-800">support@gp33.kz</div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           {/* RIGHT FORM */}
           <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 h-fit">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                 <Mail className="text-teal-500 mr-3" /> {t.formTitle}
              </h3>

              {status === 'success' ? (
                <div className="text-center py-12 animate-fade-in">
                   <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle size={40} />
                   </div>
                   <h4 className="text-xl font-bold text-gray-800 mb-2">{lang === 'ru' ? "Спасибо!" : "Рахмет!"}</h4>
                   <p className="text-gray-600">{t.success}</p>
                   <button onClick={() => setStatus(null)} className="mt-6 text-teal-600 font-bold hover:underline">
                      {lang === 'ru' ? "Отправить еще одно" : "Тағы біреуін жіберу"}
                   </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                   <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">{t.formName}</label>
                      <input 
                        type="text" 
                        required
                        className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-teal-500" 
                        placeholder="Иванов Иван" 
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                      />
                   </div>
                   
                   <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">{t.formPhone}</label>
                      <input 
                        type="tel" 
                        required
                        className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-teal-500" 
                        placeholder="+7 (777) 000-00-00" 
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                      />
                   </div>

                   <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">{t.formMsg}</label>
                      <textarea 
                        required
                        className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-teal-500 h-32" 
                        placeholder="..." 
                        value={formData.message}
                        onChange={e => setFormData({...formData, message: e.target.value})}
                      ></textarea>
                   </div>
                   
                   {status === 'error' && (
                     <div className="text-red-500 text-sm bg-red-50 p-3 rounded">{t.error}</div>
                   )}

                   <button 
                     type="submit" 
                     disabled={status === 'loading'}
                     className="w-full bg-teal-600 text-white font-bold py-4 rounded-lg hover:bg-teal-700 transition flex items-center justify-center disabled:opacity-70"
                   >
                      {status === 'loading' ? (
                        <><Loader2 className="animate-spin mr-2"/> {t.sending}</>
                      ) : (
                        <><Send size={20} className="mr-2" /> {t.formBtn}</>
                      )}
                   </button>
                </form>
              )}
           </div>

        </div>
      </div>
    </div>
  );
}