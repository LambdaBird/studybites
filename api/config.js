export default {
  jwt: {
    ACCESS_JWT_EXPIRES_IN: 1000 * 60,
    REFRESH_JWT_EXPIRES_IN: 1000 * 60,
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
};
