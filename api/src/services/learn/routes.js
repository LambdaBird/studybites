import getLessons from './controllers/getLessons';
import lessonsOptions from './controllers/lessonsOptions';
import getLesson from './controllers/getLesson';
import lessonOptions from './controllers/lessonOptions';
import learnLesson from './controllers/learnLesson';
import learnOptions from './controllers/learnOptions';

export async function router(instance) {
  instance.get('/lessons', getLessons.options, getLessons.handler);
  instance.options('/lessons', lessonsOptions.options, lessonsOptions.handler);

  instance.get('/lessons/:lessonId', getLesson.options, getLesson.handler);
  instance.options(
    '/lessons/:lessonId',
    lessonOptions.options,
    lessonOptions.handler,
  );

  instance.post(
    '/lessons/:lessonId/reply',
    learnLesson.options,
    learnLesson.handler,
  );
  instance.options(
    '/lessons/:lessonId/reply',
    learnOptions.options,
    learnOptions.handler,
  );
}
