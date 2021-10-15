import { BadRequestError } from '../../../validation/errors';

const options = {
  schema: {
    params: { $ref: 'paramsLessonId#' },
    response: {
      200: {
        type: 'object',
        properties: {
          key: { type: 'string' },
          message: { type: 'string' },
        },
      },
      '4xx': { $ref: '4xx#' },
      '5xx': { $ref: '5xx#' },
    },
  },
  async onRequest(req) {
    await this.auth({ req });
  },
  async preHandler(req) {
    const {
      models: { Invite },
      config: {
        lessonService: { lessonServiceErrors: errors },
      },
    } = this;

    const { body, params, user } = req;

    if (body?.invite) {
      const invite = await Invite.query()
        .first()
        .where({
          id: body.invite,
          resource_id: params.lessonId,
          resource_type: 'lesson',
          status: 'pending',
        })
        .throwIfNotFound({
          error: new BadRequestError(errors.LESSON_ERR_FAIL_ENROLL),
        });

      if (invite.email) {
        req.params.isInvite = true;
        if (invite.email !== user.email) {
          throw new BadRequestError(errors.LESSON_ERR_FAIL_ENROLL);
        }
      }
    }
  },
};

async function handler({
  user: { id: userId },
  params: { lessonId, isInvite },
  body,
}) {
  const {
    config: {
      lessonService: { lessonServiceMessages: messages },
      globals: { resources },
    },
    models: { UserRole, Invite },
  } = this;
  // trx
  await UserRole.enrollToResource({
    userId,
    resourceId: lessonId,
    resourceType: resources.LESSON.name,
    resourceStatuses: body?.invite
      ? [...resources.LESSON.enrollStatuses, 'Private']
      : resources.LESSON.enrollStatuses,
  });

  if (isInvite) {
    await Invite.query().findById(body.invite).patch({ status: 'success' });
  }

  return { message: messages.LESSON_MSG_SUCCESS_ENROLL };
}

export default { options, handler };
