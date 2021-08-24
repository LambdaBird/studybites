import getLessons from './controllers/getLessons';
import getLesson from './controllers/getLesson';
import learnLesson from './controllers/learnLesson';

export async function router(instance) {
  instance.get('/lessons', getLessons.options, getLessons.handler);
  // instance.options('/lessons');

  instance.get('/lessons/:lessonId', getLesson.options, getLesson.handler);
  // instance.options('/lessons/:lessonId');

  instance.post(
    '/lessons/:lessonId/reply',
    learnLesson.options,
    learnLesson.handler,
  );
  // instance.options('/lessons/:lessonId/reply');
}
