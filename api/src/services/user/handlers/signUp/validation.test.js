import Ajv from 'ajv';

import { ajv as ajvConfig } from '../../../../config';
import { passwordPattern } from '../../../../validation/schemas';

import { signUpOptions } from './options';

describe('Test signIn validation', () => {
  const schema = signUpOptions.schema.body;
  schema.properties.password = passwordPattern;

  const ajv = new Ajv(ajvConfig);
  const validate = ajv.compile(schema);

  test.each([
    [
      'email',
      {
        password: 'password123#E',
        firstName: 'firstName',
        lastName: 'lastName',
      },
    ],
    [
      'password',
      { email: 'email@test.io', firstName: 'firstName', lastName: 'lastName' },
    ],
    [
      'firstName',
      {
        email: 'email@test.io',
        password: 'password123#E',
        lastName: 'lastName',
      },
    ],
    [
      'lastName',
      {
        email: 'email@test.io',
        password: 'password123#E',
        firstName: 'firstName',
      },
    ],
  ])('should return an error if no %s', (expected, payload) => {
    const valid = validate(payload);
    if (!valid) {
      expect(validate.errors).toBeInstanceOf(Array);
      expect(validate.errors).toHaveLength(1);
      expect(validate.errors[0].message).toContain(expected);
    }
  });

  test('should return an error if password is invalid', () => {
    const data = {
      email: 'email@test.io',
      password: 'pwd',
      firstName: 'firstName',
      lastName: 'lastName',
    };

    const valid = validate(data);
    if (!valid) {
      expect(validate.errors).toBeInstanceOf(Array);
      expect(validate.errors).toHaveLength(1);
      expect(validate.errors[0].message).toContain('pattern');
    }
  });

  test('should return no errors if body is valid', () => {
    const data = {
      email: 'email@test.io',
      password: 'passwd3',
      firstName: 'firstName',
      lastName: 'lastName',
    };

    const valid = validate(data);
    expect(valid).toBe(true);
  });
});
