import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Calendar, Search, Loader, User, Clock, MapPin, LayoutGrid } from 'lucide-react';

const API_URL = 'https://almgp33.kz';

export default function ServicesDoctors() {
  const { lang } = useOutletContext();
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("ВОП"); // Активная вкладка по умолчанию

  // Список всех отделений
  const departments = [
    { id: "ВОП", ru: "ВОП (Терапия)", kz: "ЖТД (Терапия)" },
    { id: "Специализированное", ru: "Спец. отделение", kz: "Мамандандырылған бөлім" },
    { id: "Женская консультация", ru: "Женская консультация", kz: "Әйелдер консультациясы" },
    { id: "КДО", ru: "КДО (Диагностика)", kz: "КДО (Диагностика)" }
  ];

  useEffect(() => {
    fetch(`${API_URL}/api/schedule`)
      .then(res => res.json())
      .then(data => {
        const doctorsList = Array.isArray(data) ? data : (data.schedule || []);
        setSchedule(doctorsList);
        setLoading(false);
      })
      .catch(err => setLoading(false));
  }, []);

  // Фильтрация: Сначала по вкладке (отделению), потом по поиску
  const filteredSchedule = schedule.filter(doc => {
    const matchesTab = doc.dept === activeTab;
    const matchesSearch = doc.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.role?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Шапка */}
      <div className="bg-gradient-to-r from-teal-800 to-teal-600 pt-12 pb-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 uppercase tracking-wider">
            {lang === 'ru' ? "График приема специалистов" : "Мамандардың қабылдау кестесі"}
          </h2>
          
          {/* Поиск */}
          <div className="max-w-md mx-auto relative mb-8">
            <Search className="absolute left-4 top-3 text-teal-500" size={20}/>
            <input 
              type="text" 
              placeholder={lang === 'ru' ? "Поиск врача..." : "Дәрігерді іздеу..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full shadow-lg outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* ВКЛАДКИ (ТАБЫ) */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-4">
            {departments.map((dept) => (
              <button
                key={dept.id}
                onClick={() => setActiveTab(dept.id)}
                className={`px-6 py-2 rounded-xl font-bold text-sm transition-all duration-300 ${
                  activeTab === dept.id 
                  ? "bg-yellow-400 text-teal-900 shadow-lg scale-105" 
                  : "bg-teal-700/50 text-teal-100 hover:bg-teal-700"
                }`}
              >
                {dept[lang]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Таблица */}
      <div className="container mx-auto px-4 -mt-10">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {loading ? (
            <div className="py-20 flex justify-center"><Loader className="animate-spin text-teal-600" size={40}/></div>
          ) : filteredSchedule.length === 0 ? (
            <div className="py-20 text-center text-gray-400">
              <LayoutGrid size={48} className="mx-auto mb-4 opacity-20"/>
              <p>{lang === 'ru' ? "В этом отделении пока нет данных" : "Бұл бөлімде әзірге деректер жоқ"}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-teal-800 text-xs uppercase font-black">
                  <tr>
                    <th className="p-4">{lang === 'ru' ? "Врач / Специальность" : "Дәрігер / Мамандығы"}</th>
                    <th className="p-4 text-center">Каб.</th>
                    <th className="p-4 text-center border-l border-gray-100">ПН</th>
                    <th className="p-4 text-center border-l border-gray-100">ВТ</th>
                    <th className="p-4 text-center border-l border-gray-100">СР</th>
                    <th className="p-4 text-center border-l border-gray-100">ЧТ</th>
                    <th className="p-4 text-center border-l border-gray-100">ПТ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredSchedule.map((doc, idx) => (
                    <tr key={idx} className="hover:bg-teal-50/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold shadow-inner">
                            {doc.name?.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-gray-800">{doc.name}</div>
                            <div className="text-xs text-teal-600 font-medium">{doc.role}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <span className="bg-gray-800 text-white px-3 py-1 rounded-lg font-bold text-sm">
                          {doc.cabinet}
                        </span>
                      </td>
                      {[doc.mon, doc.tue, doc.wed, doc.thu, doc.fri].map((time, i) => (
                        <td key={i} className="p-4 text-center text-[11px] font-bold border-l border-gray-50 tabular-nums">
                          {time !== "-" ? (
                            <div className="flex flex-col items-center">
                              <Clock size={12} className="text-teal-500 mb-1 opacity-50"/>
                              {time}
                            </div>
                          ) : "-"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}