import getCourses from './controllers/getCourses';
import coursesOptions from './controllers/coursesOptions';
import getCourse from './controllers/getCourse';
import courseOptions from './controllers/courseOptions';
import enrollCourse from './controllers/enrollCourse';
import enrollOptions from './controllers/enrollOptions';

export async function router(instance) {
  instance.get('/', getCourses.options, getCourses.handler);
  instance.options('/', coursesOptions.options, coursesOptions.handler);

  instance.get('/:courseId', getCourse.options, getCourse.handler);
  instance.options('/:courseId', courseOptions.options, courseOptions.handler);

  instance.post(
    '/:courseId/enroll',
    enrollCourse.options,
    enrollCourse.handler,
  );
  instance.options(
    '/:courseId/enroll',
    enrollOptions.options,
    enrollOptions.handler,
  );
}
