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

  const invite = await Invite.getInviteById({ inviteId: params.inviteId });
  const user = await User.getUserByEmail({ email: invite.email });

  return {
    invite: invite.id,
    email: invite.email,
    resourceId: invite.resourceId,
    resourceType: invite.resourceType,
    isRegistered: !!user,
  };
}

export default { options, handler };
