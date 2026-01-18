import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { User, MessageSquare, PenTool, X, CheckCircle, Loader } from 'lucide-react';

// === АДРЕС ВАШЕГО БЭКЕНДА ===
// Если запускаете локально: 'http://localhost:8000'
// Если на сервере: 'https://api.yolacloud.ru' (потребуется настройка Nginx)
const API_URL = ''; 

export default function GuestReviews() {
  const { lang } = useOutletContext();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // null, 'loading', 'success', 'error'
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Данные формы
  const [formData, setFormData] = useState({ name: '', text: '' });

  const t = {
    title: lang === 'ru' ? 'Отзывы пациентов' : 'Пациенттердің пікірлері',
    btnWrite: lang === 'ru' ? 'Оставить отзыв' : 'Пікір қалдыру',
    formTitle: lang === 'ru' ? 'Ваш отзыв' : 'Сіздің пікіріңіз',
    labelName: lang === 'ru' ? 'Ваше имя' : 'Сіздің атыңыз',
    labelReview: lang === 'ru' ? 'Текст отзыва' : 'Пікір мәтіні',
    btnSubmit: lang === 'ru' ? 'Отправить на модерацию' : 'Модерацияға жіберу',
    successMsg: lang === 'ru' 
      ? 'Спасибо! Ваш отзыв отправлен на проверку администратору.' 
      : 'Рақмет! Сіздің пікіріңіз әкімші тексеруіне жіберілді.',
    empty: lang === 'ru' ? 'Пока нет отзывов.' : 'Әзірге пікірлер жоқ.'
  };

  // 1. Загрузка отзывов при открытии страницы
  useEffect(() => {
    fetch(`${API_URL}/api/reviews`)
      .then(res => res.json())
      .then(data => {
        setReviews(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Ошибка загрузки:", err);
        setIsLoading(false);
      });
  }, []);

  // 2. Отправка отзыва
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus('loading');
    
    const today = new Date().toLocaleDateString('ru-RU');
    
    try {
      const response = await fetch(`${API_URL}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          text: formData.text,
          date: today
        })
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', text: '' });
        setTimeout(() => {
          setIsFormOpen(false);
          setSubmitStatus(null);
        }, 4000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error(error);
      setSubmitStatus('error');
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 relative">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-3xl font-bold text-teal-800">{t.title}</h2>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="bg-yellow-400 hover:bg-yellow-500 text-teal-900 font-bold py-2 px-6 rounded-full flex items-center shadow-lg transition transform hover:scale-105"
        >
          <PenTool size={18} className="mr-2"/> {t.btnWrite}
        </button>
      </div>
      
      {/* СПИСОК ОТЗЫВОВ */}
      {isLoading ? (
        <div className="flex justify-center py-10"><Loader className="animate-spin text-teal-600" size={40}/></div>
      ) : reviews.length === 0 ? (
        <div className="text-center text-gray-500 py-10">{t.empty}</div>
      ) : (
        <div className="grid gap-6">
          {reviews.map(rev => (
            <div key={rev.id} className="bg-white p-6 rounded-lg shadow border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center space-x-3">
                    <div className="bg-teal-100 p-2 rounded-full text-teal-600"><User size={20}/></div>
                    <span className="font-bold text-gray-800">{rev.name}</span>
                 </div>
                 <span className="text-sm text-gray-400">{rev.date}</span>
              </div>
              <div className="flex items-start space-x-3 text-gray-600">
                 <MessageSquare size={18} className="mt-1 flex-shrink-0 text-gray-400"/>
                 {/* Если есть перевод на казахский и выбран казахский язык, показываем его, иначе русский */}
                 <p>
                   {(lang === 'kz' && rev.textKz) ? rev.textKz : rev.text}
                 </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ФОРМА */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up">
            <div className="bg-teal-700 text-white p-4 flex justify-between items-center">
              <h3 className="font-bold text-lg flex items-center"><PenTool size={18} className="mr-2"/> {t.formTitle}</h3>
              <button onClick={() => setIsFormOpen(false)}><X size={24}/></button>
            </div>
            <div className="p-6">
              {submitStatus === 'success' ? (
                <div className="text-center py-8">
                  <CheckCircle size={48} className="text-green-500 mx-auto mb-4"/>
                  <p className="text-gray-600 mb-6">{t.successMsg}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">{t.labelName}</label>
                    <input 
                      type="text" required 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full border p-2 rounded focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">{t.labelReview}</label>
                    <textarea 
                      required rows="4"
                      value={formData.text}
                      onChange={e => setFormData({...formData, text: e.target.value})}
                      className="w-full border p-2 rounded focus:ring-2 focus:ring-teal-500 outline-none"
                    ></textarea>
                  </div>
                  <button 
                    type="submit" 
                    disabled={submitStatus === 'loading'}
                    className="w-full bg-teal-600 text-white font-bold py-3 rounded hover:bg-teal-700 transition"
                  >
                    {submitStatus === 'loading' ? '...' : t.btnSubmit}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}