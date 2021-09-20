export const ONLY_CONSOLE = 1;
export const ONLY_EMAIL = 2;
export const CONSOLE_AND_EMAIL = 3;

export const DEBUG_EMAIL = ONLY_CONSOLE;

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
  COURSE_SEARCH_LIMIT: 10,
  KEYWORD_SEARCH_LIMIT: 10,
};

export const resources = {
  LESSON: {
    name: 'lesson',
    status: ['Draft', 'Public', 'Private', 'Archived', 'CourseOnly'],
    learnStatus: ['Public', 'Draft'],
    enrollStatuses: ['Public'],
    get courseEnrollStatuses() {
      return [...this.enrollStatuses, 'CourseOnly'];
    },
  },
  COURSE: {
    name: 'course',
    status: ['Draft', 'Public', 'Private', 'Archived'],
    learnStatus: ['Public'],
    enrollStatuses: ['Public'],
  },
};

export const blockConstants = {
  blocks: {
    PARAGRAPH: 'paragraph',
    IMAGE: 'image',
    EMBED: 'embed',
    HEADER: 'header',
    LIST: 'list',
    QUOTE: 'quote',
    DELIMITER: 'delimiter',
    MARKER: 'marker',
    TABLE: 'table',

    NEXT: 'next',
    QUIZ: 'quiz',
    CLOSED_QUESTION: 'closedQuestion',
    FILL_THE_GAP: 'fillTheGap',
    MATCH: 'match',
    BRICKS: 'bricks',
  },
  get BLOCKS_LIST() {
    return Object.values(this.blocks);
  },
  actions: {
    START: 'start',
    FINISH: 'finish',
    NEXT: 'next',
    RESPONSE: 'response',
  },
  get INTERACTIVE_ACTIONS() {
    return [this.actions.NEXT, this.actions.RESPONSE];
  },
  get INTERACTIVE_BLOCKS() {
    return [
      this.blocks.NEXT,
      this.blocks.QUIZ,
      this.blocks.CLOSED_QUESTION,
      this.blocks.FILL_THE_GAP,
      this.blocks.MATCH,
      this.blocks.BRICKS,
    ];
  },
  get STATIC_BLOCKS() {
    return this.BLOCKS_LIST.filter(
      (name) => !this.INTERACTIVE_BLOCKS.includes(name),
    );
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
