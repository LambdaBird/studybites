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

export const courseIdParam = {
  type: 'object',
  properties: {
    courseId: { type: 'number' },
  },
  required: ['courseId'],
};

export const lessonSearch = {
  type: 'object',
  properties: {
    search: { type: 'string' },
    offset: { type: 'number', default: 0 },
    limit: { type: 'number', default: searchLimits.LESSON_SEARCH_LIMIT },
    authors: { type: 'array', items: { type: 'number' } },
    progress: { type: 'string' },
    tags: { type: 'array', items: { type: 'number' } },
  },
};

export const courseSearch = {
  type: 'object',
  properties: {
    search: { type: 'string' },
    offset: { type: 'number', default: 0 },
    limit: { type: 'number', default: searchLimits.COURSE_SEARCH_LIMIT },
    status: { type: 'string' },
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

export const courseStatus = {
  type: 'string',
  enum: resources.COURSE.status,
};

export const passwordPattern = {
  type: 'string',
  pattern: patterns.PASSWORD,
};
