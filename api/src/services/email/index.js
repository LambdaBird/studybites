import fp from 'fastify-plugin';

import Redis from 'ioredis';
import { router } from './routes';

import { getEmailUtils } from './utils';

const PORT = process.env.REDIS_PORT || 6379;
export const redisClient = new Redis({ host: 'redis', port: PORT });

const emailService = (instance, opts, done) => {
  const emailUtils = getEmailUtils(redisClient);
  instance.register(router, opts);
  instance.decorate('redisClient', redisClient);
  instance.decorate('emailUtils', emailUtils);
  return done();
};

export default fp(emailService);
