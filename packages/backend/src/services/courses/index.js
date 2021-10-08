import fp from 'fastify-plugin';

import { router } from './routes';

const coursesService = (instance, opts, done) => {
  instance.register(router, opts);
  return done();
};

export default fp(coursesService);
