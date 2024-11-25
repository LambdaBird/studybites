const options = {
  schema: {
    params: { $ref: 'paramsLessonId#' },
    body: {
      type: 'object',
      properties: {
        resultId: { type: 'string' },
        correctness: { type: 'number' },
      },
      required: ['resultId', 'correctness'],
    },
    response: {
      '4xx': { $ref: '4xx#' },
      '5xx': { $ref: '5xx#' },
    },
  },
  async onRequest(req) {
    await this.auth({ req });
  },
  async preHandler({ user, params }) {
    const { resources, roles } = this.config.globals;

    await this.access({
      userId: user.id,
      resourceId: params.lessonId,
      resourceType: resources.LESSON.name,
      roleId: roles.MAINTAINER.id,
    });
  },
};

async function handler({ body, user }) {
  const {
    models: { Result },
    config: {
      lessonService: { lessonServiceMessages: messages },
    },
  } = this;

  await Result.setCorrectness({
    resultId: body.resultId,
    correctness: body.correctness,
    meta: {
      reviewer: user.id,
      reviewedAt: new Date().toISOString(),
    },
  });

  return { message: messages.LESSON_MSG_SUCCESS_REVIEW };
}

export default { options, handler };
