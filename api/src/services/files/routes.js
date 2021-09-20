import getFile from './controllers/getFile';
import uploadFile from './controllers/uploadFile';

async function router(fastify) {
  fastify.get('/:fileName', getFile.options, getFile.handler);
  fastify.post('/', uploadFile.options, uploadFile.handler);
}

export { router };
