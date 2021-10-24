const options = {
  schema: {
    params: { $ref: 'paramsCourseId#' },
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
      resourceType: resources.COURSE.name,
      resourceId: req.params.courseId,
    });
  },
};

async function handler({
  user: { id: userId },
  params: { courseId, isInvite },
  body,
}) {
  const {
    config: {
      courseService: { courseServiceMessages: messages },
      globals: { resources },
    },
    models: { UserRole, Invite },
  } = this;

  await UserRole.transaction(async (trx) => {
    await UserRole.enrollToResource({
      trx,
      userId,
      resourceId: courseId,
      resourceType: resources.COURSE.name,
      resourceStatuses: body?.invite
        ? [...resources.COURSE.enrollStatuses, 'Private']
        : resources.COURSE.enrollStatuses,
    });

    if (isInvite) {
      await Invite.setInviteSuccess({ trx, inviteId: body.invite });
    }
  });

  return { message: messages.COURSE_MSG_SUCCESS_ENROLL };
}

export default { options, handler };
