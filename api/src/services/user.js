const bcrypt = require('bcrypt');

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
            key: { type: 'string' },
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
      const { email, password, firstName, secondName } = req.body;

      const hash = await bcrypt.hash(password, 12);

      await instance.objection.models.user.query().insert({
        email,
        password: hash,
        firstName,
        secondName,
      });

      return repl.status(201).send({
        key: 'signup.action_success',
        message: 'Successfully signed up',
      });
    },
  });
};
