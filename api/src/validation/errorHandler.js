import { ValidationError } from 'yup';

export default function errorHandler(
  { constructor, validation, statusCode, message },
  _,
  reply,
) {
  if (constructor === ValidationError) {
    reply.status(400).send({
      statusCode: 400,
      message,
    });
  }
  if (validation) {
    reply.status(400).send({
      statusCode: 400,
      message: `${validation[0].keyword}${validation[0].dataPath}`,
    });
  }
  if (!statusCode || !message) {
    reply.status(500).send({ statusCode: 500, message: 'internal' });
  }
  reply.status(statusCode).send({ statusCode, message });
}
