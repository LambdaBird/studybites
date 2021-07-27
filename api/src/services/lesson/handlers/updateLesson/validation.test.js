import Ajv from 'ajv';

import config from '../../../../../config';
import { lessonStatus } from '../../../../validation/schemas';

import { updateLessonOptions } from './options';

const NAME_LENGTH = 'should NOT be shorter than 1 characters';
const STATUS_ENUM = 'should be equal to one of the allowed values';

describe('Test updateLesson validation', () => {
  const schema = updateLessonOptions.schema.body;
  schema.properties.lesson.properties.status = lessonStatus;

  const ajv = new Ajv(config.ajv);
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
      expect(validate.errors[0].message).toBe(NAME_LENGTH);
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
      expect(validate.errors[0].message).toBe(STATUS_ENUM);
    }
  });
});
