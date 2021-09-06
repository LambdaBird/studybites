import getLessons from './controllers/getLessons';
import lessonsOptions from './controllers/lessonsOptions';
import getLesson from './controllers/getLesson';
import lessonOptions from './controllers/lessonOptions';
import learnLesson from './controllers/learnLesson';
import learnOptions from './controllers/learnOptions';
import getCourses from './controllers/getCourses';
import coursesOptions from './controllers/coursesOptions';
import getCourse from './controllers/getCourse';
import enrollCourseLesson from './controllers/enrollCourseLesson';
import enrollOptions from './controllers/enrollOptions';

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

  instance.get('/courses', getCourses.options, getCourses.handler);
  instance.options('/courses', coursesOptions.options, coursesOptions.handler);

  instance.get('/courses/:courseId', getCourse.options, getCourse.handler);

  instance.post(
    '/courses/:courseId/enroll',
    enrollCourseLesson.options,
    enrollCourseLesson.handler,
  );
  instance.options(
    '/courses/:courseId/enroll',
    enrollOptions.options,
    enrollOptions.handler,
  );
}
