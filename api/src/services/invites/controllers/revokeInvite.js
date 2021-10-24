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

    const invite = await Invite.getInviteById({ inviteId: params.inviteId });

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
    config: {
      invitesService: { invitesServiceMessages: messages },
    },
  } = this;

  await Invite.revokeOneInvite({ inviteId: params.inviteId });

  return { message: messages.INVITE_MSG_REVOKE_SUCCESS };
}

export default { options, handler };
