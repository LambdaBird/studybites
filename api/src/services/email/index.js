import fp from 'fastify-plugin';

import { router } from './routes';

import Email from './models/Email';
import Redis from './models/Redis';

const emailService = (instance, opts, done) => {
  const { redis } = instance;
  Redis.redisClient = redis;
  instance.register(router, opts);
  instance.decorate('emailModel', Email);
  instance.decorate('redisModel', Redis);
  return done();
};

export default fp(emailService);
