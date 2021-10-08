import { BadRequestError } from '../../../validation/errors';
import { hashPassword } from '../../../../utils/salt';

const options = {
  schema: {
    body: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        password: { $ref: 'passwordPattern#' },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        language: { enum: ['en', 'ru'] },
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
    await this.auth({ req, isAdminOnly: true });
  },
  async preHandler({ body: { email } }) {
    this.validateEmail({ email });
  },
};

async function handler({ params: { userId }, user: { id }, body }) {
  const {
    config: {
      userService: { userServiceErrors: errors },
    },
    models: { User },
  } = this;

  if (userId === id) {
    throw new BadRequestError(errors.USER_ERR_INVALID_USER_ID);
  }

  let hash;

  if (body.password) {
    hash = await hashPassword(body.password);
  }

  const data = await User.updateOne({
    userId,
    userData: { ...body, password: hash },
  });

  return { data };
}

export default { options, handler };
