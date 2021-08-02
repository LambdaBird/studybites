import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './resources/lang/en/index';
import ru from './resources/lang/ru/index';

export const LANGUAGES_LIST = [
  {
    key: 'en',
    value: 'English',
  },
  {
    key: 'ru',
    value: 'Русский',
  },
];

const resources = {
  en,
  ru,
};

const getLanguage = () =>
  LANGUAGES_LIST.find((lang) => navigator.language.includes(lang.key))?.key ||
  'en';

i18n.use(initReactI18next).init({
  resources,
  lng: getLanguage(),
  ns: ['admin', 'sign_in', 'sign_up', 'teacher', 'user', 'common'],
  defaultNS: 'common',
  keySeparator: '.',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
