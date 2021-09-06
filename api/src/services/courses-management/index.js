import fp from 'fastify-plugin';

import { router } from './routes';

const coursesManagementService = (instance, opts, done) => {
  instance.register(router, opts);
  return done();
};

export default fp(coursesManagementService);
