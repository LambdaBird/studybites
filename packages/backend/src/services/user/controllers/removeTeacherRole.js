import { BadRequestError } from '../../../validation/errors';

const options = {
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
    await this.auth({ req, isAdminOnly: true });
  },
};

async function handler({ body: { id }, user: { id: userId } }) {
  const {
    config: {
      userService: { userServiceErrors: errors, userServiceMessages: messages },
    },
    models: { UserRole },
  } = this;

  if (userId === id) {
    throw new BadRequestError(errors.USER_ERR_INVALID_USER_ID);
  }

  await UserRole.removeTeacher({ userId: id });

  return { message: messages.USER_MSG_SUCCESS_ALTER_ROLE };
}

export default { options, handler };
