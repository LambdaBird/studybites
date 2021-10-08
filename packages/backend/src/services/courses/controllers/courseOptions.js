import { courseIdParam } from '../../../validation/schemas';

const options = {
  async onRequest(req) {
    await this.auth({ req });
  },
};

async function handler() {
  return {
    GET: {
      params: courseIdParam,
    },
  };
}

export default { options, handler };
