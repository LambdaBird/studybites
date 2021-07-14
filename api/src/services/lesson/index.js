import fp from 'fastify-plugin';

import router from './routes';

const lessonService = (instance, opts, next) => {
  instance.register(router, opts);

  return next();
};

export default fp(lessonService);
