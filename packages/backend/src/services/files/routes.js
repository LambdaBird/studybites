import uploadFile from './controllers/uploadFile';

export async function router(instance) {
  instance.post('/', uploadFile.options, uploadFile.handler);
}
