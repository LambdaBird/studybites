import fp from 'fastify-plugin';

import { router } from './routes';

import Email from './models/Email';
import TokenStorage from './models/TokenStorage';

const emailService = (instance, opts, done) => {
  const { redis } = instance;
  TokenStorage.redisClient = redis;
  instance.register(router, opts);
  instance.decorate('emailModel', new Email());
  instance.decorate('redisModel', TokenStorage);
  return done();
};

export default fp(emailService);
