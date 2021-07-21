export default {
  jwt: {
    ACCESS_JWT_EXPIRES_IN: 60 * 5,
    REFRESH_JWT_EXPIRES_IN: 60 * 60 * 24 * 7,
  },
  roles: {
    TEACHER: {
      id: 1,
      name: 'Teacher',
    },
    MAINTAINER: {
      id: 2,
      name: 'Maintainer',
    },
    STUDENT: {
      id: 3,
      name: 'Student',
    },
  },
  search: {
    USER_SEARCH_LIMIT: 10,
    LESSON_SEARCH_LIMIT: 10,
  },
  resources: {
    LESSON: 'lesson',
  },
  interactiveBlocks: ['next', 'quiz'],
  actions: ['start', 'finish', 'resume', 'next', 'response'],
  interactiveActions: ['next', 'response'],
  lessonStatuses: ['Draft', 'Public', 'Private', 'Archived'],
  ajv: {
    /**
     * default ajv configuration used by fastify
     * https://www.fastify.io/docs/latest/Validation-and-Serialization/
     */
    removeAdditional: true,
    useDefaults: true,
    coerceTypes: true,
  },
};
