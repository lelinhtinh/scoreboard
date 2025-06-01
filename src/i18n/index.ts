import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import vi from './locales/vi.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import de from './locales/de.json';
import ja from './locales/ja.json';
import ko from './locales/ko.json';
import pt from './locales/pt.json';
import zhCN from './locales/zh-CN.json';
import ar from './locales/ar.json';
import hi from './locales/hi.json';
import ru from './locales/ru.json';
import it from './locales/it.json';
import nl from './locales/nl.json';
import th from './locales/th.json';
import id from './locales/id.json';

const resources = {
  en: {
    translation: en,
  },
  vi: {
    translation: vi,
  },
  es: {
    translation: es,
  },
  fr: {
    translation: fr,
  },
  de: {
    translation: de,
  },
  ja: {
    translation: ja,
  },
  ko: {
    translation: ko,
  },
  pt: {
    translation: pt,
  },
  'zh-CN': {
    translation: zhCN,
  },
  ar: {
    translation: ar,
  },
  hi: {
    translation: hi,
  },
  ru: {
    translation: ru,
  },
  it: {
    translation: it,
  },
  nl: {
    translation: nl,
  },
  th: {
    translation: th,
  },
  id: {
    translation: id,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,

    detection: {
      order: ['localStorage', 'cookie', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage', 'cookie'],
    },

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
