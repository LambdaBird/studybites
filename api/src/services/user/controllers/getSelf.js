const options = {
  schema: {
    response: {
      '4xx': { $ref: '4xx#' },
      '5xx': { $ref: '5xx#' },
    },
  },
  async onRequest(req) {
    await this.auth({ req });
  },
};

async function handler({ user: { id: userId } }) {
  const {
    models: { User },
  } = this;

  const user = await User.self({ userId });

  return { ...user };
}

export default { options, handler };
