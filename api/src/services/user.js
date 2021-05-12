module.exports = async (instance) => {
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
          secondName: { type: 'string' },
        },
        required: ['email', 'password', 'firstName', 'secondName'],
      },
      response: {
        201: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
        400: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
        500: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
      },
    },
    handler: async (req, repl) => {
      return repl.status(201).send({ message: 'success' });
    },
  });
};
