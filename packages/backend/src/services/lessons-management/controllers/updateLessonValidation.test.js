import Ajv from 'ajv';

import { ajv as ajvConfig } from '../../../config';
import { lessonStatus } from '../../../validation/schemas';

import updateLesson from './updateLesson';

const { options } = updateLesson;

describe('Test updateLesson validation', () => {
  const schema = options.schema.body;
  schema.properties.lesson.properties.status = lessonStatus;

  const ajv = new Ajv(ajvConfig);
  const validate = ajv.compile(schema);

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

  test('should return an error if status is not in enum', () => {
    const data = {
      lesson: {
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
});
