import {
  propertyTypeError,
  requiredPropertyError,
} from '../../src/validation/helpers';
import {
  signupBodyValidator,
  signinBodyValidator,
} from '../../src/services/user/validators';
import { options } from '../../src/validation/validatorCompiler';

describe('Test signup body validation:', () => {
  test.each([
    [
      'email',
      { password: 'valid3', firstName: 'Valid', secondName: 'Valid' },
      requiredPropertyError('signup', 'email'),
    ],
    [
      'password',
      { email: 'valid@test.io', firstName: 'Valid', secondName: 'Valid' },
      requiredPropertyError('signup', 'password'),
    ],
    [
      'firstName',
      { email: 'valid@test.io', password: 'valid3', secondName: 'Valid' },
      requiredPropertyError('signup', 'firstName'),
    ],
    [
      'secondName',
      { email: 'valid@test.io', password: 'valid3', firstName: 'Valid' },
      requiredPropertyError('signup', 'secondName'),
    ],
  ])('should return ValidationError for missing %s', (_, payload, expected) => {
    signupBodyValidator.validate(payload, options).catch((err) => {
      expect(err.errors[0]).toMatchObject(expected);
    });
  });

  test.each([
    [
      'email',
      {
        email: [123],
        password: 'valid3',
        firstName: 'Valid',
        secondName: 'Valid',
      },
      propertyTypeError('signup', 'email'),
    ],
    [
      'password',
      {
        email: 'valid@test.io',
        password: [123],
        firstName: 'Valid',
        secondName: 'Valid',
      },
      propertyTypeError('signup', 'password'),
    ],
    [
      'firstName',
      {
        email: 'valid@test.io',
        password: 'valid3',
        firstName: [123],
        secondName: 'Valid',
      },
      propertyTypeError('signup', 'firstName'),
    ],
    [
      'secondName',
      {
        email: 'valid@test.io',
        password: 'valid3',
        firstName: 'Valid',
        secondName: [123],
      },
      propertyTypeError('signup', 'secondName'),
    ],
  ])(
    'should return ValidationError for invalid type of %s',
    (_, payload, expected) => {
      signupBodyValidator.validate(payload, options).catch((err) => {
        expect(err.errors[0]).toMatchObject(expected);
      });
    }
  );

  test('should return ValidationError for invalid email format', () => {
    const data = {
      email: 'invalid@test',
      password: 'valid3',
      firstName: 'Valid',
      secondName: 'Valid',
    };

    signupBodyValidator.validate(data, options).catch((err) => {
      expect(err.errors[0]).toMatchObject({
        key: 'signup.errors.email_format_err',
        message: 'Property "email" is invalid',
      });
    });
  });

  test('should return ValidationError if password length is less than 5 characters', () => {
    const data = {
      email: 'valid@test.io',
      password: 'inv3',
      firstName: 'Valid',
      secondName: 'Valid',
    };

    signupBodyValidator.validate(data, options).catch((err) => {
      expect(err.errors[0]).toMatchObject({
        key: 'signup.errors.password_regexp_err',
        message:
          'Property "password" must be longer than 5 characters and contain at least one number and one letter',
      });
    });
  });

  test('should return ValidationError if password doesn`t contain a number', () => {
    const data = {
      email: 'valid@test.io',
      password: 'invalid',
      firstName: 'Valid',
      secondName: 'Valid',
    };

    signupBodyValidator.validate(data, options).catch((err) => {
      expect(err.errors[0]).toMatchObject({
        key: 'signup.errors.password_regexp_err',
        message:
          'Property "password" must be longer than 5 characters and contain at least one number and one letter',
      });
    });
  });

  test('should return ValidationError if password doesn`t contain a letter', () => {
    const data = {
      email: 'valid@test.io',
      password: '12345',
      firstName: 'Valid',
      secondName: 'Valid',
    };

    signupBodyValidator.validate(data, options).catch((err) => {
      expect(err.errors[0]).toMatchObject({
        key: 'signup.errors.password_regexp_err',
        message:
          'Property "password" must be longer than 5 characters and contain at least one number and one letter',
      });
    });
  });
});

describe('Test signin body validation:', () => {
  test.each([
    [
      'email',
      { password: 'valid3', firstName: 'Valid', secondName: 'Valid' },
      requiredPropertyError('signup', 'email'),
    ],
    [
      'password',
      { email: 'valid@test.io', firstName: 'Valid', secondName: 'Valid' },
      requiredPropertyError('signup', 'password'),
    ],
  ])('should return ValidationError for missing %s', (_, payload, expected) => {
    signinBodyValidator.validate(payload, options).catch((err) => {
      expect(err.errors[0]).toMatchObject(expected);
    });
  });

  test.each([
    [
      'email',
      {
        email: [123],
        password: 'valid3',
        firstName: 'Valid',
        secondName: 'Valid',
      },
      propertyTypeError('signup', 'email'),
    ],
    [
      'password',
      {
        email: 'valid@test.io',
        password: [123],
        firstName: 'Valid',
        secondName: 'Valid',
      },
      propertyTypeError('signup', 'password'),
    ],
  ])(
    'should return ValidationError for invalid type of %s',
    (_, payload, expected) => {
      signinBodyValidator.validate(payload, options).catch((err) => {
        expect(err.errors[0]).toMatchObject(expected);
      });
    }
  );
});
