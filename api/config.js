export default {
  jwt: {
    ACCESS_JWT_EXPIRES_IN: '12h',
    REFRESH_JWT_EXPIRES_IN: '3d',
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
  },
};
