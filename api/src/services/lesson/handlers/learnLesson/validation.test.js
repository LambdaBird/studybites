import Ajv from 'ajv';

import config from '../../../../../config';

import { learnLessonOptions } from './options';

const ACTION_REQUIRED = "should have required property '.action'";
const BLOCKID_REQUIRED = "should have required property '.blockId'";
const REVISION_REQUIRED = "should have required property '.revision'";
const DATA_REQUIRED = "should have required property '.data'";

describe('Test learnLesson validation', () => {
  const ajv = new Ajv(config.ajv);
  const validate = ajv.compile(learnLessonOptions.schema.body);

  test('should return an error when no action', () => {
    const data = {
      key: 'value',
    };

    const valid = validate(data);
    if (!valid) {
      expect(validate.errors).toBeInstanceOf(Array);
      expect(validate.errors).toHaveLength(1);
      expect(validate.errors[0].message).toBe(ACTION_REQUIRED);
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
      BLOCKID_REQUIRED,
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
      REVISION_REQUIRED,
    ],
    [
      'data',
      {
        action: 'response',
        blockId: 'blockId',
        revision: 'revision',
      },
      DATA_REQUIRED,
    ],
  ])('should return an error when no %s', (_, payload, expected) => {
    const valid = validate(payload);
    if (!valid) {
      expect(validate.errors).toBeInstanceOf(Array);
      expect(validate.errors).toHaveLength(1);
      expect(validate.errors[0].message).toBe(expected);
    }
  });
});
