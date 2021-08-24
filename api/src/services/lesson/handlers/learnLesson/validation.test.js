import Ajv from 'ajv';

import { ajv as ajvConfig } from '../../../../config';

import { learnLessonOptions } from './options';

describe('Test learnLesson validation', () => {
  const ajv = new Ajv(ajvConfig);
  const validate = ajv.compile(learnLessonOptions.schema.body);

  test('should return an error when no action', () => {
    const data = {
      key: 'value',
    };

    const valid = validate(data);
    if (!valid) {
      expect(validate.errors).toBeInstanceOf(Array);
      expect(validate.errors).toHaveLength(1);
      expect(validate.errors[0].message).toContain('action');
    }
  });

  test('should return no error if action is not interactive', () => {
    const data = {
      action: 'start',
    };

    const valid = validate(data);
    expect(valid).toBe(true);
  });

  test.each([
    [
      'blockId',
      {
        action: 'response',
        revision: 'revision',
        data: {
          answers: [true],
        },
      },
    ],
    [
      'revision',
      {
        action: 'response',
        blockId: 'blockId',
        data: {
          answers: [true],
        },
      },
    ],
    [
      'reply',
      {
        action: 'response',
        blockId: 'blockId',
        revision: 'revision',
      },
    ],
  ])('should return an error when no %s', (expected, payload) => {
    const valid = validate(payload);
    if (!valid) {
      expect(validate.errors).toBeInstanceOf(Array);
      expect(validate.errors).toHaveLength(1);
      expect(validate.errors[0].message).toContain(expected);
    }
  });
});
