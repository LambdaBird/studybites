import { BadRequestError } from '../../../validation/errors';

const options = {
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
    await this.auth({ req, isAdminOnly: true });
  },
};

async function handler({ params: { userId }, user: { id } }) {
  const {
    config: {
      userService: { userServiceErrors: errors },
    },
    models: { User },
  } = this;

  if (userId === id) {
    throw new BadRequestError(errors.USER_ERR_INVALID_USER_ID);
  }

  const data = await User.getUser({ userId });

  return { data };
}

export default { options, handler };
