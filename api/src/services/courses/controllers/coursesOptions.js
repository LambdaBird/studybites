import { courseSearch } from '../../../validation/schemas';

const options = {
  async onRequest(req) {
    await this.auth({ req });
  },
};

async function handler() {
  return {
    GET: {
      querystring: courseSearch,
    },
  };
}

export default { options, handler };
