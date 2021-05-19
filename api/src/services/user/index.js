import fp from 'fastify-plugin';
import jwt from 'fastify-jwt';

import router from './routes';
import auth from './auth';

const userService = fp((instance, next) => {
  instance.register(jwt, { secret: process.env.JWT_SECRET });

  instance.decorate('auth', (fastify, done, req, repl) => {
    auth(fastify, done, req, repl);
  });

  instance.register(router, { prefix: '/api/v1/user' });

  next();
});

export default userService;
