import fp from 'fastify-plugin';

import { router } from './routes';

import Email from './models/Email';
import TokenStorage from './models/TokenStorage';

const emailService = (instance, opts, done) => {
  const { redis, i18next } = instance;
  TokenStorage.redisClient = redis;
  instance.register(router, opts);
  instance.decorate('emailModel', new Email(i18next));
  instance.decorate('redisModel', TokenStorage);
  return done();
};

export default fp(emailService);
