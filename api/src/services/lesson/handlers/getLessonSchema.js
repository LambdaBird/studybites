import errorResponse from '../../../validation/schemas';
import errorHandler from '../../../validation/errorHandler';

export const options = {
  schema: {
    response: errorResponse,
  },
  errorHandler,
  async onRequest(req) {
    await this.auth({ req });
  },
};

export async function handler() {
  const {
    models: { Lesson },
  } = this;

  return Lesson.jsonSchema;
}
