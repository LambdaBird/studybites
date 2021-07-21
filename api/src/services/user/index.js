import fp from 'fastify-plugin';
import jwt from 'fastify-jwt';

import router from './routes';
import { auth, access } from './hooks';

const userService = (instance, opts, next) => {
  instance.register(jwt, { secret: process.env.JWT_SECRET });
  instance.register(router, opts);

  instance.decorate('auth', auth);
  instance.decorate('access', access);

  return next();
};

export default fp(userService);
