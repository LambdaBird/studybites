import yup from 'yup';

import {
  propertyTypeError,
  requiredPropertyError,
} from '../../validation/helpers';
import { INVALID_EMAIL, INVALID_PASSWORD, INVALID_ID } from './constants';

const emailValidatorSignup = yup
  .string()
  .typeError(propertyTypeError('signup', 'email', 'string'))
  .required(requiredPropertyError('signup', 'email'))
  .email({
    key: 'signup.errors.email_format_err',
    message: INVALID_EMAIL,
  });

const passwordValidatorSignup = yup
  .string()
  .typeError(propertyTypeError('signup', 'password', 'string'))
  .required(requiredPropertyError('signup', 'password'))
  .matches(/^(?=.*\d)(?=.*[a-zA-Z]).{5,}$/, {
    message: {
      key: 'signup.errors.password_regexp_err',
      message: INVALID_PASSWORD,
    },
  });

const firstNameValidatorSignup = yup
  .string()
  .typeError(propertyTypeError('signup', 'firstName', 'string'))
  .required(requiredPropertyError('signup', 'firstName'));

const secondNameValidatorSignup = yup
  .string()
  .typeError(propertyTypeError('signup', 'secondName', 'string'))
  .required(requiredPropertyError('signup', 'secondName'));

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
  .email({
    key: 'signup.errors.email_format_err',
    message: INVALID_EMAIL,
  });

const passwordValidatorPatch = yup
  .string()
  .typeError(propertyTypeError('patch', 'password', 'string'))
  .matches(/^(?=.*\d)(?=.*[a-zA-Z]).{5,}$/, {
    message: {
      key: 'signup.errors.password_regexp_err',
      message: INVALID_PASSWORD,
    },
  });

const firstNameValidatorPatch = yup
  .string()
  .typeError(propertyTypeError('patch', 'firstName', 'string'));

const secondNameValidatorPatch = yup
  .string()
  .typeError(propertyTypeError('patch', 'secondName', 'string'));

const isConfirmedPatch = yup
  .bool()
  .typeError(propertyTypeError('patch', 'isConfirmed', 'bool'));

const isSuperAdminPatch = yup
  .bool()
  .typeError(propertyTypeError('patch', 'isSuperAdmin', 'bool'));

export const signupBodyValidator = yup.object({
  email: emailValidatorSignup,
  password: passwordValidatorSignup,
  firstName: firstNameValidatorSignup,
  secondName: secondNameValidatorSignup,
});

export const signinBodyValidator = yup.object({
  email: emailValidatorSignin,
  password: passwordValidatorSignin,
});

export const patchBodyValidator = yup.object({
  email: emailValidatorPatch,
  password: passwordValidatorPatch,
  firstName: firstNameValidatorPatch,
  secondName: secondNameValidatorPatch,
  isConfirmed: isConfirmedPatch,
  isSuperAdmin: isSuperAdminPatch,
});

export const validateId = (req, repl) => {
  const id = parseInt(req.params.id, 10);

  if (!id || id === req.user.id) {
    return repl.status(400).send(INVALID_ID);
  }

  return id;
};

export const validateSearch = (req) => {
  const { column, search } = req.query;

  if (!search) {
    return { column: undefined, search: undefined };
  }

  switch (column) {
    case 'email':
    case 'firstName':
    case 'secondName':
      return req.query;
    default:
      return { column: undefined, search: undefined };
  }
};
