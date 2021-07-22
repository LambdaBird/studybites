import Ajv from 'ajv';

import config from '../../../../../config';
import { lessonStatus } from '../../../../validation/schemas';

import { createLessonOptions } from './options';

const LESSON_REQUIRED = "must have required property 'lesson'";
const LESSON_TYPE = 'must be object';
const NAME_REQUIRED = "must have required property 'name'";
const NAME_LENGTH = 'must NOT have fewer than 1 characters';
const STATUS_ENUM = 'must be equal to one of the allowed values';

describe('Test createLessonSchema validation', () => {
  const schema = createLessonOptions.schema.body;
  schema.properties.lesson.properties.status = lessonStatus;

  const ajv = new Ajv(config.ajv);
  const validate = ajv.compile(schema);

  test('should return an error if no lesson', () => {
    const data = {
      blocks: [],
    };

    const valid = validate(data);
    if (!valid) {
      expect(validate.errors).toBeInstanceOf(Array);
      expect(validate.errors).toHaveLength(1);
      expect(validate.errors[0].message).toBe(LESSON_REQUIRED);
    }
  });

  test('should return an error if lesson is not an object', () => {
    const data = {
      lesson: 'lesson',
    };

    const valid = validate(data);
    if (!valid) {
      expect(validate.errors).toBeInstanceOf(Array);
      expect(validate.errors).toHaveLength(1);
      expect(validate.errors[0].message).toBe(LESSON_TYPE);
    }
  });

  test('should return an error if lesson has no name', () => {
    const data = {
      lesson: {
        description: 'lesson',
      },
    };

    const valid = validate(data);
    if (!valid) {
      expect(validate.errors).toBeInstanceOf(Array);
      expect(validate.errors).toHaveLength(1);
      expect(validate.errors[0].message).toBe(NAME_REQUIRED);
    }
  });

  test('should return an error if name is an empty string', () => {
    const data = {
      lesson: {
        name: '',
      },
    };

    const valid = validate(data);
    if (!valid) {
      expect(validate.errors).toBeInstanceOf(Array);
      expect(validate.errors).toHaveLength(1);
      expect(validate.errors[0].message).toBe(NAME_LENGTH);
    }
  });

  test('should return no error', () => {
    const data = {
      lesson: {
        name: 'name',
      },
    };

    const valid = validate(data);
    expect(valid).toBe(true);
  });

  test('should return an error if status is not in enum', () => {
    const data = {
      lesson: {
        name: 'name',
        status: 'status',
      },
    };

    const valid = validate(data);
    if (!valid) {
      expect(validate.errors).toBeInstanceOf(Array);
      expect(validate.errors).toHaveLength(1);
      expect(validate.errors[0].message).toBe(STATUS_ENUM);
    }
  });

  test('should return no error', () => {
    const data = {
      lesson: {
        name: 'name',
        status: 'Public',
      },
    };

    const valid = validate(data);
    expect(valid).toBe(true);
  });
});
