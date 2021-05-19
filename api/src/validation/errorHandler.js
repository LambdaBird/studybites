const errorArray = (m) => [].concat(m);

const errorHandler = (error, _, reply) => {
  switch (error.name) {
    case 'ValidationError':
      return reply.status(400).send({
        fallback: 'errors.validation_error',
        errors: errorArray(error.message),
      });
    case 'UniqueViolationError':
      return reply.status(409).send({
        fallback: 'errors.unique_violation',
        errors: Array.isArray(error.message) ? error.message : [error.message],
      });
    default:
      return reply.status(500).send({
        fallback: 'errors.internal_error',
        errors: errorArray(error.message),
      });
  }
};

export default errorHandler;
