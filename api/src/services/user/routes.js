import objection, { raw } from 'objection';

import {
  AuthorizationError,
  NotFoundError,
  BadRequestError,
  ConflictError,
} from '../../validation/errors';

import { createAccessToken, createRefreshToken } from './utils';
import { hashPassword, comparePasswords } from '../../../utils/salt';

export default async function router(instance) {
  const {
    config: {
      userService: {
        userServiceErrors: errors,
        userServiceMessages: messages,
        userServiceConstants: constants,
      },
      globals: { roles, searchLimits },
    },
    models: { User, UserRole },
  } = instance;

  instance.route({
    method: 'POST',
    url: '/signup',
    schema: {
      body: {
        type: 'object',
        properties: {
          email: { type: 'string' },
          password: { type: 'string', pattern: '^(?=.*\\d)(?=.*\\D).{5,}$' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
        },
        required: ['email', 'password', 'firstName', 'lastName'],
      },
      response: {
        '4xx': { $ref: '4xx#' },
        '5xx': { $ref: '5xx#' },
      },
    },
    preHandler: async ({ body: { email } }) => {
      instance.validateEmail({ email });
    },
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
        throw new ConflictError(errors.USER_ERR_ALREADY_REGISTERED);
      }
    },
  });

  instance.route({
    method: 'POST',
    url: '/signin',
    schema: {
      body: {
        type: 'object',
        properties: {
          email: { type: 'string' },
          password: { type: 'string' },
        },
        required: ['email', 'password'],
      },
      response: {
        '4xx': { $ref: '4xx#' },
        '5xx': { $ref: '5xx#' },
      },
    },
    handler: async (req, repl) => {
      const { email, password } = req.body;

      const userData = await User.query().findOne({
        email,
      });
      if (!userData) {
        throw new AuthorizationError(errors.USER_ERR_UNAUTHORIZED);
      }

      const compareResult = await comparePasswords(password, userData.password);
      if (!compareResult) {
        throw new AuthorizationError(errors.USER_ERR_UNAUTHORIZED);
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
      body: {
        type: 'object',
        properties: {
          refreshToken: { type: 'string' },
        },
        required: ['refreshToken'],
      },
      response: {
        '4xx': { $ref: '4xx#' },
        '5xx': { $ref: '5xx#' },
      },
    },
    handler: async (req, repl) => {
      const { refreshToken } = req.body;

      const decoded = await instance.jwt.decode(refreshToken);

      if (Date.now() >= decoded.exp * 1000) {
        throw new AuthorizationError(errors.USER_ERR_TOKEN_EXPIRED);
      }

      const userData = await User.query().findById(decoded.id);

      if (!userData) {
        throw new AuthorizationError(errors.USER_ERR_UNAUTHORIZED);
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
      response: {
        '4xx': { $ref: '4xx#' },
        '5xx': { $ref: '5xx#' },
      },
    },
    async onRequest(req) {
      await instance.auth({ req });
    },
    handler: async (req, repl) => {
      const userData = await User.query()
        .findById(req.user.id)
        .select([...constants.USER_CONST_ALLOWED_USER_FIELDS, 'isSuperAdmin']);

      if (!userData) {
        throw new AuthorizationError(errors.USER_ERR_UNAUTHORIZED);
      }

      const { isSuperAdmin, ...user } = userData;

      const rolesData = await UserRole.relatedQuery('role')
        .for(UserRole.query().where('user_id', req.user.id))
        .select('name');

      const userRoles = rolesData.map((role) => role.name);

      if (isSuperAdmin) {
        userRoles.push('SuperAdmin');
      }

      const userWithRoles = { ...user, roles: userRoles };

      return repl.status(200).send(userWithRoles);
    },
  });

  instance.route({
    method: 'GET',
    url: '/',
    schema: {
      response: {
        '4xx': { $ref: '4xx#' },
        '5xx': { $ref: '5xx#' },
      },
    },
    async onRequest(req) {
      await instance.auth({ req, isAdminOnly: true });
    },
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
          constants.USER_CONST_ALLOWED_ADMIN_FIELDS,
          User.relatedQuery('users_roles')
            .where('role_id', roles.TEACHER.id)
            .select(
              raw(`CAST(CASE WHEN COUNT(*) > 0 THEN 1 ELSE 0 END AS INT)`),
            )
            .as('isTeacher'),
        )
        // eslint-disable-next-line func-names
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
        // eslint-disable-next-line func-names
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
        .limit(req.query.limit || searchLimits.USER_SEARCH_LIMIT);

      const count = await User.query()
        .skipUndefined()
        // eslint-disable-next-line func-names
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
    url: '/:userId',
    schema: {
      params: {
        type: 'object',
        properties: {
          userId: { type: 'number' },
        },
        required: ['userId'],
      },
      response: {
        '4xx': { $ref: '4xx#' },
        '5xx': { $ref: '5xx#' },
      },
    },
    async onRequest(req) {
      await instance.auth({ req, isAdminOnly: true });
    },
    handler: async ({ params: { userId }, user: { id } }) => {
      if (userId === id) {
        throw new BadRequestError(errors.USER_ERR_INVALID_USER_ID);
      }

      const data = await User.query()
        .findById(userId)
        .select(constants.USER_CONST_ALLOWED_ADMIN_FIELDS);
      if (!data) {
        throw new NotFoundError(errors.USER_ERR_USER_NOT_FOUND);
      }

      return { data };
    },
  });

  instance.route({
    method: 'PATCH',
    url: '/:userId',
    schema: {
      body: {
        type: 'object',
        properties: {
          email: { type: 'string' },
          password: { type: 'string', pattern: '^(?=.*\\d)(?=.*\\D).{5,}$' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          isConfirmed: { type: 'boolean' },
          isSuperAdmin: { type: 'boolean' },
        },
      },
      params: {
        type: 'object',
        properties: {
          userId: { type: 'number' },
        },
        required: ['userId'],
      },
      response: {
        '4xx': { $ref: '4xx#' },
        '5xx': { $ref: '5xx#' },
      },
    },
    async onRequest(req) {
      await instance.auth({ req, isAdminOnly: true });
    },
    preHandler: async ({ body: { email } }) => {
      instance.validateEmail({ email });
    },
    handler: async ({ params: { userId }, user: { id }, body }) => {
      if (userId === id) {
        throw new BadRequestError(errors.USER_ERR_INVALID_USER_ID);
      }

      let hash;
      if (body.password) {
        hash = await hashPassword(body.password);
      }

      const data = await User.query()
        .skipUndefined()
        .patch({
          ...body,
          password: hash,
        })
        .findById(userId)
        .returning(constants.USER_CONST_ALLOWED_ADMIN_FIELDS);

      if (!data) {
        throw new BadRequestError(errors.USER_ERR_INVALID_UPDATE);
      }

      return { data };
    },
  });

  instance.route({
    method: 'DELETE',
    url: '/:userId',
    schema: {
      params: {
        type: 'object',
        properties: {
          userId: { type: 'number' },
        },
        required: ['userId'],
      },
      response: {
        '4xx': { $ref: '4xx#' },
        '5xx': { $ref: '5xx#' },
      },
    },
    async onRequest(req) {
      await instance.auth({ req, isAdminOnly: true });
    },
    handler: async ({ params: { userId }, user: { id } }) => {
      if (userId === id) {
        throw new BadRequestError(errors.USER_ERR_INVALID_USER_ID);
      }

      const result = await User.query().deleteById(userId);

      if (!result) {
        throw new NotFoundError(errors.USER_ERR_USER_NOT_FOUND);
      }

      return { message: messages.USER_MSG_USER_DELETED };
    },
  });

  instance.route({
    method: 'POST',
    url: '/appoint_teacher',
    schema: {
      body: {
        type: 'object',
        properties: {
          id: { type: 'number' },
        },
        required: ['id'],
      },
      response: {
        '4xx': { $ref: '4xx#' },
        '5xx': { $ref: '5xx#' },
      },
    },
    async onRequest(req) {
      await instance.auth({ req, isAdminOnly: true });
    },
    handler: async ({ body: { id }, user: { id: userId } }) => {
      if (userId === id) {
        throw new BadRequestError(errors.USER_ERR_INVALID_USER_ID);
      }

      const check = await UserRole.query().findOne({
        userId: id,
        roleId: roles.TEACHER.id,
      });

      if (check) {
        throw new BadRequestError(errors.USER_ERR_FAIL_ALTER_ROLE);
      }

      await UserRole.query()
        .insert({
          userId: id,
          roleId: roles.TEACHER.id,
        })
        .returning('*');

      return { message: messages.USER_MSG_SUCCESS_ALTER_ROLE };
    },
  });

  instance.route({
    method: 'POST',
    url: '/remove_teacher',
    schema: {
      body: {
        type: 'object',
        properties: {
          id: { type: 'number' },
        },
        required: ['id'],
      },
      response: {
        '4xx': { $ref: '4xx#' },
        '5xx': { $ref: '5xx#' },
      },
    },
    async onRequest(req) {
      await instance.auth({ req, isAdminOnly: true });
    },
    handler: async ({ body: { id }, user: { id: userId } }) => {
      if (userId === id) {
        throw new BadRequestError(errors.USER_ERR_INVALID_USER_ID);
      }

      const result = await UserRole.query().delete().where({
        userId: id,
        roleId: roles.TEACHER.id,
      });

      if (!result) {
        throw new NotFoundError(errors.USER_ERR_ROLE_NOT_FOUND);
      }

      return { message: messages.USER_MSG_SUCCESS_ALTER_ROLE };
    },
  });
}
