import resourceInvites from './controllers/resourceInvites';
import createInvite from './controllers/createInvite';
import revokeInvite from './controllers/revokeInvite';
import getInvite from './controllers/getInvite';

export async function router(instance) {
  instance.get('/', resourceInvites.options, resourceInvites.handler);
  instance.post('/', createInvite.options, createInvite.handler);
  instance.delete('/:inviteId', revokeInvite.options, revokeInvite.handler);
  instance.get('/:inviteId', getInvite.options, getInvite.handler);
}
