import objection, { raw } from 'objection';

import config from '../../../config';

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
  roleBodyValidator,
  refreshBodyValidator,
} from './validators';
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
  USER_FIELDS,
  REFRESH_TOKEN_EXPIRED,
} from './constants';
import { hashPassword, comparePasswords } from '../../../utils/salt';

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
      req.body.password = await hashPassword(req.body.password);

      try {
        const userData = await User.query().insert(req.body).returning('*');

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

      const userData = await User.query().findOne({
        email,
      });
      if (!userData) {
        throw new AuthorizationError(UNAUTHORIZED);
      }

      const compareResult = await comparePasswords(password, userData.password);
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
    method: 'POST',
    url: '/refresh_token',
    schema: {
      body: refreshBodyValidator,
      response: errorResponse,
    },
    validatorCompiler,
    errorHandler,
    handler: async (req, repl) => {
      const { refreshToken } = req.body;

      const decoded = await instance.jwt.decode(refreshToken);

      if (Date.now() >= decoded.exp * 1000) {
        throw new AuthorizationError(REFRESH_TOKEN_EXPIRED);
      }

      const userData = await User.query().findById(decoded.id);

      if (!userData) {
        throw new AuthorizationError(UNAUTHORIZED);
      }

      const newAccessToken = createAccessToken(instance, userData);
      const newRefreshToken = createRefreshToken(instance, userData);

      return repl.status(200).send({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
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
      const userData = await User.query()
        .findById(req.user.id)
        .select([...USER_FIELDS, 'isSuperAdmin']);

      if (!userData) {
        throw new AuthorizationError(UNAUTHORIZED);
      }

      const { isSuperAdmin, ...user } = userData;

      const rolesData = await UserRole.relatedQuery('role')
        .for(UserRole.query().where('user_id', req.user.id))
        .select('name');

      const roles = rolesData.map((role) => role.name);

      if (isSuperAdmin) {
        roles.push('SuperAdmin');
      }

      const userWithRoles = { ...user, roles };

      return repl.status(200).send(userWithRoles);
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
        lastName: 'lastName',
      };

      const { search: searchRaw } = req.query;
      const search = searchRaw?.trim();

      if (!search) {
        columns.email = undefined;
        columns.firstName = undefined;
        columns.lastName = undefined;
      }

      const [firstName, lastName] = search?.split(' ') || [];

      const data = await User.query()
        .skipUndefined()
        .select(
          USER_ADMIN_FIELDS,
          User.relatedQuery('users_roles')
            .where('role_id', config.roles.TEACHER.id)
            .select(
              raw(`CAST(CASE WHEN COUNT(*) > 0 THEN 1 ELSE 0 END AS INT)`),
            )
            .as('isTeacher'),
        )

        .where(function () {
          this.skipUndefined()
            .where(columns.email, 'ilike', `%${search}%`)
            .orWhere(columns.firstName, 'ilike', `%${search}%`)
            .orWhere(columns.lastName, 'ilike', `%${search}%`)
            .modify((queryBuilder) => {
              if (firstName && lastName) {
                queryBuilder.orWhere(
                  objection.raw(`concat(first_name,' ',last_name)`),
                  'ilike',
                  `%${firstName}% %${lastName}%`,
                );
              }
            });
        })
        .orWhere(function () {
          if (firstName && lastName) {
            this.skipUndefined()
              .where(columns.firstName, 'ilike', `%${firstName}%`)
              .andWhere(columns.lastName, 'ilike', `%${lastName}%`);
          }
        })
        .andWhereNot({
          id: req.user.id,
        })
        .offset(req.query.offset || 0)
        .limit(req.query.limit || config.search.USER_SEARCH_LIMIT);

      const count = await User.query()

        .skipUndefined()
        .where(function () {
          this.skipUndefined()
            .where(columns.email, 'ilike', `%${search}%`)
            .orWhere(columns.firstName, 'ilike', `%${search}%`)
            .orWhere(columns.lastName, 'ilike', `%${search}%`);
        })
        .modify((queryBuilder) => {
          if (firstName && lastName) {
            queryBuilder.orWhere(
              objection.raw(`concat(first_name,' ',last_name)`),
              'ilike',
              `%${firstName}% %${lastName}%`,
            );
          }
        })
        .andWhereNot({
          id: req.user.id,
        })
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

      const data = await User.query().findById(id).select(USER_ADMIN_FIELDS);
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
        req.body.password = await hashPassword(req.body.password);
      }

      const data = await User.query()
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

      const result = await User.query().deleteById(id);

      if (!result) {
        throw new NotFoundError(USER_NOT_FOUND);
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
        roleID: config.roles.TEACHER.id,
      });

      if (check) {
        throw new BadRequestError(ALTER_ROLE_FAIL);
      }

      await UserRole.query()
        .insert({
          userID: id,
          roleID: config.roles.TEACHER.id,
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

      const result = await UserRole.query().delete().where({
        userID: id,
        roleID: config.roles.TEACHER.id,
      });

      if (!result) {
        throw new NotFoundError(USER_ROLE_NOT_FOUND);
      }

      return repl.status(200).send(ALTER_ROLE_SUCCESS);
    },
  });
};

export default router;
