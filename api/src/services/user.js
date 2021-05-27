import bcrypt from 'bcrypt';

import signupBodyValidator from '../validation/validators';
import validationCompiler from '../validation/validationCompiler';
import errorHandler from '../validation/errorHandler';

const user = async (instance) => {
  instance.route({
    method: 'POST',
    url: '/signup',
    schema: {
      body: signupBodyValidator,
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

      try {
        await instance.objection.models.user.query().insert({
          email,
          password: hash,
          firstName,
          secondName,
        });
      } catch (err) {
        return repl.status(409).send({
          fallback: 'errors.unique_violation',
          errors: [
            {
              key: 'sign_up.email.already_registered',
              message: 'This email was already registered',
            },
          ],
        });
      }

      return repl.status(201).send({
        key: 'sign_up.action_success',
        message: 'Successfully signed up',
      });
    },
  });
};

export default user;