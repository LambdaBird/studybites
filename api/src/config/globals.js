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
  actions: {
    START: 'start',
    FINISH: 'finish',
    NEXT: 'next',
    RESPONSE: 'response',
  },
  get INTERACTIVE_ACTIONS() {
    return [this.actions.NEXT, this.actions.RESPONSE];
  },
  blocks: {
    PARAGRAPH: 'paragraph',
    IMAGE: 'image',
    NEXT: 'next',
    QUIZ: 'quiz',
  },
  get INTERACTIVE_BLOCKS() {
    return [this.blocks.NEXT, this.blocks.QUIZ];
  },
};

export const ajv = {
  removeAdditional: true,
  useDefaults: true,
  coerceTypes: true,
};

export const patterns = {
  PASSWORD: '^(?=.*\\d)(?=.*\\D).{5,}$',
};

export const globalErrors = {
  GLOBAL_ERR_RESOURCE_NOT_FOUND: 'errors.not_found',
  GLOBAL_ERR_INTERNAL_SERVER_ERROR: 'errors.internal_server_error',
  GLOBAL_ERR_DATA_ERROR: 'errors.data_error',
  GLOBAL_ERR_CHECK_VIOLATION: 'errors.check_violation',
  GLOBAL_ERR_FOREIGN_VIOLATION: 'errors.foreign_violation',
  GLOBAL_ERR_NOT_NULL_VIOLATION: 'errors.not_null_violation',
  GLOBAL_ERR_UNIQUE_VIOLATION: 'errors.unique_violation',
  GLOBAL_ERR_NOT_FOUND: 'errors.not_found',
  GLOBAL_ERR_VALIDATION_ERROR: 'errors.validation',
};
