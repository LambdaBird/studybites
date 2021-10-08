const options = {
  schema: {
    body: {
      type: 'object',
      properties: {
        language: { enum: ['en', 'ru'] },
      },
    },

    response: {
      '4xx': { $ref: '4xx#' },
      '5xx': { $ref: '5xx#' },
    },
  },
  async onRequest(req) {
    await this.auth({ req });
  },
};

async function handler({ user: { id }, body: { language } }) {
  const {
    models: { User },
  } = this;

  const data = await User.updateLanguage({
    userId: id,
    language,
  });

  return { language: data?.language };
}

export default { options, handler };
