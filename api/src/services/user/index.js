import fp from 'fastify-plugin';
import jwt from 'fastify-jwt';

import router from './routes';
import auth from './auth';

const userService = fp((instance, next) => {
  instance.register(jwt, { secret: process.env.JWT_SECRET });

  instance.decorate('auth', auth);

  instance.register(router);

  next();
});

export default userService;
