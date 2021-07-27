export default function errorHandler(
  { validation, statusCode, message },
  _,
  reply,
) {
  if (validation) {
    return reply.status(400).send({
      statusCode: 400,
      message: `validation.${validation[0].keyword}${validation[0].dataPath}`,
    });
  }
  if (!statusCode || !message) {
    return reply.status(500).send({ statusCode: 500, message: 'internal' });
  }
  return reply.status(statusCode).send({ statusCode, message });
}
