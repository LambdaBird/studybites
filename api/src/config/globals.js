export const jwt = {
  ACCESS_JWT_EXPIRES_IN: 60 * 5,
  REFRESH_JWT_EXPIRES_IN: 60 * 60 * 24 * 7,
};

export const roles = {
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
};

export const searchLimits = {
  USER_SEARCH_LIMIT: 10,
  LESSON_SEARCH_LIMIT: 10,
};

export const resources = {
  LESSON: {
    name: 'lessons',
    status: ['Draft', 'Public', 'Private', 'Archived'],
    learnStatus: ['Public', 'Draft'],
  },
};

export const blockConstants = {
  INTERACTIVE_BLOCKS: ['next', 'quiz'],
  ACTIONS: ['start', 'finish', 'resume', 'next', 'response'],
  INTERACTIVE_ACTIONS: ['next', 'response'],
};

export const ajv = {
  removeAdditional: true,
  useDefaults: true,
  coerceTypes: true,
};

export const RESOURCE_NOT_FOUND = 'route.errors.not_found';
