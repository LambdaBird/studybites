import Ajv from 'ajv';

import { ajv as ajvConfig } from '../../../config';
import { lessonStatus } from '../../../validation/schemas';

import createLesson from './createLesson';

const { options } = createLesson;

describe('Test createLessonSchema validation', () => {
  const schema = options.schema.body;
  schema.properties.lesson.properties.status = lessonStatus;

  const ajv = new Ajv(ajvConfig);
  const validate = ajv.compile(schema);

  test('should return an error if no lesson', () => {
    const data = {
      blocks: [],
    };

    const valid = validate(data);
    if (!valid) {
      expect(validate.errors).toBeInstanceOf(Array);
      expect(validate.errors).toHaveLength(1);
      expect(validate.errors[0].message).toContain('lesson');
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
      expect(validate.errors[0].message).toContain('object');
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
      expect(validate.errors[0].message).toContain('name');
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
      expect(validate.errors[0].message).toContain('than 1');
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
      expect(validate.errors[0].message).toContain('equal');
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
