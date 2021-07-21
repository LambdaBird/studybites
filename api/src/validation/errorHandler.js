import { INVALID_STATUS } from '../services/lesson/constants';

const errorArray = (m) => [].concat(m);

const sendReply = (repl, status, fallback, errors) =>
  repl.status(status).send({
    fallback,
    errors: errorArray(errors),
  });

const errorHandler = (error, _, reply) => {
  if (error.validation) {
    return sendReply(reply, 400, 'errors.validation', INVALID_STATUS);
  }

  switch (error.name) {
    case 'ValidationError':
      return sendReply(reply, 400, 'errors.validation', error.errors);
    case 'BadRequestError':
      return sendReply(reply, 400, 'errors.bad_request', error.errors);
    case 'AuthorizationError':
      return sendReply(reply, 401, 'errors.authorization', error.errors);
    case 'NotFoundError':
      return sendReply(reply, 404, 'errors.not_found', error.errors);
    case 'UniqueViolationError':
      return sendReply(reply, 409, 'errors.unique_violation', error.errors);
    default:
      return sendReply(reply, 500, 'errors.internal', error.message);
  }
};

export default errorHandler;
