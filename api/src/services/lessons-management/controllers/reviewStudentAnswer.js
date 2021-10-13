const options = {
  schema: {
    params: { $ref: 'paramsLessonId#' },
    body: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        correctness: { type: 'number' },
      },
      required: ['id', 'correctness'],
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

async function handler({ body }) {
  const {
    models: { Result },
    config: {
      lessonService: { lessonServiceMessages: messages },
    },
  } = this;

  await Result.setCorrectness({
    resultId: body.id,
    correctness: body.correctness,
  });

  return { message: messages.LESSON_MSG_SUCCESS_REVIEW };
}

export default { options, handler };
