import { NotFoundError } from '../../../validation/errors';

const options = {
  schema: {
    params: {
      type: 'object',
      properties: {
        inviteId: { type: 'string' },
      },
      required: ['inviteId'],
    },
  },
};

async function handler({ params }) {
  const {
    models: { Invite, User },
  } = this;

  const invite = await Invite.query()
    .findById(params.inviteId)
    .throwIfNotFound({ errors: new NotFoundError('err') });
  const user = await User.query().first().where({ email: invite.email });

  return {
    invite: invite.id,
    email: invite.email,
    resourceId: invite.resourceId,
    resourceType: invite.resourceType,
    isRegistered: !!user,
  };
}

export default { options, handler };
