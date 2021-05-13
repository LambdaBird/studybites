const yup = require('yup');

const yupOptions = {
  strict: false,
  abortEarly: false,
  stripUnknown: true,
  recursive: true,
};

module.exports = (schema) => {
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
