import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './locales/en.json';
import mn from './locales/mn.json';
import bookingEn from './locales/booking/en.json';
import bookingMn from './locales/booking/mn.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, 
    },
    resources: {
      en: {
        translation: en,
        booking: bookingEn
      },
      mn: {
        translation: mn,
        booking: bookingMn
      }
    }
  });

export default i18n;