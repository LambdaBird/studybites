import {
  propertyTypeError,
  requiredPropertyError,
} from '../../src/validation/helpers';
import {
  signupBodyValidator,
  signinBodyValidator,
  patchBodyValidator,
  validateId,
  roleBodyValidator,
} from '../../src/services/user/validators';
import {
  INVALID_EMAIL,
  INVALID_ID,
  INVALID_PASSWORD,
} from '../../src/services/user/constants';
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
      propertyTypeError('signup', 'email', 'string'),
    ],
    [
      'password',
      {
        email: 'valid@test.io',
        password: [123],
        firstName: 'Valid',
        secondName: 'Valid',
      },
      propertyTypeError('signup', 'password', 'string'),
    ],
    [
      'firstName',
      {
        email: 'valid@test.io',
        password: 'valid3',
        firstName: [123],
        secondName: 'Valid',
      },
      propertyTypeError('signup', 'firstName', 'string'),
    ],
    [
      'secondName',
      {
        email: 'valid@test.io',
        password: 'valid3',
        firstName: 'Valid',
        secondName: [123],
      },
      propertyTypeError('signup', 'secondName', 'string'),
    ],
  ])(
    'should return ValidationError for invalid type of %s',
    (_, payload, expected) => {
      signupBodyValidator.validate(payload, options).catch((err) => {
        expect(err.errors[0]).toMatchObject(expected);
      });
    },
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
        message: INVALID_EMAIL,
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
        message: INVALID_PASSWORD,
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
        message: INVALID_PASSWORD,
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
        message: INVALID_PASSWORD,
      });
    });
  });
});

describe('Test signin body validation:', () => {
  test.each([
    [
      'email',
      { password: 'valid3', firstName: 'Valid', secondName: 'Valid' },
      requiredPropertyError('signin', 'email'),
    ],
    [
      'password',
      { email: 'valid@test.io', firstName: 'Valid', secondName: 'Valid' },
      requiredPropertyError('signin', 'password'),
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
      propertyTypeError('signin', 'email', 'string'),
    ],
    [
      'password',
      {
        email: 'valid@test.io',
        password: [123],
        firstName: 'Valid',
        secondName: 'Valid',
      },
      propertyTypeError('signin', 'password', 'string'),
    ],
  ])(
    'should return ValidationError for invalid type of %s',
    (_, payload, expected) => {
      signinBodyValidator.validate(payload, options).catch((err) => {
        expect(err.errors[0]).toMatchObject(expected);
      });
    },
  );
});

describe('Test user patch body validation:', () => {
  test.each([
    [
      'email',
      {
        email: [123],
        password: 'valid3',
        firstName: 'Valid',
        secondName: 'Valid',
      },
      propertyTypeError('patch', 'email', 'string'),
    ],
    [
      'password',
      {
        email: 'valid@test.io',
        password: [123],
        firstName: 'Valid',
        secondName: 'Valid',
      },
      propertyTypeError('patch', 'password', 'string'),
    ],
    [
      'firstName',
      {
        email: 'valid@test.io',
        password: 'valid3',
        firstName: [123],
        secondName: 'Valid',
      },
      propertyTypeError('patch', 'firstName', 'string'),
    ],
    [
      'secondName',
      {
        email: 'valid@test.io',
        password: 'valid3',
        firstName: 'Valid',
        secondName: [123],
      },
      propertyTypeError('patch', 'secondName', 'string'),
    ],
    [
      'isConfirmed',
      {
        email: 'valid@test.io',
        password: 'valid3',
        firstName: 'Valid',
        isConfirmed: 'not a bool',
      },
      propertyTypeError('patch', 'isConfirmed', 'bool'),
    ],
    [
      'isSuperAdmin',
      {
        email: 'valid@test.io',
        password: 'valid3',
        firstName: 'Valid',
        isSuperAdmin: 'not a bool',
      },
      propertyTypeError('patch', 'isSuperAdmin', 'bool'),
    ],
  ])(
    'should return ValidationError for invalid type of %s',
    (_, payload, expected) => {
      patchBodyValidator.validate(payload, options).catch((err) => {
        expect(err.errors[0]).toMatchObject(expected);
      });
    },
  );

  test('should return ValidationError for invalid email format', () => {
    const data = {
      email: 'invalid@test',
      password: 'valid3',
      firstName: 'Valid',
      secondName: 'Valid',
    };

    patchBodyValidator.validate(data, options).catch((err) => {
      expect(err.errors[0]).toMatchObject({
        key: 'patch.errors.email_format_err',
        message: INVALID_EMAIL,
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

    patchBodyValidator.validate(data, options).catch((err) => {
      expect(err.errors[0]).toMatchObject({
        key: 'patch.errors.password_regexp_err',
        message: INVALID_PASSWORD,
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

    patchBodyValidator.validate(data, options).catch((err) => {
      expect(err.errors[0]).toMatchObject({
        key: 'patch.errors.password_regexp_err',
        message: INVALID_PASSWORD,
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

    patchBodyValidator.validate(data, options).catch((err) => {
      expect(err.errors[0]).toMatchObject({
        key: 'patch.errors.password_regexp_err',
        message: INVALID_PASSWORD,
      });
    });
  });

  test.each([
    ['paramId and userId are equal', 1, 1],
    ['paramId is not a number', 'not a number', 1],
  ])('should return ValidationError if %s', (_, paramId, userId) => {
    try {
      validateId(paramId, userId);
    } catch (err) {
      expect(err.errors[0]).toMatchObject(INVALID_ID);
    }
  });
});

describe('Test role body validation:', () => {
  test('should return ValidationError if id is missing', () => {
    const data = {};

    roleBodyValidator.validate(data, options).catch((err) => {
      expect(err.errors[0]).toMatchObject(requiredPropertyError('role', 'id'));
    });
  });

  test('should return ValidationError if id is invalid', () => {
    const data = {
      id: 'not a number',
    };

    roleBodyValidator.validate(data, options).catch((err) => {
      expect(err.errors[0]).toMatchObject(
        propertyTypeError('role', 'id', 'integer'),
      );
    });
  });
});
