import updateStatus from './controllers/updateStatus';
import statusOptions from './controllers/statusOptions';

export async function router(instance) {
  instance.post(
    '/lessons/:lessonId',
    updateStatus.options,
    updateStatus.handler,
  );
  instance.options(
    '/lessons/:lessonId',
    statusOptions.options,
    statusOptions.handler,
  );
}
