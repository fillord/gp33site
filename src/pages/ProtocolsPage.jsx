import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { FileText, Download } from 'lucide-react';
import { protocolsData } from '../data/protocolsData'; // Импортируем наш новый файл

export default function ProtocolsPage() {
  const { lang } = useOutletContext();

  const t = {
    title: lang === 'ru' ? "Протокола заседаний" : "Отырыс хаттамалары",
    download: lang === 'ru' ? "Скачать" : "Жүктеу",
    empty: lang === 'ru' ? "Список пуст" : "Тізім бос"
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-teal-800 mb-8 border-l-8 border-teal-500 pl-4">
        {t.title}
      </h2>

      {protocolsData.length === 0 ? (
        <p className="text-gray-500">{t.empty}</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {protocolsData.map((item) => (
            <div 
              key={item.id} 
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="flex items-start mb-4">
                <div className="bg-teal-50 p-3 rounded-lg mr-4">
                   {/* Иконка файла */}
                   <FileText size={32} className="text-teal-600" />
                </div>
                <div>
                   <h3 className="font-bold text-gray-800 text-lg leading-tight">
                     {lang === 'ru' ? item.titleRu : item.titleKz}
                   </h3>
                </div>
              </div>
              
              <a 
                href={item.file} 
                download
                className="mt-auto w-full flex items-center justify-center bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition font-medium"
              >
                <Download size={18} className="mr-2" />
                {t.download} (Excel)
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}