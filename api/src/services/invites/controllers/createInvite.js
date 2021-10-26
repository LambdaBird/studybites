import { inviteEmail } from '../bull';

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

    if (body.emails.length) {
      body.emails.map((email) => this.validateEmail({ email }));
    }

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

function sendInvites({ data, host }) {
  data.map(async (invite) =>
    inviteEmail({ email: invite.email, link: `${host}/invite=${invite.id}` }),
  );
}

async function handler({ body, headers }) {
  const {
    models: { Invite },
    config: {
      globals: { invitesStatuses },
    },
    emailModel,
  } = this;

  const invites = await Invite.transaction(async (trx) => {
    await Invite.revokeInvites({
      trx,
      resourceId: body.resourceId,
      resourceType: body.resourceType,
      emails: body.emails,
    });

    const data = body.emails.length
      ? body.emails.map((email) => ({
          resource_id: body.resourceId,
          resource_type: body.resourceType,
          status: invitesStatuses.PENDING,
          email,
        }))
      : {
          resource_id: body.resourceId,
          resource_type: body.resourceType,
          status: invitesStatuses.PENDING,
        };

    const createdInvites = await Invite.createInvites({ trx, data });

    if (data.length) {
      const host = headers['x-forwarded-host'];
      await sendInvites({ emailModel, data: createdInvites, host });
    }

    return createdInvites;
  });

  if (invites.length) {
    return {
      invites: invites.map((invite) => ({
        email: invite.email,
        invite: invite.id,
      })),
    };
  }
  return { invites: [{ email: invites.email, invite: invites.id }] };
}

export default { options, handler };
