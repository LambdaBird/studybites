import fp from 'fastify-plugin';

import { router } from './routes';

const invitesService = (instance, opts, done) => {
  instance.register(router, opts);
  done();
};

export default fp(invitesService);
