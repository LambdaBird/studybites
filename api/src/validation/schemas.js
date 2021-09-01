import { searchLimits, resources, patterns } from '../config';

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
    limit: { type: 'number', default: searchLimits.LESSON_SEARCH_LIMIT },
    tags: { type: 'array', items: { type: 'number' } },
  },
};

export const userSearch = {
  type: 'object',
  properties: {
    search: { type: 'string' },
    offset: { type: 'number', default: 0 },
    limit: { type: 'number', default: searchLimits.USER_SEARCH_LIMIT },
  },
};

export const keywordSearch = {
  type: 'object',
  properties: {
    search: { type: 'string' },
    offset: { type: 'number', default: 0 },
    limit: { type: 'number', default: searchLimits.KEYWORD_SEARCH_LIMIT },
  },
};

export const lessonStatus = {
  type: 'string',
  enum: resources.LESSON.status,
};

export const passwordPattern = {
  type: 'string',
  pattern: patterns.PASSWORD,
};
