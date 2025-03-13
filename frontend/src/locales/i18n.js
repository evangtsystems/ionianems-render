import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";

i18n
  .use(HttpApi) // Load translations from public folder
  .use(LanguageDetector) // Detect user's language
  .use(initReactI18next) // Bind react-i18next
  .init({
    fallbackLng: "en", // Default language
    debug: true, // Enable debug mode in console
    supportedLngs: ["en", "de", "el"], // ✅ Added Greek (el)
    interpolation: {
      escapeValue: false, // React already protects against XSS
    },
    backend: {
      loadPath: "/locales/{{lng}}/translation.json", // Path to translation files
    },
    detection: {
      order: ["localStorage", "cookie", "navigator"], // Detect language
      caches: ["localStorage", "cookie"], // Cache language selection
    },
  });

export default i18n;


