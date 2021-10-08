import Ajv from 'ajv';

import { ajv as ajvConfig } from '../config';

import { lessonIdParam, lessonSearch, userSearch } from './schemas';

describe('Test lessonIdParam validation', () => {
  const ajv = new Ajv(ajvConfig);
  const validate = ajv.compile(lessonIdParam);

  test('should return an error if no lessonId', () => {
    const data = {
      id: 3,
    };

    const valid = validate(data);
    if (!valid) {
      expect(validate.errors).toBeInstanceOf(Array);
      expect(validate.errors).toHaveLength(1);
      expect(validate.errors[0].message).toContain('lessonId');
    }
  });

  test('should return an error if lessonId is not a number', () => {
    const data = {
      lessonId: 'id',
    };

    const valid = validate(data);
    if (!valid) {
      expect(validate.errors).toBeInstanceOf(Array);
      expect(validate.errors).toHaveLength(1);
      expect(validate.errors[0].message).toContain('number');
    }
  });

  test('should return no error', () => {
    const data = {
      lessonId: 3,
    };

    const valid = validate(data);
    expect(valid).toBe(true);
  });

  test('should parse string as a number and return no error', () => {
    const data = {
      lessonId: '3',
    };

    const valid = validate(data);
    expect(valid).toBe(true);
  });
});

describe('Test lessonSearch validation', () => {
  const ajv = new Ajv(ajvConfig);
  const validate = ajv.compile(lessonSearch);

  test.each([
    ['search', 'string'],
    ['offset', 'number'],
    ['limit', 'number'],
  ])('should return an error if %s is not a %', (property, expected) => {
    const data = {
      [property]: [true],
    };

    const valid = validate(data);
    if (!valid) {
      expect(validate.errors).toBeInstanceOf(Array);
      expect(validate.errors).toHaveLength(1);
      expect(validate.errors[0].message).toContain(expected);
    }
  });

  test.each([
    { search: 'search' },
    { offset: 3 },
    { limit: 3 },
    { offset: 3, limit: 3 },
  ])('should return no error', (data) => {
    const valid = validate(data);
    expect(valid).toBe(true);
  });

  test.each([
    ['int', 'a string', { search: 1 }],
    ['string', 'an int', { offset: '3' }],
    ['string', 'an int', { limit: '3' }],
    ['string', 'an int', { offset: '3', limit: '3' }],
  ])('should parse %s as %s and return no error', (_, __, data) => {
    const valid = validate(data);
    expect(valid).toBe(true);
  });
});

describe('Test userSearch validation', () => {
  const ajv = new Ajv(ajvConfig);
  const validate = ajv.compile(userSearch);

  test.each([
    ['search', 'string'],
    ['offset', 'number'],
    ['limit', 'number'],
  ])('should return an error if %s is not a %', (property, expected) => {
    const data = {
      [property]: [true],
    };

    const valid = validate(data);
    if (!valid) {
      expect(validate.errors).toBeInstanceOf(Array);
      expect(validate.errors).toHaveLength(1);
      expect(validate.errors[0].message).toContain(expected);
    }
  });

  test.each([
    { search: 'search' },
    { offset: 3 },
    { limit: 3 },
    { offset: 3, limit: 3 },
  ])('should return no error', (data) => {
    const valid = validate(data);
    expect(valid).toBe(true);
  });

  test.each([
    ['int', 'a string', { search: 1 }],
    ['string', 'an int', { offset: '3' }],
    ['string', 'an int', { limit: '3' }],
    ['string', 'an int', { offset: '3', limit: '3' }],
  ])('should parse %s as %s and return no error', (_, __, data) => {
    const valid = validate(data);
    expect(valid).toBe(true);
  });
});
