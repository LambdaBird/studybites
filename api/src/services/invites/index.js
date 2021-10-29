import fp from 'fastify-plugin';

import { router } from './routes';
import { processInvite } from './hooks';

const invitesService = (instance, opts, done) => {
  instance.register(router, opts);
  instance.decorate('processInvite', processInvite);
  done();
};

export default fp(invitesService);
