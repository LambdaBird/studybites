import bcrypt from 'bcrypt';

import {
  signupBodyValidator,
  signinBodyValidator,
} from '../validation/validators';
import validationCompiler from '../validation/validationCompiler';
import errorHandler from '../validation/errorHandler';

import { createAccessToken, createRefreshToken } from './utils';

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
      response: {
        200: {
          type: 'object',
          properties: {
            accessToken: { type: 'string' },
            refreshToken: { type: 'string' },
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

export const authUser = async (instance, next, req, repl) => {
  const decoded = await req.jwtVerify();
  req.userId = decoded.id;

  if (!decoded.access) {
    return repl.status(401).send({
      fallback: 'errors.unauthorized',
      errors: [
        {
          message: 'Unauthorized',
        },
      ],
    });
  }

  const userData = await instance.objection.models.user.query().findOne({
    id: decoded.id,
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

  return next();
};

export default user;
