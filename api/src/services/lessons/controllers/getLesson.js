const options = {
  schema: {
    params: { $ref: 'paramsLessonId#' },
    response: {
      200: {
        type: 'object',
        properties: {
          keywords: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'number' },
                name: { type: 'string' },
              },
            },
          },
          lesson: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              name: { type: 'string' },
              description: { type: ['string', 'null'] },
              image: { type: ['string', 'null'] },
              status: { type: 'string' },
              createdAt: { type: 'string' },
              updatedAt: { type: 'string' },
              author: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  firstName: { type: 'string' },
                  lastName: { type: 'string' },
                },
              },
              blocks: { type: ['array', 'null'] },
            },
          },
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

async function handler({ params: { lessonId } }) {
  const {
    models: { Lesson, ResourceKeyword },
    config: {
      globals: { resources },
    },
  } = this;

  const lesson = await Lesson.getLessonWithAuthor({ lessonId });
  const keywords = await ResourceKeyword.getResourceKeywords({
    resourceId: lessonId,
    resourceType: resources.LESSON.name,
  });

  return { lesson, keywords };
}

export default { options, handler };
