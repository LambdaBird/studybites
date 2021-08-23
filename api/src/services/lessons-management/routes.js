import getAllLessons from './controllers/getAllLessons';
import createLesson from './controllers/createLesson';
import getLessonById from './controllers/getLessonById';
import updateLesson from './controllers/updateLesson';
import deleteLesson from './controllers/deleteLesson';
import getStudentsByLesson from './controllers/getStudentsByLesson';
import getAllStudents from './controllers/getAllStudents';

export async function router(instance) {
  instance.get('/lessons', getAllLessons.options, getAllLessons.handler);
  instance.post('/lessons', createLesson.options, createLesson.handler);
  // instance.options('/lessons');

  instance.get(
    '/lessons/:lessonId',
    getLessonById.options,
    getLessonById.handler,
  );
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
  // instance.options('/lessons/:lessonId');

  instance.get(
    '/lessons/:lessonId/students',
    getStudentsByLesson.options,
    getStudentsByLesson.handler,
  );
  // instance.options('/lessons/:lessonId/students');

  instance.get('/students', getAllStudents.options, getAllStudents.handler);
  // instance.options('/students');
}
