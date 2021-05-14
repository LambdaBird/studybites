import bcrypt from 'bcrypt';

import { signupBodyValidator, signinBodyValidator } from './validators';
import errorResponse from '../../validation/schemas';
import validatorCompiler from '../../validation/validatorCompiler';
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
    validatorCompiler,
    errorHandler,
    handler: async (req, repl) => {
      const { email, password, firstName, secondName } = req.body;

      const hash = await bcrypt.hash(password, 12);

      try {
        const userData = await instance.objection.models.user
          .query()
          .insert({
            email,
            password: hash,
            firstName,
            secondName,
          })
          .returning('*');

        const accessToken = createAccessToken(instance, userData);
        const refreshToken = createRefreshToken(instance, userData);

        return repl.status(201).send({
          accessToken,
          refreshToken,
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
    },
  });

  instance.route({
    method: 'POST',
    url: '/signin',
    schema: {
      body: signinBodyValidator,
      response: errorResponse,
    },
    validatorCompiler,
    errorHandler,
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
