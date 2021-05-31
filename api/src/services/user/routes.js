import bcrypt from 'bcrypt';

import errorResponse from '../../validation/schemas';
import validatorCompiler from '../../validation/validatorCompiler';
import errorHandler from '../../validation/errorHandler';
import {
  AuthorizationError,
  BadRequestError,
  NotFoundError,
  UniqueViolationError,
} from '../../validation/errors';

import {
  signupBodyValidator,
  signinBodyValidator,
  patchBodyValidator,
  validateId,
} from './validators';
import { createAccessToken, createRefreshToken } from './utils';
import {
  UNAUTHORIZED,
  USER_ALREADY_REGISTERED,
  USER_NOT_FOUND,
  USER_ADMIN_FIELDS,
  USER_DELETED,
  INVALID_PATCH,
  USER_FIELDS,
} from './constants';

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
      req.body.password = await bcrypt.hash(req.body.password, 12);

      try {
        const userData = await instance.objection.models.user
          .query()
          .insert(req.body)
          .returning('*');

        const accessToken = createAccessToken(instance, userData);
        const refreshToken = createRefreshToken(instance, userData);

        return repl.status(201).send({
          accessToken,
          refreshToken,
        });
      } catch (err) {
        throw new UniqueViolationError(USER_ALREADY_REGISTERED);
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
        throw new AuthorizationError(UNAUTHORIZED);
      }

      const compareResult = await bcrypt.compare(password, userData.password);
      if (!compareResult) {
        throw new AuthorizationError(UNAUTHORIZED);
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
    url: '/self',
    schema: {
      response: errorResponse,
    },
    validatorCompiler,
    errorHandler,
    onRequest: instance.auth({ instance }),
    handler: async (req, repl) => {
      const data = await instance.objection.models.user
        .query()
        .findById(req.user.id)
        .select(USER_FIELDS);
      if (!data) {
        throw new AuthorizationError(UNAUTHORIZED);
      }

      return repl.status(200).send({ data });
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
    onRequest: instance.auth({ instance, isAdminOnly: true }),
    handler: async (req, repl) => {
      const data = await instance.objection.models.user
        .query()
        .select(USER_ADMIN_FIELDS)
        .whereNot({
          id: req.user.id,
        });

      return repl.status(200).send({ data });
    },
  });

  instance.route({
    method: 'GET',
    url: '/:id',
    schema: {
      response: errorResponse,
    },
    validatorCompiler,
    errorHandler,
    onRequest: instance.auth({ instance, isAdminOnly: true }),
    handler: async (req, repl) => {
      const id = validateId(req.params.id, req.user.id);

      const data = await instance.objection.models.user
        .query()
        .findById(id)
        .select(USER_ADMIN_FIELDS);
      if (!data) {
        throw new NotFoundError(USER_NOT_FOUND);
      }

      return repl.status(200).send({ data });
    },
  });

  instance.route({
    method: 'PATCH',
    url: '/:id',
    schema: {
      body: patchBodyValidator,
      response: errorResponse,
    },
    validatorCompiler,
    errorHandler,
    onRequest: instance.auth({ instance, isAdminOnly: true }),
    handler: async (req, repl) => {
      const id = validateId(req.params.id, req.user.id);

      if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password, 12);
      }

      const data = await instance.objection.models.user
        .query()
        .patch(req.body)
        .findById(id)
        .returning(USER_ADMIN_FIELDS);

      if (!data) {
        throw new BadRequestError(INVALID_PATCH);
      }

      return repl.status(200).send({ data });
    },
  });

  instance.route({
    method: 'DELETE',
    url: '/:id',
    schema: {
      response: errorResponse,
    },
    validatorCompiler,
    errorHandler,
    onRequest: instance.auth({ instance, isAdminOnly: true }),
    handler: async (req, repl) => {
      const id = validateId(req.params.id, req.user.id);

      const result = await instance.objection.models.user
        .query()
        .deleteById(id);

      if (!result) {
        throw new NotFoundError(USER_NOT_FOUND);
      }

      return repl.status(200).send(USER_DELETED);
    },
  });
};

export default router;
