import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en/translation.json';
import ja from './locales/ja/translation.json';

const STORAGE_KEY = 'rss-decks-language';
const savedLanguage =
  typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;

i18n.use(initReactI18next).init({
  resources: {
    ja: { translation: ja },
    en: { translation: en },
  },
  lng:
    savedLanguage ??
    (typeof navigator !== 'undefined' && navigator.language.startsWith('ja') ? 'ja' : 'en'),
  fallbackLng: 'ja',
  interpolation: { escapeValue: false },
});

i18n.on('languageChanged', (lng) => {
  localStorage.setItem(STORAGE_KEY, lng);
  document.documentElement.lang = lng;
});

export default i18n;
