import fp from 'fastify-plugin';
import jwt from 'fastify-jwt';

import router from './routes';
import auth from './auth';
import access from './access';

const userService = (instance, opts, next) => {
  instance.register(jwt, { secret: process.env.JWT_SECRET });

  instance.decorate('auth', auth);
  instance.decorate('access', access);

  instance.register(router, opts);

  next();
};

export default fp(userService);
