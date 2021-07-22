import config from '../../config';

export const error4xx = {
  type: 'object',
  properties: {
    fallback: { type: 'string' },
    errors: { type: 'array' },
  },
};

export const error5xx = {
  type: 'object',
  properties: {
    fallback: { type: 'string' },
    errors: { type: 'array' },
  },
};

export const lessonIdParam = {
  type: 'object',
  properties: {
    lessonId: { type: 'number' },
  },
  required: ['lessonId'],
};

export const lessonSearch = {
  type: 'object',
  properties: {
    search: { type: 'string' },
    offset: { type: 'number', default: 0 },
    limit: { type: 'number', default: config.search.LESSON_SEARCH_LIMIT },
  },
};

export const userSearch = {
  type: 'object',
  properties: {
    search: { type: 'string' },
    offset: { type: 'number', default: 0 },
    limit: { type: 'number', default: config.search.USER_SEARCH_LIMIT },
  },
};

export const lessonStatus = {
  type: 'string',
  enum: config.lessonStatuses,
};
