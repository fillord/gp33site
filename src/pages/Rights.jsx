import React from 'react';
export default function Rights() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-teal-800 mb-6">Права и обязанности пациентов</h2>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4 text-blue-800">Пациент имеет право на:</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Достойное обращение и уважение.</li>
            <li>Получение полной информации о состоянии здоровья.</li>
            <li>Выбор врача и медицинской организации.</li>
          </ul>
        </div>
        <div className="bg-red-50 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4 text-red-800">Пациент обязан:</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Заботиться о своем здоровье.</li>
            <li>Соблюдать правила внутреннего распорядка.</li>
            <li>Своевременно информировать врача об изменениях состояния.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}