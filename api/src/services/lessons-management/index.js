import fp from 'fastify-plugin';

import { router } from './routes';

export const lessonsManagementService = fp((instance, opts, done) => {
  instance.register(router, opts);
  return done();
});
