import fp from 'fastify-plugin';

import { router } from './routes';

export const lessonsService = fp((instance, opts, done) => {
  instance.register(router, opts);
  return done();
});
