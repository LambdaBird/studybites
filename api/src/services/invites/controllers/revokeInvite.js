import { BadRequestError } from '../../../validation/errors';

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
  async onRequest(req) {
    await this.auth({ req });
  },
  async preHandler({ user, params }) {
    const {
      models: { Invite },
      config: {
        globals: { roles },
      },
    } = this;

    const invite = await Invite.query()
      .findById(params.inviteId)
      .throwIfNotFound({ error: new BadRequestError('invalid invite') });

    await this.access({
      userId: user.id,
      resourceId: invite.resourceId,
      resourceType: invite.resourceType,
      roleId: roles.MAINTAINER.id,
    });
  },
};

async function handler({ params }) {
  const {
    models: { Invite },
  } = this;

  await Invite.query().findById(params.inviteId).patch({ status: 'revoked' });

  return { message: 'success' };
}

export default { options, handler };
