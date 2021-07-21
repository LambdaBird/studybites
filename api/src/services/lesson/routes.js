import {
  options as optionsGetAllPublicLessons,
  handler as handlerGetAllPublicLessons,
} from './handlers/getAllPublicLessons';

import {
  options as optionsGetLessonLearn,
  handler as handlerGetLessonLearn,
} from './handlers/getLessonLearn';

import {
  options as optionsGetLessonSchema,
  handler as handlerGetLessonSchema,
} from './handlers/getLessonSchema';

import {
  options as optionsGetAllEnrolledStudents,
  handler as handlerGetAllEnrolledStudents,
} from './handlers/getAllEnrolledStudents';

import {
  options as optionsGetAllMaintainableLessons,
  handler as handlerGetAllMaintainableLessons,
} from './handlers/getAllMaintainableLessons';

import {
  options as optionsGetMaintainableLessonById,
  handler as handlerGetMaintainableLessonById,
} from './handlers/getMaintainableLesson';

import {
  options as optionsCreateNewLesson,
  handler as handlerCreateNewLesson,
} from './handlers/createNewLesson';

import {
  options as optionsUpdateLesson,
  handler as handlerUpdateLesson,
} from './handlers/updateLesson';

import {
  options as optionsGetEnrolledLessonById,
  handler as handlerGetEnrolledLessonById,
} from './handlers/getEnrolledLessonById';

import {
  options as optionsEnrollToLesson,
  handler as handlerEnrollToLesson,
} from './handlers/enrollToLesson';

import {
  options as optionsGetAllEnrolledLessons,
  handler as handlerGetAllEnrolledLessons,
} from './handlers/getAllEnrolledLessons';

import {
  options as optionsGetFinishedLessons,
  handler as handlerGetFinishedLessons,
} from './handlers/getFinishedLessons';

import {
  options as optionsGetStudentsByLesson,
  handler as handlerGetStudentsByLesson,
} from './handlers/getStudentsByLesson';

import {
  options as optionsLearnLesson,
  handler as handlerLearnLesson,
} from './handlers/learnLesson';

export default async function router(instance) {
  /**
   * get all lessons where status = 'Public' with authors,
   * search, pagination and total
   */
  instance.get('/', optionsGetAllPublicLessons, handlerGetAllPublicLessons);

  /**
   * get lesson where status = 'Public' by id with authors, isFinal key, blocks
   * and blocks total
   */
  instance.get('/:lessonId', optionsGetLessonLearn, handlerGetLessonLearn);

  /**
   * get lesson schema
   */
  instance.options('/', optionsGetLessonSchema, handlerGetLessonSchema);

  /**
   * get all students enrolled to teacher`s lessons
   * with search, pagination and total
   */
  instance.get(
    '/maintain/students',
    optionsGetAllEnrolledStudents,
    handlerGetAllEnrolledStudents,
  );

  /**
   * get all lessons that teacher is maintaining
   * with search, pagination and total
   */
  instance.get(
    '/maintain/',
    optionsGetAllMaintainableLessons,
    handlerGetAllMaintainableLessons,
  );

  /**
   * get maintainable lesson by id with all blocks
   */
  instance.get(
    '/maintain/:lessonId',
    optionsGetMaintainableLessonById,
    handlerGetMaintainableLessonById,
  );

  /**
   * create new lesson with status "Draft" by default
   */
  instance.post('/maintain/', optionsCreateNewLesson, handlerCreateNewLesson);

  /**
   * update lesson by id
   */
  instance.put('/maintain/:lessonId', optionsUpdateLesson, handlerUpdateLesson);

  /**
   * get enrolled lesson with authors by id
   */
  instance.get(
    '/enroll/:lessonId',
    optionsGetEnrolledLessonById,
    handlerGetEnrolledLessonById,
  );

  /**
   * enroll to public lesson by id
   */
  instance.post(
    '/enroll/:lessonId',
    optionsEnrollToLesson,
    handlerEnrollToLesson,
  );

  /**
   * get all lessons user enrolled to
   */
  instance.get(
    '/enrolled/',
    optionsGetAllEnrolledLessons,
    handlerGetAllEnrolledLessons,
  );

  /**
   * get all finished lessons with search and total
   */
  instance.get(
    '/enrolled-finished/',
    optionsGetFinishedLessons,
    handlerGetFinishedLessons,
  );

  /**
   * get all enrolled students by lesson id with search
   * and pagination
   */
  instance.get(
    '/enrolled/:lessonId',
    optionsGetStudentsByLesson,
    handlerGetStudentsByLesson,
  );

  /**
   * lesson learning flow
   */
  instance.post('/:lessonId/learn', optionsLearnLesson, handlerLearnLesson);
}
