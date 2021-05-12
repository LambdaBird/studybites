const yup = require('yup');

const yupOptions = {
  strict: false,
  abortEarly: false,
  stripUnknown: true,
  recursive: true,
};

module.exports = async (instance) => {
  instance.route({
    method: 'POST',
    url: '/signup',
    schema: {
      body: {
        type: 'object',
        properties: {
          email: { type: 'string' },
          password: { type: 'string' },
          firstName: { type: 'string' },
          secondName: { type: 'string' },
        },
        required: ['email', 'password', 'firstName', 'secondName'],
        yup: yup.object({
          email: yup.string().email('"email" must be a valid email string'),
          password: yup
            .string()
            .min(5, '"password" must be at least 5 characters long')
            .matches(
              /^(?=.*\d)(?=.*[a-zA-Z]).{5,}$/,
              '"password" must contain at least one numeric digit and one letter'
            ),
        }),
      },
      response: {
        201: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
        '4xx': {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
        '5xx': {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
      },
    },
    validatorCompiler: ({ schema }) => {
      return (data) => {
        try {
          return { value: schema.yup.validateSync(data, yupOptions) };
        } catch (err) {
          err.message = err.errors.join(', ');
          return { error: err };
        }
      };
    },
    handler: async (req, repl) => {
      return repl.status(201).send({ message: 'success' });
    },
  });
};
