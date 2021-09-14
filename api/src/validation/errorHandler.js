import { globalErrors } from '../config';

export default function errorHandler(err, req, reply) {
  req.log.error(err);
  const { validation, statusCode, message } = err;
  if (validation) {
    return reply.status(400).send({
      statusCode: 400,
      message: `validation.${validation[0].keyword}${validation[0].dataPath}`,
    });
  }
  if (!statusCode || !message) {
    return reply.status(500).send({
      statusCode: 500,
      message: globalErrors.GLOBAL_ERR_INTERNAL_SERVER_ERROR,
    });
  }
  return reply.status(statusCode).send({ statusCode, message });
}
