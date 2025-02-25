import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
<<<<<<< HEAD
    lng: 'en', // default language
    fallbackLng: 'en',
    supportedLngs: ['en', 'ru'],
    
    interpolation: {
      escapeValue: false, // not needed for React
    },

=======
    lng: 'en',
    fallbackLng: 'en',
    supportedLngs: ['en', 'ru'],
    ns: ['translation'],
    defaultNS: 'translation',
    interpolation: {
      escapeValue: false,
    },
>>>>>>> 96e18c4 (Initial commit with latest updates)
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
  });

export default i18n;
