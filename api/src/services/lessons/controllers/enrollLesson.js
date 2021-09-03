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
};

async function handler({ user: { id: userId }, params: { lessonId } }) {
  const {
    config: {
      lessonService: { lessonServiceMessages: messages },
    },
    models: { Lesson, UserRole },
  } = this;

  await Lesson.checkIfEnrolled({ lessonId, userId });
  await UserRole.enrollToLesson({ userId, lessonId });

  return { message: messages.LESSON_MSG_SUCCESS_ENROLL };
}

export default { options, handler };
