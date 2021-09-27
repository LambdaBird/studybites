import fp from 'fastify-plugin';

import { router } from './routes';

import { emailUtils } from './utils';

const emailService = (instance, opts, done) => {
  instance.register(router, opts);
  instance.decorate('emailUtils', emailUtils);
  return done();
};

export default fp(emailService);
