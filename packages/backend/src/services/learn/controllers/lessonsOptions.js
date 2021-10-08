import { lessonSearch } from '../../../validation/schemas';

const options = {
  async onRequest(req) {
    await this.auth({ req });
  },
};

async function handler() {
  return {
    GET: {
      querystring: lessonSearch,
    },
  };
}

export default { options, handler };
