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
      { password: 'valid3', firstName: 'Valid', lastName: 'Valid' },
      requiredPropertyError('signup', 'email'),
    ],
    [
      'password',
      { email: 'valid@test.io', firstName: 'Valid', lastName: 'Valid' },
      requiredPropertyError('signup', 'password'),
    ],
    [
      'firstName',
      { email: 'valid@test.io', password: 'valid3', lastName: 'Valid' },
      requiredPropertyError('signup', 'firstName'),
    ],
    [
      'lastName',
      { email: 'valid@test.io', password: 'valid3', firstName: 'Valid' },
      requiredPropertyError('signup', 'lastName'),
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
        lastName: 'Valid',
      },
      propertyTypeError('signup', 'email', 'string'),
    ],
    [
      'password',
      {
        email: 'valid@test.io',
        password: [123],
        firstName: 'Valid',
        lastName: 'Valid',
      },
      propertyTypeError('signup', 'password', 'string'),
    ],
    [
      'firstName',
      {
        email: 'valid@test.io',
        password: 'valid3',
        firstName: [123],
        lastName: 'Valid',
      },
      propertyTypeError('signup', 'firstName', 'string'),
    ],
    [
      'lastName',
      {
        email: 'valid@test.io',
        password: 'valid3',
        firstName: 'Valid',
        lastName: [123],
      },
      propertyTypeError('signup', 'lastName', 'string'),
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
      lastName: 'Valid',
    };

    signupBodyValidator.validate(data, options).catch((err) => {
      expect(err.errors[0]).toMatchObject(INVALID_EMAIL);
    });
  });

  test('should return ValidationError if password length is less than 5 characters', () => {
    const data = {
      email: 'valid@test.io',
      password: 'inv3',
      firstName: 'Valid',
      lastName: 'Valid',
    };

    signupBodyValidator.validate(data, options).catch((err) => {
      expect(err.errors[0]).toMatchObject(INVALID_PASSWORD);
    });
  });

  test('should return ValidationError if password doesn`t contain a number', () => {
    const data = {
      email: 'valid@test.io',
      password: 'invalid',
      firstName: 'Valid',
      lastName: 'Valid',
    };

    signupBodyValidator.validate(data, options).catch((err) => {
      expect(err.errors[0]).toMatchObject(INVALID_PASSWORD);
    });
  });

  test('should return ValidationError if password doesn`t contain a letter', () => {
    const data = {
      email: 'valid@test.io',
      password: '12345',
      firstName: 'Valid',
      lastName: 'Valid',
    };

    signupBodyValidator.validate(data, options).catch((err) => {
      expect(err.errors[0]).toMatchObject(INVALID_PASSWORD);
    });
  });
});

describe('Test signin body validation:', () => {
  test.each([
    [
      'email',
      { password: 'valid3', firstName: 'Valid', lastName: 'Valid' },
      requiredPropertyError('signin', 'email'),
    ],
    [
      'password',
      { email: 'valid@test.io', firstName: 'Valid', lastName: 'Valid' },
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
        lastName: 'Valid',
      },
      propertyTypeError('signin', 'email', 'string'),
    ],
    [
      'password',
      {
        email: 'valid@test.io',
        password: [123],
        firstName: 'Valid',
        lastName: 'Valid',
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
        lastName: 'Valid',
      },
      propertyTypeError('patch', 'email', 'string'),
    ],
    [
      'password',
      {
        email: 'valid@test.io',
        password: [123],
        firstName: 'Valid',
        lastName: 'Valid',
      },
      propertyTypeError('patch', 'password', 'string'),
    ],
    [
      'firstName',
      {
        email: 'valid@test.io',
        password: 'valid3',
        firstName: [123],
        lastName: 'Valid',
      },
      propertyTypeError('patch', 'firstName', 'string'),
    ],
    [
      'lastName',
      {
        email: 'valid@test.io',
        password: 'valid3',
        firstName: 'Valid',
        lastName: [123],
      },
      propertyTypeError('patch', 'lastName', 'string'),
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
      lastName: 'Valid',
    };

    patchBodyValidator.validate(data, options).catch((err) => {
      expect(err.errors[0]).toMatchObject(INVALID_EMAIL);
    });
  });

  test('should return ValidationError if password length is less than 5 characters', () => {
    const data = {
      email: 'valid@test.io',
      password: 'inv3',
      firstName: 'Valid',
      lastName: 'Valid',
    };

    patchBodyValidator.validate(data, options).catch((err) => {
      expect(err.errors[0]).toMatchObject(INVALID_PASSWORD);
    });
  });

  test('should return ValidationError if password doesn`t contain a number', () => {
    const data = {
      email: 'valid@test.io',
      password: 'invalid',
      firstName: 'Valid',
      lastName: 'Valid',
    };

    patchBodyValidator.validate(data, options).catch((err) => {
      expect(err.errors[0]).toMatchObject(INVALID_PASSWORD);
    });
  });

  test('should return ValidationError if password doesn`t contain a letter', () => {
    const data = {
      email: 'valid@test.io',
      password: '12345',
      firstName: 'Valid',
      lastName: 'Valid',
    };

    patchBodyValidator.validate(data, options).catch((err) => {
      expect(err.errors[0]).toMatchObject(INVALID_PASSWORD);
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
