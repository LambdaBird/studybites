import Ajv from 'ajv';

import { ajv as ajvConfig } from '../../../config';

import signIn from './signIn';

const { options: signInOptions } = signIn;

describe('Test signIn validation', () => {
  const schema = signInOptions.schema.body;

  const ajv = new Ajv(ajvConfig);
  const validate = ajv.compile(schema);

  test('should return an error if no email', () => {
    const data = {
      password: 'password',
    };

    const valid = validate(data);
    if (!valid) {
      expect(validate.errors).toBeInstanceOf(Array);
      expect(validate.errors).toHaveLength(1);
      expect(validate.errors[0].message).toContain('email');
    }
  });

  test('should return an error if no password', () => {
    const data = {
      email: 'email@test.io',
    };

    const valid = validate(data);
    if (!valid) {
      expect(validate.errors).toBeInstanceOf(Array);
      expect(validate.errors).toHaveLength(1);
      expect(validate.errors[0].message).toContain('password');
    }
  });

  test('should return no errors if body is valid', () => {
    const data = {
      email: 'email@test.io',
      password: 'passwd3',
    };

    const valid = validate(data);
    expect(valid).toBe(true);
  });
});
