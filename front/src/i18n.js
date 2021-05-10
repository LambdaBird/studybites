import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './resources/lang/en.json';
import ru from './resources/lang/ru.json';

const resources = {
  en,
  ru,
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    keySeparator: '.',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
