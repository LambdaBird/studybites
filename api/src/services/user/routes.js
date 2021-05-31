import bcrypt from 'bcrypt';

import { signupBodyValidator, signinBodyValidator } from './validators';
import errorResponse from '../../validation/schemas';
import validatorCompiler from '../../validation/validatorCompiler';
import errorHandler from '../../validation/errorHandler';

import { createAccessToken, createRefreshToken } from './utils';

const router = async (instance) => {
  const { User } = instance.models;

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
        const userData = await User.query()
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

      const userData = await User.query().findOne({
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

  instance.route({
    method: 'GET',
    url: '/',
    schema: {
      response: errorResponse,
    },
    validatorCompiler,
    errorHandler,
    onRequest: (req, repl, next) => {
      instance.auth(instance, next, req, repl);
    },
    handler: async (req, repl) => {
      const userData = await User.query()
        .findOne({
          id: req.user.id,
        })
        .select(['id', 'email', 'firstName', 'secondName']);
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

      return repl.status(200).send({ data: userData });
    },
  });
};

export default router;
