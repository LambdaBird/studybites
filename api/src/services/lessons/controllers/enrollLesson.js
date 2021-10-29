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
      config: {
        globals: { resources },
      },
    } = this;
    await this.processInvite({
      req,
      resourceType: resources.LESSON.name,
      resourceId: req.params.lessonId,
    });
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

  await UserRole.transaction(async (trx) => {
    await UserRole.enrollToResource({
      trx,
      userId,
      resourceId: lessonId,
      resourceType: resources.LESSON.name,
      resourceStatuses: body?.invite
        ? [...resources.LESSON.enrollStatuses, 'Private']
        : resources.LESSON.enrollStatuses,
    });

    if (isInvite) {
      await Invite.setInviteSuccess({ trx, inviteId: body.invite });
    }
  });

  return { message: messages.LESSON_MSG_SUCCESS_ENROLL };
}

export default { options, handler };
