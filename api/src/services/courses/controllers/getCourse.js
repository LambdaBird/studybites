const options = {
  schema: {
    params: { $ref: 'paramsCourseId#' },
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
          course: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              name: { type: 'string' },
              description: { type: ['string', 'null'] },
              status: { type: 'string' },
              image: { type: ['string', 'null'] },
              isEnrolled: { type: 'boolean' },
              author: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  firstName: { type: 'string' },
                  lastName: { type: 'string' },
                },
              },
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

async function handler({ params: { courseId }, user: { id: userId } }) {
  const {
    models: { Course, ResourceKeyword },
    config: {
      globals: { resources },
    },
  } = this;

  const keywords = await ResourceKeyword.getResourceKeywords({
    resourceId: courseId,
    resourceType: resources.COURSE.name,
  });
  const course = await Course.getCourseWithAuthor({ courseId, userId });

  return { course, keywords };
}

export default { options, handler };
