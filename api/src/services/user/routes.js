import objection, { raw } from 'objection';

import config from '../../../config';

import {
  AuthorizationError,
  NotFoundError,
  BadRequestError,
  ConflictError,
} from '../../validation/errors';

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
  INVALID_ID,
} from './constants';
import { hashPassword, comparePasswords } from '../../../utils/salt';

export default async function router(instance) {
  const {
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
          password: { type: 'string' },
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
        throw new ConflictError(USER_ALREADY_REGISTERED);
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
          USER_ADMIN_FIELDS,
          User.relatedQuery('users_roles')
            .where('role_id', config.roles.TEACHER.id)
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
        .limit(req.query.limit || config.search.USER_SEARCH_LIMIT);

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
        throw new BadRequestError(INVALID_ID);
      }

      const data = await User.query()
        .findById(userId)
        .select(USER_ADMIN_FIELDS);
      if (!data) {
        throw new NotFoundError(USER_NOT_FOUND);
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
          password: { type: 'string' },
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
    handler: async ({ params: { userId }, user: { id }, body }) => {
      if (userId === id) {
        throw new BadRequestError(INVALID_ID);
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
        .returning(USER_ADMIN_FIELDS);

      if (!data) {
        throw new BadRequestError(INVALID_PATCH);
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
        throw new BadRequestError(INVALID_ID);
      }

      const result = await User.query().deleteById(userId);

      if (!result) {
        throw new NotFoundError(USER_NOT_FOUND);
      }

      return { message: USER_DELETED };
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
        throw new BadRequestError(INVALID_ID);
      }

      const check = await UserRole.query().findOne({
        userId: id,
        roleId: config.roles.TEACHER.id,
      });

      if (check) {
        throw new BadRequestError(ALTER_ROLE_FAIL);
      }

      await UserRole.query()
        .insert({
          userId: id,
          roleId: config.roles.TEACHER.id,
        })
        .returning('*');

      return { message: ALTER_ROLE_SUCCESS };
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
        throw new BadRequestError(INVALID_ID);
      }

      const result = await UserRole.query().delete().where({
        userId: id,
        roleId: config.roles.TEACHER.id,
      });

      if (!result) {
        throw new NotFoundError(USER_ROLE_NOT_FOUND);
      }

      return { message: ALTER_ROLE_SUCCESS };
    },
  });
}
