import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';

export default function PriceList() {
  const { lang } = useOutletContext();
  const [search, setSearch] = useState('');

  const t = {
    title: lang === 'ru' ? "Прейскурант цен на платные услуги" : "Ақылы қызметтердің бағалар прейскуранты",
    placeholder: lang === 'ru' ? "Поиск услуги..." : "Қызметті іздеу...",
    headers: lang === 'ru' ? ["Код", "Наименование услуги", "Цена"] : ["Код", "Қызмет атауы", "Бағасы"]
  };

  const prices = [
    { code: "B01", name: {ru: "Прием терапевта (первичный)", kz: "Терапевт қабылдауы (алғашқы)"}, price: "5 000 ₸" },
    { code: "B02", name: {ru: "Прием узкого специалиста", kz: "Бейінді маманның қабылдауы"}, price: "7 000 ₸" },
    { code: "L01", name: {ru: "Общий анализ крови", kz: "Қанның жалпы талдауы"}, price: "1 500 ₸" },
    { code: "U01", name: {ru: "УЗИ брюшной полости", kz: "Құрсақ қуысының УДЗ"}, price: "6 000 ₸" },
    { code: "D05", name: {ru: "Справка 075/у", kz: "075/у анықтамасы"}, price: "3 500 ₸" },
  ];

  const filtered = prices.filter(p => p.name[lang].toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-teal-800 mb-6">{t.title}</h2>
      <input 
        type="text" 
        placeholder={t.placeholder}
        className="w-full md:w-1/3 p-3 mb-6 border rounded shadow-sm focus:ring-teal-500"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full text-left">
          <thead className="bg-teal-50 text-teal-900">
            <tr>
              <th className="p-4">{t.headers[0]}</th>
              <th className="p-4">{t.headers[1]}</th>
              <th className="p-4 text-right">{t.headers[2]}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item, idx) => (
              <tr key={idx} className="border-t hover:bg-gray-50">
                <td className="p-4 text-gray-500 font-mono text-sm">{item.code}</td>
                <td className="p-4 font-medium">{item.name[lang]}</td>
                <td className="p-4 text-right font-bold text-teal-700">{item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}