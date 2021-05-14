import yup from 'yup';

export const propertyTypeError = (key, property) => ({
  key: `${key}.errors.${property}_type_err`,
  message: `Property "${property}" must be a string`,
});
export const requiredPropertyError = (key, property) => ({
  key: `${key}.errors.${property}_req_err`,
  message: `Missing required property "${property}"`,
});

export const INVALID_EMAIL = 'Property "email" is invalid';

const emailValidator = yup
  .string()
  .typeError(propertyTypeError('signup', 'email'))
  .required(requiredPropertyError('signup', 'email'))
  .email({
    key: 'signup.errors.email_format_err',
    message: INVALID_EMAIL,
  });

export const INVALID_PASSWORD =
  'Property "password" must be longer than 5 characters and contain at least one number and one letter';

const passwordValidator = yup
  .string()
  .typeError(propertyTypeError('signup', 'password'))
  .required(requiredPropertyError('signup', 'password'))
  .matches(/^(?=.*\d)(?=.*[a-zA-Z]).{5,}$/, {
    message: {
      key: 'signup.errors.password_regexp_err',
      message: INVALID_PASSWORD,
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

const signupBodyValidator = yup.object({
  email: emailValidator,
  password: passwordValidator,
  firstName: firstNameValidator,
  secondName: secondNameValidator,
});

export default signupBodyValidator;
