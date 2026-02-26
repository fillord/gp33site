import React, { useState, useEffect, useRef } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  Eye,
  Search,
  Phone,
  Mail,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Globe,
  MapPin,
  Clock,
  FileText,
} from "lucide-react";
import { pagesData } from "../data/pagesData"; // Импортируем статические данные

// === СЛОВАРЬ ===
const translations = {
  ru: {
    header: {
      search: "Поиск...",
      eye: "Версия для слабовидящих",
      reset: "Сброс",
      title: "Городская поликлиника № 33",
      registry: "Регистратура:",
      callcenter: "Колл-центр:",
    },
    nav: {
      home: "ГЛАВНАЯ",
      about: "О ПОЛИКЛИНИКЕ",
      blog: "БЛОГ ГЛАВНОГО ВРАЧА",
      press: "ПРЕСС-ЦЕНТР",
      guest: "ГОСТЕВАЯ",
      services: "ГОС. УСЛУГИ",
      symbols: "ГОС. СИМВОЛЫ",
      patients: "ПАЦИЕНТАМ",
    },
    menu: {
      about_general: "Общая информация",
      about_sphere: "Сфера деятельности",
      about_anticorruption: "Противодействие коррупции",
      about_structure: "Структура",
      about_certs: "Сертификаты",
      about_admin: "АДМИНИСТРАЦИЯ",
      about_vacancies: "Вакансии",
      about_income: "Отчет о доходах и расходах",
      about_procurement: "Государственный закуп",
      about_ethics: "Кодекс этики МР",
      about_annual: "Годовой отчет",
      about_policy: "Антикоррупционная политика",
      corp_gov: "Корпоративное управление",
      corp_council: "Наблюдательный совет",
      corp_docs: "Корпоративные документы",
      corp_licenses: "Лицензии",
      about_docs: "Документы", // <-- Заголовок подменю
      about_docs_normative: "Нормативные документы",
      about_docs_archive: "Архив",
      about_docs_protocol: "Протокола",
      blog_welcome: "Обращение главного врача",
      blog_feedback: "Подать обращение",
      press_video: "Видеогалерея",
      guest_thanks: "Благодарности",
      guest_complaints: "Жалобы",
      guest_reviews: "Отзывы",
      serv_acts: "Нормативно-правовые акты",
      serv_registry: "Реестр госуслуг",
      serv_standards: "Стандарты оказания услуг",
      serv_regulations: "Регламенты оказания услуг",
      serv_info: "Информационные материалы",
      serv_contact: "Единый контакт-центр",
      serv_rights: "Права услугополучателей",
      pat_admin_recep: "Прием граждан администрацией",
      pat_support: "Служба поддержки пациентов",
      pat_territory: "Обслуживаемая территория",
      pat_personal_sched: "График личного приема",
      pat_doc_sched: "График приема врачей",
      pat_rights: "Права и обязанности",
      pat_prices: "Прейскурант цен",
      pat_info: "Полезная информация",
      pat_schools: "Школы здоровья",
      pat_lifestyle: "Здоровый образ жизни (ЗОЖ)",
    },
    footer: {
      contacts: "Контактная информация",
      addressTitle: "Адрес:",
      address: "Алматы, проспект Райымбека, 263/2",
      hoursTitle: "Часы работы:",
      hours: "ПН-ПТ с 08:00-20:00, СБ с 09:00-14:00",
      phoneTitle: "Телефон:",
      emailTitle: "E-mail:",
      navTitle: "Меню навигации",
      copyright: "Городская Поликлиника №33 © Все права защищены.",
    },
  },
  kz: {
    header: {
      search: "Іздеу...",
      eye: "Нашар көретіндерге",
      reset: "Қалпына келтіру",
      title: "№33 Қалалық емхана",
      registry: "Тіркеу бөлімі:",
      callcenter: "Call-орталық:",
    },
    nav: {
      home: "БАСТЫ БЕТ",
      about: "ЕМХАНА ТУРАЛЫ",
      blog: "БАС ДӘРІГЕР БЛОГЫ",
      press: "БАСПАСӨЗ ОРТАЛЫҒЫ",
      guest: "ҚОНАҚ КІТАБЫ",
      services: "МЕМЛЕКЕТТІК ҚЫЗМЕТТЕР",
      symbols: "МЕМЛЕКЕТТІК РӘМІЗДЕР",
      patients: "ПАЦИЕНТТЕРГЕ",
    },
    menu: {
      about_general: "Жалпы ақпарат",
      about_sphere: "Қызмет саласы",
      about_anticorruption: "Сыбайлас жемқорлыққа қарсы іс-қимыл",
      about_structure: "Құрылым",
      about_certs: "Сертификаттар",
      about_admin: "ӘКІМШІЛІК",
      about_vacancies: "Бос жұмыс орындары",
      about_income: "Кірістер мен шығыстар туралы есеп",
      about_procurement: "Мемлекеттік сатып алу",
      about_ethics: "Этикалық кодекс",
      about_annual: "Жылдық есеп",
      about_policy: "Сыбайлас жемқорлыққа қарсы саясат",
      corp_gov: "Корпоративтік басқару",
      corp_council: "Бақылау кеңесі",
      corp_docs: "Корпоративтік құжаттар",
      corp_licenses: "Лицензиялар",
      about_docs: "Құжаттар", // <-- Заголовок подменю
      about_docs_normative: "Нормативтік құжаттар",
      about_docs_archive: "Мұрағат",
      about_docs_protocol: "Хаттамалар",
      blog_welcome: "Бас дәрігердің алғысөзі",
      blog_feedback: "Өтініш беру",
      press_video: "Бейнегалерея",
      guest_thanks: "Алғыстар",
      guest_complaints: "Шағымдар",
      guest_reviews: "Пікірлер",
      serv_acts: "Нормативтік-құқықтық актілер",
      serv_registry: "Мемлекеттік қызметтер тізілімі",
      serv_standards: "Мемлекеттік қызмет көрсету стандарттары",
      serv_regulations: "Қызмет көрсету регламенттері",
      serv_info: "Ақпараттық материалдар",
      serv_contact: "Бірыңғай байланыс орталығы",
      serv_rights: "Қызмет алушылардың құқықтары",
      pat_admin_recep: "Азаматтарды қабылдау",
      pat_support: "Пациенттерді қолдау қызметі",
      pat_territory: "Қызмет көрсету аумағы",
      pat_personal_sched: "Жеке қабылдау кестесі",
      pat_doc_sched: "Дәрігерлердің қабылдау кестесі",
      pat_rights: "Құқықтар мен міндеттер",
      pat_prices: "Бағалар прейскуранты",
      pat_info: "Пайдалы ақпарат",
      pat_schools: "Денсаулық мектептері",
      pat_lifestyle: "Салауатты өмір салты (СӨС)",
    },
    footer: {
      contacts: "Байланыс ақпараты",
      addressTitle: "Мекенжай:",
      address: "Алматы, Райымбек даңғылы, 263/2",
      hoursTitle: "Жұмыс уақыты:",
      hours: "Дс-Жм 08:00-20:00, Сб 09:00-12:00",
      phoneTitle: "Телефон:",
      emailTitle: "E-mail:",
      navTitle: "Навигация мәзірі",
      copyright: "№33 Қалалық емхана © Барлық құқықтар қорғалған.",
    },
  },
};

// Хелпер для получения ссылки по ключу из pagesData
const getLinkByKey = (key) => {
  if (key === "home") return "/";
  if (key === "symbols") return "/symbols";
  if (key === "blog_welcome") return "/blog/welcome";
  // Простая карта соответствий (можно расширять)
  if (key.startsWith("about_")) return `/about/${key.replace("about_", "")}`;
  if (key.startsWith("corp_")) return `/about/corp/${key.replace("corp_", "")}`;
  if (key.startsWith("services_"))
    return `/services/${key.replace("services_", "")}`;
  if (key.startsWith("pat_"))
    return `/patients/${key.replace("pat_", "").replace("_", "-")}`;
  if (key === "blog_welcome") return "/blog/welcome";
  return "/"; // Fallback
};

const API_URL = import.meta.env.DEV
  ? "http://localhost:8000"
  : "https://almgp33.kz";

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lang, setLang] = useState("ru");
  const [showAccessPanel, setShowAccessPanel] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const [isGrayscale, setIsGrayscale] = useState(false);

  // === SEARCH STATE ===
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [newsData, setNewsData] = useState([]);
  const [doctorsData, setDoctorsData] = useState([]);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  const t = translations[lang];
  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchQuery(""); // Очищаем поиск при переходе
    setSearchResults([]);
  }, [location]);

  // Загружаем новости для поиска
  useEffect(() => {
    fetch(`${API_URL}/api/news`)
      .then((res) => res.json())
      .then((data) => setNewsData(data))
      .catch((err) => console.error("Search News Fetch Error", err));

    // 2. Врачи (чтобы искать по фамилиям)
    fetch(`${API_URL}/api/schedule`)
      .then((res) => res.json())
      .then((data) => setDoctorsData(data))
      .catch((err) => console.error("Doctors Search Error", err));
  }, []);

  // Клик вне поиска закрывает результаты
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const containerStyle = {
    filter: isGrayscale ? "grayscale(100%) contrast(1.2)" : "none",
    fontSize: `${fontSize}%`,
    transition: "filter 0.3s ease, font-size 0.3s ease",
  };

  const toggleLang = () => setLang((prev) => (prev === "ru" ? "kz" : "ru"));

  // === ЛОГИКА ПОИСКА ===
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(e.target.value);

    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    const results = [];

    // 1. Ищем в pagesData (статические страницы)
    Object.keys(pagesData).forEach((key) => {
      const page = pagesData[key][lang];
      if (
        page &&
        (page.title.toLowerCase().includes(query) ||
          page.content.toLowerCase().includes(query))
      ) {
        results.push({
          type: "page",
          title: page.title,
          link: getLinkByKey(key),
          snippet:
            page.content.replace(/<[^>]*>?/gm, "").substring(0, 60) + "...",
        });
      }
    });

    // 2. Ищем в новостях
    newsData.forEach((item) => {
      const title = lang === "kz" && item.titleKz ? item.titleKz : item.title;
      const text = lang === "kz" && item.textKz ? item.textKz : item.text;

      if (
        title.toLowerCase().includes(query) ||
        text.toLowerCase().includes(query)
      ) {
        results.push({
          type: "news",
          title: title,
          link: "/news", // В идеале сделать ссылку на конкретную новость /news/:id
          snippet: text.substring(0, 60) + "...",
        });
      }
    });
    // 3. Ищем ВРАЧЕЙ (Новое!)
    doctorsData.forEach((doc) => {
      // Ищем по имени или специальности
      if (
        doc.name.toLowerCase().includes(query) ||
        doc.role.toLowerCase().includes(query)
      ) {
        results.push({
          type: "doctor",
          title: `${doc.name} (${doc.role})`,
          link: "/patients/doc-schedule", // Ведем на расписание
          snippet: `Кабинет: ${doc.cabinet}`,
        });
      }
    });

    setSearchResults(results.slice(0, 10)); // Показываем топ-10
  };

  const handleResultClick = (link) => {
    navigate(link);
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <div
      style={containerStyle}
      className="min-h-screen flex flex-col font-sans text-gray-800 bg-white"
    >
      {/* ================== HEADER ================== */}
      <div className="bg-gray-100 border-b border-gray-200 py-2">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row justify-between items-center text-xs lg:text-sm">
          <div className="hidden xl:flex items-center space-x-4 text-gray-500 mb-2 lg:mb-0">
            <span className="flex items-center gap-1">
              <Phone size={14} /> 1414
            </span>
            <span className="flex items-center gap-1">
              <Mail size={14} /> priemnaya_gp33@mail.ru
            </span>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4 ml-auto w-full md:w-auto justify-end">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 text-gray-800 font-medium text-right sm:text-left">
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-teal-600" />
                <span className="text-teal-700 font-bold hidden sm:inline">
                  {t.header.registry}
                </span>
                <a
                  href="tel:+77273395898"
                  className="hover:text-teal-600 transition"
                >
                  8 (727) 339-58-98
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-teal-600" />
                <span className="text-teal-700 font-bold hidden sm:inline">
                  {t.header.callcenter}
                </span>
                <div className="flex flex-col sm:flex-row gap-0 sm:gap-3">
                  <a
                    href="tel:+77273395903"
                    className="hover:text-teal-600 transition"
                  >
                    8 (727) 339-59-03
                  </a>
                  <a
                    href="tel:+77273395899"
                    className="hover:text-teal-600 transition"
                  >
                    8 (727) 339-58-99
                  </a>
                </div>
              </div>
            </div>
            <div className="hidden md:block w-px h-6 bg-gray-300 mx-2"></div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleLang}
                className="flex items-center font-bold text-teal-700 hover:text-teal-900 uppercase"
              >
                <Globe size={16} className="mr-1" />{" "}
                {lang === "ru" ? "ҚАЗ" : "РУС"}
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowAccessPanel(!showAccessPanel)}
                  className={`flex items-center ${showAccessPanel ? "text-blue-600 font-bold" : "text-gray-600"}`}
                >
                  <Eye size={16} className="mr-1" />{" "}
                  <span className="hidden sm:inline">{t.header.eye}</span>
                </button>
                {showAccessPanel && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white shadow-xl border rounded-lg p-4 z-50">
                    <div className="mb-4 flex bg-gray-100 rounded">
                      <button
                        onClick={() => setFontSize(100)}
                        className="flex-1 py-1 hover:bg-gray-200"
                      >
                        A
                      </button>
                      <button
                        onClick={() => setFontSize(125)}
                        className="flex-1 py-1 text-lg hover:bg-gray-200"
                      >
                        A+
                      </button>
                      <button
                        onClick={() => setFontSize(150)}
                        className="flex-1 py-1 text-xl font-bold hover:bg-gray-200"
                      >
                        A++
                      </button>
                    </div>
                    <button
                      onClick={() => setIsGrayscale(!isGrayscale)}
                      className="w-full py-2 border rounded mb-2"
                    >
                      {isGrayscale ? "Цветной" : "Ч/Б"}
                    </button>
                    <button
                      onClick={() => {
                        setFontSize(100);
                        setIsGrayscale(false);
                      }}
                      className="text-xs text-red-500 underline w-full text-center"
                    >
                      {t.header.reset}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white py-4 shadow-sm relative z-40">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-3 group">
            {/* ЛОГОТИП */}
            <img
              src="/logo.png"
              alt="Logo"
              className="w-12 h-12 object-contain group-hover:scale-105 transition duration-300"
            />
            <h1 className="text-xl md:text-2xl font-bold text-teal-800 leading-tight">
              {t.header.title}
            </h1>
          </Link>

          {/* === ПОИСК (РАБОЧИЙ) === */}
          <div
            className="hidden lg:flex relative mx-4 w-64 xl:w-80"
            ref={searchRef}
          >
            <input
              type="text"
              placeholder={t.header.search}
              value={searchQuery}
              onChange={handleSearch}
              className="w-full border rounded-full pl-4 pr-10 py-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none transition shadow-sm bg-gray-50 focus:bg-white"
            />
            <Search
              size={16}
              className="absolute right-3 top-2.5 text-gray-400"
            />

            {/* ВЫПАДАЮЩИЙ СПИСОК РЕЗУЛЬТАТОВ */}
            {searchQuery.length >= 2 && (
              <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-fade-in-down">
                {searchResults.length > 0 ? (
                  <ul>
                    {searchResults.map((res, idx) => (
                      <li
                        key={idx}
                        onClick={() => handleResultClick(res.link)}
                        className="px-4 py-3 hover:bg-teal-50 cursor-pointer border-b border-gray-50 last:border-0 transition"
                      >
                        <div className="font-bold text-teal-800 text-sm flex items-center">
                          {res.type === "news" ? (
                            <FileText size={12} className="mr-1 opacity-50" />
                          ) : (
                            <Search size={12} className="mr-1 opacity-50" />
                          )}
                          {res.title}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 truncate">
                          {res.snippet}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-4 text-center text-gray-400 text-sm">
                    Ничего не найдено / Ештеңе табылмады
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            className="lg:hidden text-teal-800"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* ================== NAVIGATION ================== */}
      <nav
        className={`bg-teal-700 text-white relative z-30 ${mobileMenuOpen ? "block" : "hidden lg:block"}`}
      >
        <div className="container mx-auto px-4">
          <ul className="flex flex-col lg:flex-row lg:space-x-1 text-sm font-semibold uppercase">
            <li className="hover:bg-teal-800">
              <Link to="/" className="block px-3 py-4">
                {t.nav.home}
              </Link>
            </li>
            <li className="group relative hover:bg-teal-800 cursor-pointer">
              <span className="flex items-center px-3 py-4">
                {t.nav.about} <ChevronDown size={14} className="ml-1" />
              </span>
              <ul className="lg:absolute lg:top-full lg:left-0 bg-white text-gray-800 w-72 shadow-xl hidden group-hover:block z-50 border-t-2 border-yellow-400">
                <li>
                  <Link
                    to="/about/general"
                    className="block px-4 py-3 hover:bg-gray-100"
                  >
                    {t.menu.about_general}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about/sphere"
                    className="block px-4 py-3 hover:bg-gray-100"
                  >
                    {t.menu.about_sphere}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about/anticorruption"
                    className="block px-4 py-3 hover:bg-gray-100"
                  >
                    {t.menu.about_anticorruption}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about/structure"
                    className="block px-4 py-3 hover:bg-gray-100"
                  >
                    {t.menu.about_structure}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about/certificates"
                    className="block px-4 py-3 hover:bg-gray-100"
                  >
                    {t.menu.about_certs}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about/admin"
                    className="block px-4 py-3 hover:bg-gray-100 font-bold text-teal-700"
                  >
                    {t.menu.about_admin}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about/vacancies"
                    className="block px-4 py-3 hover:bg-gray-100"
                  >
                    {t.menu.about_vacancies}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about/income"
                    className="block px-4 py-3 hover:bg-gray-100"
                  >
                    {t.menu.about_income}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about/procurement"
                    className="block px-4 py-3 hover:bg-gray-100"
                  >
                    {t.menu.about_procurement}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about/ethics"
                    className="block px-4 py-3 hover:bg-gray-100"
                  >
                    {t.menu.about_ethics}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about/annual"
                    className="block px-4 py-3 hover:bg-gray-100"
                  >
                    {t.menu.about_annual}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about/policy"
                    className="block px-4 py-3 hover:bg-gray-100"
                  >
                    {t.menu.about_policy}
                  </Link>
                </li>
                <li className="relative group/sub hover:bg-gray-100">
                  <span className="flex items-center justify-between px-4 py-3 text-teal-800">
                    {t.menu.about_docs} <ChevronRight size={14} />
                  </span>
                  {/* Выпадающее меню второго уровня */}
                  <ul className="lg:absolute lg:left-full lg:top-0 bg-gray-50 text-gray-800 w-64 shadow-xl hidden group-hover/sub:block border-l-2 border-yellow-400">
                    <li>
                      <Link
                        to="/about/docs/normative"
                        className="block px-4 py-3 hover:bg-white"
                      >
                        {t.menu.about_docs_normative}
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/about/docs/archive"
                        className="block px-4 py-3 hover:bg-white"
                      >
                        {t.menu.about_docs_archive}
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/about/docs/protocol"
                        className="block px-4 py-3 hover:bg-white"
                      >
                        {t.menu.about_docs_protocol}
                      </Link>
                    </li>
                  </ul>
                </li>

                <li className="relative group/sub hover:bg-gray-100">
                  <span className="flex items-center justify-between px-4 py-3 text-teal-800">
                    {t.menu.corp_gov} <ChevronRight size={14} />
                  </span>
                  <ul className="lg:absolute lg:left-full lg:top-0 bg-gray-50 text-gray-800 w-64 shadow-xl hidden group-hover/sub:block border-l-2 border-yellow-400">
                    <li>
                      <Link
                        to="/about/corp/council"
                        className="block px-4 py-3 hover:bg-white"
                      >
                        {t.menu.corp_council}
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/about/corp/docs"
                        className="block px-4 py-3 hover:bg-white"
                      >
                        {t.menu.corp_docs}
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/about/corp/licenses"
                        className="block px-4 py-3 hover:bg-white"
                      >
                        {t.menu.corp_licenses}
                      </Link>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
            <li className="group relative hover:bg-teal-800 cursor-pointer">
              <span className="flex items-center px-3 py-4">
                {t.nav.blog} <ChevronDown size={14} className="ml-1" />
              </span>
              <ul className="lg:absolute lg:top-full lg:left-0 bg-white text-gray-800 w-64 shadow-xl hidden group-hover:block z-50 border-t-2 border-yellow-400">
                <li>
                  <Link
                    to="/blog/welcome"
                    className="block px-4 py-3 hover:bg-gray-100"
                  >
                    {t.menu.blog_welcome}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/blog/feedback"
                    className="block px-4 py-3 hover:bg-gray-100"
                  >
                    {t.menu.blog_feedback}
                  </Link>
                </li>
              </ul>
            </li>
            <li className="group relative hover:bg-teal-800 cursor-pointer">
              <span className="flex items-center px-3 py-4">
                {t.nav.press} <ChevronDown size={14} className="ml-1" />
              </span>
              <ul className="lg:absolute lg:top-full lg:left-0 bg-white text-gray-800 w-64 shadow-xl hidden group-hover:block z-50 border-t-2 border-yellow-400">
                <li>
                  <Link
                    to="/media/video"
                    className="block px-4 py-3 hover:bg-gray-100"
                  >
                    {t.menu.press_video}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/news"
                    className="block px-4 py-3 hover:bg-gray-100"
                  >
                    Новости
                  </Link>
                </li>
              </ul>
            </li>
            <li className="group relative hover:bg-teal-800 cursor-pointer">
              <span className="flex items-center px-3 py-4">
                {t.nav.guest} <ChevronDown size={14} className="ml-1" />
              </span>
              <ul className="lg:absolute lg:top-full lg:left-0 bg-white text-gray-800 w-64 shadow-xl hidden group-hover:block z-50 border-t-2 border-yellow-400">
                <li>
                  <Link
                    to="/guest/thanks"
                    className="block px-4 py-3 hover:bg-gray-100"
                  >
                    {t.menu.guest_thanks}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/guest/complaints"
                    className="block px-4 py-3 hover:bg-gray-100"
                  >
                    {t.menu.guest_complaints}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/guest/reviews"
                    className="block px-4 py-3 hover:bg-gray-100"
                  >
                    {t.menu.guest_reviews}
                  </Link>
                </li>
              </ul>
            </li>
            <li className="group relative hover:bg-teal-800 cursor-pointer">
              <span className="flex items-center px-3 py-4">
                {t.nav.services} <ChevronDown size={14} className="ml-1" />
              </span>
              <ul className="lg:absolute lg:top-full lg:left-0 bg-white text-gray-800 w-72 shadow-xl hidden group-hover:block z-50 border-t-2 border-yellow-400">
                <li>
                  <Link
                    to="/services/acts"
                    className="block px-4 py-3 hover:bg-gray-100"
                  >
                    {t.menu.serv_acts}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/services/registry"
                    className="block px-4 py-3 hover:bg-gray-100"
                  >
                    {t.menu.serv_registry}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/services/standards"
                    className="block px-4 py-3 hover:bg-gray-100"
                  >
                    {t.menu.serv_standards}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/services/regulations"
                    className="block px-4 py-3 hover:bg-gray-100"
                  >
                    {t.menu.serv_regulations}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/services/info"
                    className="block px-4 py-3 hover:bg-gray-100"
                  >
                    {t.menu.serv_info}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/services/contact"
                    className="block px-4 py-3 hover:bg-gray-100"
                  >
                    {t.menu.serv_contact}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/services/rights"
                    className="block px-4 py-3 hover:bg-gray-100"
                  >
                    {t.menu.serv_rights}
                  </Link>
                </li>
              </ul>
            </li>
            <li className="hover:bg-teal-800">
              <Link to="/symbols" className="block px-3 py-4">
                {t.nav.symbols}
              </Link>
            </li>
            <li className="group relative hover:bg-teal-800 cursor-pointer">
              <span className="flex items-center px-3 py-4 text-yellow-300 font-bold">
                {t.nav.patients} <ChevronDown size={14} className="ml-1" />
              </span>
              <ul className="lg:absolute lg:top-full lg:right-0 bg-white text-gray-800 w-72 shadow-xl hidden group-hover:block z-50 border-t-2 border-yellow-400">
                <li>
                  <Link
                    to="/patients/admin-reception"
                    className="block px-4 py-3 hover:bg-gray-100"
                  >
                    {t.menu.pat_admin_recep}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/patients/support"
                    className="block px-4 py-3 hover:bg-gray-100"
                  >
                    {t.menu.pat_support}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/patients/territory"
                    className="block px-4 py-3 hover:bg-gray-100"
                  >
                    {t.menu.pat_territory}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/patients/personal-schedule"
                    className="block px-4 py-3 hover:bg-gray-100"
                  >
                    {t.menu.pat_personal_sched}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/patients/doc-schedule"
                    className="block px-4 py-3 hover:bg-gray-100"
                  >
                    {t.menu.pat_doc_sched}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/patients/rights"
                    className="block px-4 py-3 hover:bg-gray-100"
                  >
                    {t.menu.pat_rights}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/patients/prices"
                    className="block px-4 py-3 hover:bg-gray-100"
                  >
                    {t.menu.pat_prices}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/patients/info"
                    className="block px-4 py-3 hover:bg-gray-100"
                  >
                    {t.menu.pat_info}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/patients/schools"
                    className="block px-4 py-3 hover:bg-gray-100"
                  >
                    {t.menu.pat_schools}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/patients/lifestyle"
                    className="block px-4 py-3 hover:bg-gray-100"
                  >
                    {t.menu.pat_lifestyle}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/patients/screening"
                    className="block px-4 py-3 hover:bg-gray-100 font-bold text-teal-600"
                  >
                    {lang === "ru"
                      ? "Календарь скринингов"
                      : "Скринингтер күнтізбесі"}
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </nav>

      {/* ================== MAIN CONTENT ================== */}
      <main className="flex-grow">
        <Outlet context={{ lang }} />
      </main>

      {/* ================== FOOTER (ПОДВАЛ) ================== */}
      <footer className="bg-gradient-to-br from-teal-800 to-teal-900 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* 1. КОНТАКТЫ */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold mb-6 text-yellow-400 border-b border-teal-700 pb-2 inline-block">
                {t.footer.contacts}
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="text-teal-300 font-bold uppercase text-xs mb-1">
                    {t.footer.addressTitle}
                  </div>
                  <div className="flex items-start text-lg">
                    <MapPin
                      size={24}
                      className="mr-3 text-yellow-400 flex-shrink-0 mt-1"
                    />
                    <span>{t.footer.address}</span>
                  </div>
                </div>
                <div>
                  <div className="text-teal-300 font-bold uppercase text-xs mb-1">
                    {t.footer.hoursTitle}
                  </div>
                  <div className="flex items-start text-lg">
                    <Clock
                      size={24}
                      className="mr-3 text-yellow-400 flex-shrink-0 mt-1"
                    />
                    <span>{t.footer.hours}</span>
                  </div>
                </div>
                <div>
                  <div className="text-teal-300 font-bold uppercase text-xs mb-1">
                    {t.footer.phoneTitle}
                  </div>
                  <div className="flex items-start text-lg">
                    <Phone
                      size={24}
                      className="mr-3 text-yellow-400 flex-shrink-0 mt-1"
                    />
                    <div className="flex flex-col">
                      <a
                        href="tel:+77273395903"
                        className="hover:text-yellow-300 transition"
                      >
                        +7 (727) 339-59-03
                      </a>
                      <a
                        href="tel:+77273395898"
                        className="hover:text-yellow-300 transition"
                      >
                        +7 (727) 339-58-98
                      </a>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-teal-300 font-bold uppercase text-xs mb-1">
                    {t.footer.emailTitle}
                  </div>
                  <div className="flex items-start text-lg">
                    <Mail
                      size={24}
                      className="mr-3 text-yellow-400 flex-shrink-0 mt-1"
                    />
                    <a
                      href="mailto:priemnaya_gp33@mail.ru"
                      className="hover:text-yellow-300 transition"
                    >
                      priemnaya_gp33@mail.ru
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. НАВИГАЦИЯ */}
            <div className="lg:px-8">
              <h3 className="text-2xl font-bold mb-6 text-yellow-400 border-b border-teal-700 pb-2 inline-block">
                {t.footer.navTitle}
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/"
                    className="hover:text-yellow-300 transition flex items-center"
                  >
                    <ChevronRight size={16} className="mr-2" /> {t.nav.home}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about/general"
                    className="hover:text-yellow-300 transition flex items-center"
                  >
                    <ChevronRight size={16} className="mr-2" /> {t.nav.about}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/blog/welcome"
                    className="hover:text-yellow-300 transition flex items-center"
                  >
                    <ChevronRight size={16} className="mr-2" /> {t.nav.blog}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/guest/reviews"
                    className="hover:text-yellow-300 transition flex items-center"
                  >
                    <ChevronRight size={16} className="mr-2" /> {t.nav.guest}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/services/registry"
                    className="hover:text-yellow-300 transition flex items-center"
                  >
                    <ChevronRight size={16} className="mr-2" /> {t.nav.services}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/symbols"
                    className="hover:text-yellow-300 transition flex items-center"
                  >
                    <ChevronRight size={16} className="mr-2" /> {t.nav.symbols}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/patients/info"
                    className="hover:text-yellow-300 transition flex items-center"
                  >
                    <ChevronRight size={16} className="mr-2" /> {t.nav.patients}
                  </Link>
                </li>
              </ul>
            </div>

            {/* 3. КАРТА (GOOGLE MAPS) */}
            <div className="rounded-xl overflow-hidden shadow-2xl border-4 border-white/10 h-64 lg:h-auto relative bg-gray-700">
              {/* Google Maps с локацией 263/2 */}
              <iframe
                title="Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d726.3893898217111!2d76.89092657295565!3d43.260693717590534!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x388369001d218993%3A0x92d6cd9ae469cb3f!2z0JPQvtGA0L7QtNGB0LrQsNGPINC_0L7Qu9C40LrQu9C40L3QuNC60LAg4oSWIDMz!5e0!3m2!1sru!2skz!4v1768499491210!5m2!1sru!2skz"
                className="w-full h-full absolute inset-0"
                allowFullScreen
                loading="lazy"
              ></iframe>
              <a
                href="https://2gis.kz/almaty/firm/70000001087654592/76.891331%2C43.261222?m=76.891374%2C43.260552%2F18"
                target="_blank"
                rel="noreferrer"
                className="absolute bottom-4 left-4 bg-white text-teal-900 px-4 py-2 rounded-lg text-sm font-bold shadow-lg hover:bg-yellow-400 transition"
              >
                📍 Как добраться (2GIS)
              </a>
            </div>
          </div>
        </div>

        {/* НИЖНЯЯ ПОЛОСА */}
        <div className="bg-teal-950 py-4 text-center text-teal-400 text-sm border-t border-teal-800">
          <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
            <span>{t.footer.copyright}</span>
            <span className="mt-2 md:mt-0 opacity-60 hover:opacity-100 transition cursor-default">
              Разработано с заботой о здоровье
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
