import { EMPTY_BODY } from '../../../src/validation/validatorCompiler';

export const signupBodyValid = {
  email: 'valid@test.io',
  password: 'valid3',
  firstName: 'Valid',
  secondName: 'Valid',
};
export const signinBodyValid = {
  email: 'valid@test.io',
  password: 'valid3',
};
export const signinBodyAdmin = {
  email: 'admin@test.io',
  password: 'passwd3',
};
export const missingBody = {
  fallback: 'errors.validation_error',
  errors: [EMPTY_BODY],
};

export const signupBodyWrongEmail = {
  email: 'invalid@test.io',
  password: 'valid3',
};
export const signupBodyWrongPassword = {
  email: 'valid@test.io',
  password: 'invalid3',
};
