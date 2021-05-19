import bcrypt from 'bcrypt';

import { signupBodyValidator, signinBodyValidator } from './validators';
import errorResponse from '../../validation/schemas';
import validationCompiler from '../../validation/validationCompiler';
import errorHandler from '../../validation/errorHandler';

import { createAccessToken, createRefreshToken } from './utils';

const router = async (instance) => {
  instance.route({
    method: 'POST',
    url: '/signup',
    schema: {
      body: signupBodyValidator,
      response: errorResponse,
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

  instance.route({
    method: 'POST',
    url: '/signin',
    schema: {
      body: signinBodyValidator,
      response: errorResponse,
    },
    validatorCompiler: ({ schema }) => validationCompiler(schema),
    errorHandler: async (err, _, repl) => errorHandler(err, repl),
    handler: async (req, repl) => {
      const { email, password } = req.body;

      const userData = await instance.objection.models.user.query().findOne({
        email,
      });
      if (!userData) {
        return repl.status(401).send({
          fallback: 'errors.unauthorized',
          errors: [
            {
              message: 'Unauthorized',
            },
          ],
        });
      }

      const compareResult = await bcrypt.compare(password, userData.password);
      if (!compareResult) {
        return repl.status(401).send({
          fallback: 'errors.unauthorized',
          errors: [
            {
              message: 'Unauthorized',
            },
          ],
        });
      }

      const accessToken = createAccessToken(instance, userData);
      const refreshToken = createRefreshToken(instance, userData);

      return repl.status(200).send({
        accessToken,
        refreshToken,
      });
    },
  });
};

export default router;
