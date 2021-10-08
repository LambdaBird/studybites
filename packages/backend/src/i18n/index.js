import fp from 'fastify-plugin';
import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import { DEFAULT_LANGUAGE, LANGUAGES_LIST } from '../config/i18n';

export default fp((instance, opts, next) => {
  i18next.use(Backend).init({
    initImmediate: false,
    lng: DEFAULT_LANGUAGE,
    fallbackLng: DEFAULT_LANGUAGE,
    preload: LANGUAGES_LIST,
    ns: ['email'],
    keySeparator: '.',
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: `src/i18n/locales/{{lng}}/{{ns}}.json`,
    },
  });

  instance.decorate('i18next', i18next);

  return next();
});
