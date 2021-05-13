import yup from 'yup';

const yupOptions = {
  strict: false,
  abortEarly: false,
  stripUnknown: true,
  recursive: true,
};

const validationCompiler = (schema) => {
  return (data) => {
    try {
      if (!data) {
        throw new yup.ValidationError({
          key: 'errors.empty_body',
          message: 'Body must be an object',
        });
      }
      return { value: schema.validateSync(data, yupOptions) };
    } catch (err) {
      if (err.errors) {
        err.message = err.errors;
      }
      return { error: err };
    }
  };
};

export default validationCompiler;
