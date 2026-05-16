import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import fr from './locales/fr.json';
import en from './locales/en.json';
import ar from './locales/ar.json';

const resources = {
  fr: {
    translation: fr,
  },
  en: {
    translation: en,
  },
  ar: {
    translation: ar,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'fr',
    lng: localStorage.getItem('i18nextLng') || 'fr', // Use i18next's storage key
    debug: import.meta.env.DEV, // Enable debug in development mode
    
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng', // Use i18next's default storage key
    },
  });

// Log current language on init (development only)
if (import.meta.env.DEV) {
  console.log('[i18n] Initialized with language:', i18n.language);
  console.log('[i18n] localStorage i18nextLng:', localStorage.getItem('i18nextLng'));
  console.log('[i18n] localStorage locale:', localStorage.getItem('locale'));
}

export default i18n;
