const { SignupBodyValidator } = require('../validation/validators');
const validationCompiler = require('../validation/validationCompiler');
const errorHandler = require('../validation/errorHandler');

module.exports = async (instance) => {
  instance.route({
    method: 'POST',
    url: '/signup',
    schema: {
      body: SignupBodyValidator,
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
            fallback: { type: 'string' },
            errors: { type: 'array' },
          },
        },
        '5xx': {
          type: 'object',
          properties: {
            fallback: { type: 'string' },
            errors: { type: 'array' },
          },
        },
      },
    },
    validatorCompiler: ({ schema }) => validationCompiler(schema),
    errorHandler: async (err, _, repl) => errorHandler(err, repl),
    handler: async (req, repl) => {
      return repl.status(201).send({ message: 'success' });
    },
  });
};
