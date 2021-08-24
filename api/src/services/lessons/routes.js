import getLessons from './controllers/getLessons';
import getLesson from './controllers/getLesson';
import enrollLesson from './controllers/enrollLesson';

export async function router(instance) {
  instance.get('/', getLessons.options, getLessons.handler);
  // instance.options('/');

  instance.get('/:lessonId', getLesson.options, getLesson.handler);
  // instance.options('/:lessonId');

  instance.post(
    '/:lessonId/enroll',
    enrollLesson.options,
    enrollLesson.handler,
  );
  // instance.options('/:lessonId/enroll');
}
