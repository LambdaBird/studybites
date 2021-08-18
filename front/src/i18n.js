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

const LANGUAGE = 'language';
const DEFAULT_KEY = 'en';
const DEFAULT_VALUE = 'English';

export const removeStorageLanguage = () => {
  localStorage.removeItem(LANGUAGE);
};

export const setStorageLanguage = (language) =>
  localStorage.setItem(LANGUAGE, language);

export const getStorageLanguage = () => localStorage.getItem(LANGUAGE);

export const getLanguageValueByKey = (key) =>
  LANGUAGES_LIST.find((lang) => lang.key === key)?.value || DEFAULT_VALUE;

const getNavigatorLanguage = () =>
  LANGUAGES_LIST.find((lang) => navigator.language.includes(lang.key))?.key ||
  DEFAULT_KEY;

i18n.use(initReactI18next).init({
  resources,
  lng: getStorageLanguage() || getNavigatorLanguage(),
  ns: ['admin', 'sign_in', 'sign_up', 'teacher', 'user', 'common'],
  defaultNS: 'common',
  keySeparator: '.',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
