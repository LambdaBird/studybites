import bcrypt from 'bcrypt';

import {
  signupBodyValidator,
  signinBodyValidator,
  patchBodyValidator,
  validateId,
  roleBodyValidator,
} from './validators';
import errorResponse from '../../validation/schemas';
import validatorCompiler from '../../validation/validatorCompiler';
import errorHandler from '../../validation/errorHandler';

import { createAccessToken, createRefreshToken } from './utils';
import {
  UNAUTHORIZED,
  USER_ALREADY_REGISTERED,
  USER_NOT_FOUND,
  USER_ADMIN_FIELDS,
  USER_DELETED,
  INVALID_PATCH,
  ALTER_ROLE_SUCCESS,
  ALTER_ROLE_FAIL,
  USER_ROLE_NOT_FOUND,
  USER_ROLE_DELETED,
  TEACHER_ROLE,
} from './constants';

import config from '../../../config.json';

const router = async (instance) => {
  const { User, UserRole } = instance.models;

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
        const userData = await User.query()
          .insert(req.body)
          .returning('*');

        const accessToken = createAccessToken(instance, userData);
        const refreshToken = createRefreshToken(instance, userData);

        return repl.status(201).send({
          accessToken,
          refreshToken,
        });
      } catch (err) {
        return repl.status(409).send(USER_ALREADY_REGISTERED);
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
        return repl.status(401).send(UNAUTHORIZED);
      }

      const compareResult = await bcrypt.compare(password, userData.password);
      if (!compareResult) {
        return repl.status(401).send(UNAUTHORIZED);
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
    onRequest: instance.auth({ instance, isAdminOnly: false }),
    handler: async (req, repl) => {
      const data = await User
        .query()
        .findById(req.user.id)
        .select(['id', 'email', 'firstName', 'secondName']);
      if (!data) {
        return repl.status(401).send(UNAUTHORIZED);
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
      const columns = {
        email: 'email',
        firstName: 'firstName',
      };

      if (!req.query.search) {
        columns.email = undefined;
        columns.firstName = undefined;
      }

      const data = await User
        .query()
        .skipUndefined()
        .select(USER_ADMIN_FIELDS)
        .whereNot({
          id: req.user.id,
        })
        .where(columns.email, 'ilike', %${req.query.search}%)
        .orWhere(columns.firstName, 'ilike', %${req.query.search}%)
        .offset(req.query.offset || 0)
        .limit(req.query.limit || config.search.USER_SEARCH_LIMIT);

      const count = await User
        .query()
        .skipUndefined()
        .whereNot({
          id: req.user.id,
        })
        .where(columns.email, 'ilike', %${req.query.search}%)
        .orWhere(columns.firstName, 'ilike', %${req.query.search}%)
        .count('*');
       return repl.status(200).send({ total: +count[0].count, data });
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

      const data = await User
        .query()
        .findById(id)
        .select(USER_ADMIN_FIELDS);
      if (!data) {
        return repl.status(404).send(USER_NOT_FOUND);
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

      const data = await User
        .query()
        .patch(req.body)
        .findById(id)
        .returning(USER_ADMIN_FIELDS);
      if (!data) {
        return repl.status(400).send(INVALID_PATCH);
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

      const result = await User
        .query()
        .deleteById(id);

      if (!result) {
        return repl.status(404).send(USER_NOT_FOUND);
      }

      return repl.status(200).send(USER_DELETED);
    },
  });

  instance.route({
    method: 'POST',
    url: '/appoint_teacher',
    schema: {
      body: roleBodyValidator,
      response: errorResponse,
    },
    validatorCompiler,
    errorHandler,
    onRequest: instance.auth({ instance, isAdminOnly: true }),
    handler: async (req, repl) => {
      const id = validateId(req.body.id, req.user.id);

      const check = await UserRole.query().findOne({
        userID: id,
        roleID: TEACHER_ROLE,
      });

      if (check) {
        return repl.status(400).send(ALTER_ROLE_FAIL);
      }

      await UserRole
        .query()
        .insert({
          userID: id,
          roleID: TEACHER_ROLE,
        })
        .returning('*');

      return repl.status(200).send(ALTER_ROLE_SUCCESS);
    },
  });

  instance.route({
    method: 'POST',
    url: '/remove_teacher',
    schema: {
      body: roleBodyValidator,
      response: errorResponse,
    },
    validatorCompiler,
    errorHandler,
    onRequest: instance.auth({ instance, isAdminOnly: true }),
    handler: async (req, repl) => {
      const id = validateId(req.body.id, req.user.id);

      const result = await UserRole
        .query()
        .delete()
        .where({
          userID: id,
          roleID: TEACHER_ROLE,
        });

      if (!result) {
        return repl.status(404).send(USER_ROLE_NOT_FOUND);
      }

      return repl.status(200).send(USER_ROLE_DELETED);
    },
  });
};

export default router;