import getCourses from './controllers/getCourses';
import createCourse from './controllers/createCourse';
import coursesOptions from './controllers/coursesOptions';
import getCourse from './controllers/getCourse';
import updateCourse from './controllers/updateCourse';
import deleteCourse from './controllers/deleteCourse';
import courseOptions from './controllers/courseOptions';
import getStudentsByCourse from './controllers/getStudentsByCourse';
import courseStudentsOptions from './controllers/courseStudentsOptions';
import getAllStudents from './controllers/getAllStudents';
import studentsOptions from './controllers/studentsOptions';
import updateStatus from './controllers/updateStatus';
import updateStatuses from './controllers/updateStatuses';
import statusOptions from './controllers/statusOptions';

export async function router(instance) {
  instance.get('/courses', getCourses.options, getCourses.handler);
  instance.post('/courses', createCourse.options, createCourse.handler);
  instance.options('/lessons', coursesOptions.options, coursesOptions.handler);

  instance.put(
    '/courses/status',
    updateStatuses.options,
    updateStatuses.handler,
  );

  instance.put(
    '/courses/:courseId/status',
    updateStatus.options,
    updateStatus.handler,
  );

  instance.options(
    '/courses/:courseId/status',
    statusOptions.options,
    statusOptions.handler,
  );

  instance.get('/courses/:courseId', getCourse.options, getCourse.handler);
  instance.put(
    '/courses/:courseId',
    updateCourse.options,
    updateCourse.handler,
  );
  instance.delete(
    '/courses/:courseId',
    deleteCourse.options,
    deleteCourse.handler,
  );
  instance.options(
    '/courses/:courseId',
    courseOptions.options,
    courseOptions.handler,
  );

  instance.get(
    '/courses/:courseId/students',
    getStudentsByCourse.options,
    getStudentsByCourse.handler,
  );
  instance.options(
    '/courses/:courseId/students',
    courseStudentsOptions.options,
    courseStudentsOptions.handler,
  );

  instance.get('/students', getAllStudents.options, getAllStudents.handler);
  instance.options(
    '/students',
    studentsOptions.options,
    studentsOptions.handler,
  );
}
