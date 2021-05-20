import yup from 'yup';

import {
  propertyTypeError,
  requiredPropertyError,
} from '../../validation/helpers';

const emailValidatorSignup = yup
  .string()
  .typeError(propertyTypeError('signup', 'email'))
  .required(requiredPropertyError('signup', 'email'))
  .email({
    key: 'signup.errors.email_format_err',
    message: 'Property "email" is invalid',
  });

const passwordValidatorSignup = yup
  .string()
  .typeError(propertyTypeError('signup', 'password'))
  .required(requiredPropertyError('signup', 'password'))
  .matches(/^(?=.*\d)(?=.*[a-zA-Z]).{5,}$/, {
    message: {
      key: 'signup.errors.password_regexp_err',
      message:
        'Property "password" must be longer than 5 characters and contain at least one number and one letter',
    },
  });

const firstNameValidatorSignup = yup
  .string()
  .typeError(propertyTypeError('signup', 'firstName'))
  .required(requiredPropertyError('signup', 'firstName'));

const secondNameValidatorSignup = yup
  .string()
  .typeError(propertyTypeError('signup', 'secondName'))
  .required(requiredPropertyError('signup', 'secondName'));

const emailValidatorSignin = yup
  .string()
  .typeError(propertyTypeError('signup', 'email'))
  .required(requiredPropertyError('signup', 'email'));

const passwordValidatorSignin = yup
  .string()
  .typeError(propertyTypeError('signup', 'password'))
  .required(requiredPropertyError('signup', 'password'));

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
