import { lessonIdParam } from '../../../validation/schemas';

const options = {
  async onRequest(req) {
    await this.auth({ req });
  },
};

async function handler() {
  return {
    POST: {
      params: lessonIdParam,
    },
  };
}

export default { options, handler };
