import * as yup from 'yup';

import {
  propertyTypeError,
  requiredPropertyError,
} from '../../validation/helpers';

import { INVALID_EMAIL, INVALID_PASSWORD, INVALID_ID } from './constants';

const emailValidatorSignup = yup
  .string()
  .typeError(propertyTypeError('signup', 'email', 'string'))
  .required(requiredPropertyError('signup', 'email'))
  .email(INVALID_EMAIL);

const passwordValidatorSignup = yup
  .string()
  .typeError(propertyTypeError('signup', 'password', 'string'))
  .required(requiredPropertyError('signup', 'password'))
  .matches(/^(?=.*\d)(?=.*\D).{5,}$/, {
    message: INVALID_PASSWORD,
  });

const firstNameValidatorSignup = yup
  .string()
  .typeError(propertyTypeError('signup', 'firstName', 'string'))
  .required(requiredPropertyError('signup', 'firstName'));

const lastNameValidatorSignup = yup
  .string()
  .typeError(propertyTypeError('signup', 'lastName', 'string'))
  .required(requiredPropertyError('signup', 'lastName'));

const emailValidatorSignin = yup
  .string()
  .typeError(propertyTypeError('signin', 'email', 'string'))
  .required(requiredPropertyError('signin', 'email'));

const passwordValidatorSignin = yup
  .string()
  .typeError(propertyTypeError('signin', 'password', 'string'))
  .required(requiredPropertyError('signin', 'password'));

const emailValidatorPatch = yup
  .string()
  .typeError(propertyTypeError('patch', 'email', 'string'))
  .email(INVALID_EMAIL);

const passwordValidatorPatch = yup
  .string()
  .typeError(propertyTypeError('patch', 'password', 'string'))
  .matches(/^(?=.*\d)(?=.*[a-zA-Z]).{5,}$/, {
    message: INVALID_PASSWORD,
  });

const firstNameValidatorPatch = yup
  .string()
  .typeError(propertyTypeError('patch', 'firstName', 'string'));

const lastNameValidatorPatch = yup
  .string()
  .typeError(propertyTypeError('patch', 'lastName', 'string'));

const isConfirmedPatch = yup
  .bool()
  .typeError(propertyTypeError('patch', 'isConfirmed', 'bool'));

const isSuperAdminPatch = yup
  .bool()
  .typeError(propertyTypeError('patch', 'isSuperAdmin', 'bool'));

const idRole = yup
  .number()
  .typeError(propertyTypeError('role', 'id', 'integer'))
  .required(requiredPropertyError('role', 'id'));

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

export const validateId = (paramId, userId) => {
  const id = parseInt(paramId, 10);

  if (!id || id === userId) {
    throw new yup.ValidationError(INVALID_ID);
  }

  return id;
};
