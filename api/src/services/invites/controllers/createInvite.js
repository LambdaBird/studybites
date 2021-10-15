const options = {
  schema: {
    body: {
      type: 'object',
      properties: {
        resourceId: { type: 'integer' },
        resourceType: { type: 'string' },
        emails: {
          type: 'array',
          default: [],
          items: {
            type: 'string',
          },
        },
      },
      required: ['resourceId', 'resourceType', 'emails'],
    },
  },
  async onRequest(req) {
    await this.auth({ req });
  },
  async preHandler({ user, body }) {
    const {
      models: { Lesson, Course },
      config: {
        globals: { roles, resources },
      },
    } = this;

    await this.access({
      userId: user.id,
      resourceId: body.resourceId,
      resourceType: body.resourceType,
      roleId: roles.MAINTAINER.id,
    });

    const isLesson = body.resourceType === resources.LESSON.name;
    await (isLesson ? Lesson : Course)
      .query()
      .first()
      .where({
        id: body.resourceId,
        status: 'Private',
      })
      .throwIfNotFound();
  },
};

async function handler({ body }) {
  const {
    models: { Invite },
  } = this;
  // trx
  let data;

  if (body.emails.length) {
    await Invite.query()
      .patch({ status: 'revoked' })
      .where({
        resource_id: body.resourceId,
        resource_type: body.resourceType,
        status: 'pending',
      })
      .whereIn('email', body.emails)
      .returning('*');

    data = body.emails.map((email) => ({
      resource_id: body.resourceId,
      resource_type: body.resourceType,
      status: 'pending',
      email,
    }));
  } else {
    await Invite.query()
      .patch({ status: 'revoked' })
      .where({
        resource_id: body.resourceId,
        resource_type: body.resourceType,
        status: 'pending',
      })
      .whereNull('email')
      .returning('*');

    data = {
      resource_id: body.resourceId,
      resource_type: body.resourceType,
      status: 'pending',
    };
  }

  const invites = await Invite.query()
    .skipUndefined()
    .insert(data)
    .returning('*');

  // send email here

  return {
    invites: invites.map?.((invite) => ({
      email: invite.email,
      invite: invite.id,
    })) || [{ email: invites.email, invite: invites.id }],
  };
}

export default { options, handler };
