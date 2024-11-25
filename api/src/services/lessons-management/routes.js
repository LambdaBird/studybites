import getLessons from './controllers/getLessons';
import createLesson from './controllers/createLesson';
import lessonsOptions from './controllers/lessonsOptions';
import getLesson from './controllers/getLesson';
import updateLesson from './controllers/updateLesson';
import deleteLesson from './controllers/deleteLesson';
import lessonOptions from './controllers/lessonOptions';
import getStudentsByLesson from './controllers/getStudentsByLesson';
import lessonStudentsOptions from './controllers/lessonStudentsOptions';
import getAllStudents from './controllers/getAllStudents';
import studentsOptions from './controllers/studentsOptions';
import updateStatus from './controllers/updateStatus';
import statusOptions from './controllers/statusOptions';
import reviewStudentReply from './controllers/reviewStudentReply';

export async function router(instance) {
  instance.get('/lessons', getLessons.options, getLessons.handler);
  instance.post('/lessons', createLesson.options, createLesson.handler);
  instance.options('/lessons', lessonsOptions.options, lessonsOptions.handler);

  instance.patch(
    '/lessons/:lessonId/update-status',
    updateStatus.options,
    updateStatus.handler,
  );

  instance.options(
    '/lessons/:lessonId/update-status',
    statusOptions.options,
    statusOptions.handler,
  );

  instance.get('/lessons/:lessonId', getLesson.options, getLesson.handler);
  instance.put(
    '/lessons/:lessonId',
    updateLesson.options,
    updateLesson.handler,
  );
  instance.delete(
    '/lessons/:lessonId',
    deleteLesson.options,
    deleteLesson.handler,
  );
  instance.options(
    '/lessons/:lessonId',
    lessonOptions.options,
    lessonOptions.handler,
  );

  instance.get(
    '/lessons/:lessonId/students',
    getStudentsByLesson.options,
    getStudentsByLesson.handler,
  );
  instance.options(
    '/lessons/:lessonId/students',
    lessonStudentsOptions.options,
    lessonStudentsOptions.handler,
  );

  instance.get('/students', getAllStudents.options, getAllStudents.handler);
  instance.options(
    '/students',
    studentsOptions.options,
    studentsOptions.handler,
  );

  instance.post(
    '/review/:lessonId',
    reviewStudentReply.options,
    reviewStudentReply.handler,
  );
}
