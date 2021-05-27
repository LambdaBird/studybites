import yup from 'yup';

export const options = {
  strict: false,
  abortEarly: false,
  stripUnknown: true,
  recursive: true,
};

export const EMPTY_BODY = {
  key: 'errors.empty_body',
  message: 'Body must be an object',
};

const validatorCompiler = ({ schema }) => {
  return (data) => {
    try {
      if (!data) {
        throw new yup.ValidationError(EMPTY_BODY);
      }
      return { value: schema.validateSync(data, options) };
    } catch (err) {
      if (err.errors) {
        err.message = err.errors;
      }
      return { error: err };
    }
  };
};

export default validatorCompiler;
