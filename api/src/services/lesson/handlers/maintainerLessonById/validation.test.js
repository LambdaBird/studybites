import Ajv from 'ajv';

import config from '../../../../../config';

import { maintainerLessonByIdOptions } from './options';

const LESSONID_REQUIRED = "must have required property 'lessonId'";
const LESSONID_TYPE = 'must be number';

describe('Test maintainerLessonById validation', () => {
  const ajv = new Ajv(config.ajv);
  const validate = ajv.compile(maintainerLessonByIdOptions.schema.params);

  test('should return an error if no lessonId', () => {
    const data = {
      id: 3,
    };

    const valid = validate(data);
    if (!valid) {
      expect(validate.errors).toBeInstanceOf(Array);
      expect(validate.errors).toHaveLength(1);
      expect(validate.errors[0].message).toBe(LESSONID_REQUIRED);
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
      expect(validate.errors[0].message).toBe(LESSONID_TYPE);
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
