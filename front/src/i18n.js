import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './resources/lang/en/index';
import ru from './resources/lang/ru/index';

const resources = {
  en,
  ru,
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  ns: ['admin', 'sign_in', 'sign_up', 'teacher', 'user', 'common'],
  defaultNS: 'common',
  keySeparator: '.',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
