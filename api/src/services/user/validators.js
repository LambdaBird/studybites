import * as yup from 'yup';

import { INVALID_EMAIL, INVALID_PASSWORD, INVALID_ID } from './constants';

const emailValidatorSignup = yup.string().email(INVALID_EMAIL);

const passwordValidatorSignup = yup
  .string()
  .matches(/^(?=.*\d)(?=.*\D).{5,}$/, {
    message: INVALID_PASSWORD,
  });

const firstNameValidatorSignup = yup.string();

const lastNameValidatorSignup = yup.string();

const emailValidatorSignin = yup.string();

const passwordValidatorSignin = yup.string();

const emailValidatorPatch = yup.string().email(INVALID_EMAIL);

const passwordValidatorPatch = yup
  .string()
  .matches(/^(?=.*\d)(?=.*[a-zA-Z]).{5,}$/, {
    message: INVALID_PASSWORD,
  });

const firstNameValidatorPatch = yup.string();

const lastNameValidatorPatch = yup.string();

const isConfirmedPatch = yup.bool();

const isSuperAdminPatch = yup.bool();

const idRole = yup.number();

const tokenValidatorRefresh = yup.string();

export const signupBodyValidator = yup.object({
  email: emailValidatorSignup,
  password: passwordValidatorSignup,
  firstName: firstNameValidatorSignup,
  lastName: lastNameValidatorSignup,
});

export const signinBodyValidator = yup.object({
  email: emailValidatorSignin,
  password: passwordValidatorSignin,
});

export const patchBodyValidator = yup.object({
  email: emailValidatorPatch,
  password: passwordValidatorPatch,
  firstName: firstNameValidatorPatch,
  lastName: lastNameValidatorPatch,
  isConfirmed: isConfirmedPatch,
  isSuperAdmin: isSuperAdminPatch,
});

export const roleBodyValidator = yup.object({
  id: idRole,
});

export const refreshBodyValidator = yup.object({
  refreshToken: tokenValidatorRefresh,
});

export const validateId = (paramId, userId) => {
  const id = parseInt(paramId, 10);

  if (!id || id === userId) {
    throw new yup.ValidationError(INVALID_ID);
  }

  return id;
};
