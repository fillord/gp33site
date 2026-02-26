// Автоматически определяем среду (разработка или бой)
export const API_URL = import.meta.env.DEV
  ? "http://localhost:8000"
  : "https://almgp33.kz";

// Делаем DOMAIN_URL динамическим, чтобы картинки тоже грузились откуда надо
export const DOMAIN_URL = API_URL;

// Для новых компонентов (CRM, Чат), если мы там использовали API_BASE_URL
export const API_BASE_URL = API_URL;
