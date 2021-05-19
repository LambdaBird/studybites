import yup from 'yup';

import {
  propertyTypeError,
  requiredPropertyError,
} from '../../validation/helpers';

const emailValidator = yup
  .string()
  .typeError(propertyTypeError('signup', 'email'))
  .required(requiredPropertyError('signup', 'email'))
  .email({
    key: 'signup.errors.email_format_err',
    message: 'Property "email" is invalid',
  });

const passwordValidator = yup
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

const firstNameValidator = yup
  .string()
  .typeError(propertyTypeError('signup', 'firstName'))
  .required(requiredPropertyError('signup', 'firstName'));

const secondNameValidator = yup
  .string()
  .typeError(propertyTypeError('signup', 'secondName'))
  .required(requiredPropertyError('signup', 'secondName'));

export const signupBodyValidator = yup.object({
  email: emailValidator,
  password: passwordValidator,
  firstName: firstNameValidator,
  secondName: secondNameValidator,
});

export const signinBodyValidator = yup.object({
  email: emailValidator,
  password: passwordValidator,
});
