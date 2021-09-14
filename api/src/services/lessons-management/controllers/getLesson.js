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
              studentsCount: { type: 'number' },
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
              blocks: { type: 'array' },
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
  async preHandler({ user: { id: userId }, params: { lessonId: resourceId } }) {
    const { resources, roles } = this.config.globals;

    await this.access({
      userId,
      resourceId,
      resourceType: resources.LESSON.name,
      roleId: roles.MAINTAINER.id,
    });
  },
};

async function handler({ params: { lessonId } }) {
  const {
    models: { Lesson, LessonBlockStructure, UserRole, ResourceKeyword },
    config: {
      globals: { resources },
    },
  } = this;

  const lesson = await Lesson.findById({ lessonId });
  const { count: studentsCount } = await UserRole.getResourceStudentsCount({
    resourceId: lessonId,
    resourceType: resources.LESSON.name,
  });

  lesson.studentsCount = studentsCount;
  lesson.blocks = await LessonBlockStructure.getAllBlocks({ lessonId });
  const keywords = await ResourceKeyword.getResourceKeywords({
    resourceId: lessonId,
    resourceType: resources.LESSON.name,
  });
  return { lesson, keywords };
}

export default { options, handler };
