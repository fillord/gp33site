import React, { useEffect, useState } from 'react';
import { FileText, FileSpreadsheet, File, Download, Loader2 } from 'lucide-react';

export default function DocumentsList({ category }) {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = 'http://localhost:8000';

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/api/documents?category=${category}`)
      .then(res => res.json())
      .then(data => {
        setDocs(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Ошибка загрузки документов:", err);
        setLoading(false);
      });
  }, [category]);

  const getIcon = (type) => {
    const t = type ? type.toLowerCase() : "";
    if (t.includes('xls') || t.includes('csv')) return <FileSpreadsheet className="text-green-600" size={24} />;
    if (t.includes('pdf')) return <FileText className="text-red-600" size={24} />;
    if (t.includes('doc')) return <FileText className="text-blue-600" size={24} />;
    return <File className="text-gray-500" size={24} />;
  };

  if (loading) return <div className="py-4"><Loader2 className="animate-spin text-teal-600" /></div>;
  if (!docs || docs.length === 0) return null;

  return (
    <div className="mt-8 mb-8">
      <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Документы / Құжаттар</h3>
      <div className="grid gap-3">
        {docs.map((doc) => (
          <div key={doc.id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="flex-shrink-0 bg-gray-50 p-2 rounded">
                {getIcon(doc.file_type)}
              </div>
              <div className="min-w-0">
                <p className="font-medium text-gray-800 truncate">{doc.title}</p>
                <p className="text-xs text-gray-400 uppercase">{doc.file_type} • {doc.date}</p>
              </div>
            </div>
            
            <a 
              href={`${API_URL}/api/download/${doc.id}`} 
              download // Атрибут download подсказывает браузеру, что это скачивание
              className="flex items-center gap-2 bg-teal-50 text-teal-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-teal-100 transition-colors ml-4 whitespace-nowrap"
            >
              <Download size={16} />
              <span className="hidden sm:inline">Скачать</span>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}