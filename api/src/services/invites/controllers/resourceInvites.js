const options = {
  schema: {
    params: {
      type: 'object',
      properties: {
        resourceId: { type: 'integer' },
        resourceType: { type: 'string' },
      },
      required: ['resourceId', 'resourceType'],
    },
  },
};

async function handler({ params }) {
  const {
    models: { Invite },
  } = this;

  const invites = await Invite.getResourceInvites({
    resourceId: params.resourceId,
    resourceType: params.resourceType,
  });

  return { invites };
}

export default { options, handler };
