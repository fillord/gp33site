import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { PlayCircle, Loader, X, Youtube } from 'lucide-react';

const API_URL = 'https://almgp33.kz';

export default function MediaVideo() {
  const { lang } = useOutletContext();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null); // Какое видео смотрим

  useEffect(() => {
    fetch(`${API_URL}/api/videos`)
      .then(res => res.json())
      .then(data => {
        setVideos(data);
        setLoading(false);
      })
      .catch(err => setLoading(false));
  }, []);

  const getEmbedUrl = (url) => {
    let videoId = '';
    if (url.includes('youtu.be/')) videoId = url.split('youtu.be/')[1];
    else if (url.includes('v=')) videoId = url.split('v=')[1].split('&')[0];
    if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    return url;
  };

  return (
    <div className="container mx-auto px-4 py-12">
       <h2 className="text-3xl font-bold text-teal-800 mb-8 border-l-8 border-teal-500 pl-4">
         {lang === 'ru' ? 'Видеогалерея' : 'Бейнегалерея'}
       </h2>

       {loading ? (
         <div className="flex justify-center"><Loader className="animate-spin text-teal-600"/></div>
       ) : videos.length === 0 ? (
         <p className="text-gray-500">
           {lang === 'ru' ? 'Видео пока нет.' : 'Бейнелер әзірге жоқ.'}
         </p>
       ) : (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map(video => {
              const displayTitle = (lang === 'kz' && video.titleKz) ? video.titleKz : video.title;
              const embedUrl = getEmbedUrl(video.url);

              return (
                <div 
                  key={video.id} 
                  className="bg-white rounded-xl shadow-lg overflow-hidden group cursor-pointer hover:shadow-2xl transition transform hover:-translate-y-1"
                  onClick={() => setSelectedVideo({ ...video, embedUrl, displayTitle })}
                >
                   <div className="aspect-video bg-black relative">
                      {/* Сам iframe, но мы перекрываем его для клика */}
                      <iframe 
                        src={embedUrl}
                        title={displayTitle}
                        className="w-full h-full opacity-80 group-hover:opacity-100 transition"
                        allowFullScreen
                        // pointer-events-none чтобы клик достался родительскому div, а не iframe
                        style={{ pointerEvents: 'none' }} 
                      ></iframe>
                      
                      {/* Кнопка Play по центру */}
                      <div className="absolute inset-0 flex items-center justify-center">
                         <div className="bg-red-600 text-white rounded-full p-4 shadow-xl group-hover:scale-110 transition">
                            <PlayCircle size={32} fill="white" className="text-white"/>
                         </div>
                      </div>
                   </div>
                   <div className="p-4 bg-white">
                      <h3 className="font-bold text-gray-800 group-hover:text-red-600 transition line-clamp-2">
                         {displayTitle}
                      </h3>
                   </div>
                </div>
              );
            })}
         </div>
       )}

       {/* === МОДАЛЬНОЕ ОКНО ДЛЯ ВИДЕО === */}
       {selectedVideo && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-fade-in">
            <div className="w-full max-w-4xl relative animate-scale-in">
               <button 
                 onClick={() => setSelectedVideo(null)}
                 className="absolute -top-10 right-0 text-white hover:text-red-500 transition"
               >
                 <X size={32}/>
               </button>
               
               <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-gray-800">
                  <iframe 
                    src={`${selectedVideo.embedUrl}?autoplay=1`} // Автозапуск при открытии
                    title={selectedVideo.displayTitle}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
               </div>
               <h3 className="text-white text-xl font-bold mt-4 text-center">
                  {selectedVideo.displayTitle}
               </h3>
            </div>
         </div>
       )}
    </div>
  );
}