import {
  publicLessonsOptions,
  publicLessonsHandler,
} from './handlers/publicLessons';

import { getLearnOptions, getLearnHandler } from './handlers/getLearn';

import {
  lessonSchemaOptions,
  lessonSchemaHandler,
} from './handlers/lessonSchema';

import {
  enrolledStudentsOptions,
  enrolledStudentsHandler,
} from './handlers/enrolledStudents';

import {
  maintainableLessonsOptions,
  maintainableLessonsHandler,
} from './handlers/maintainableLessons';

import {
  maintainableLessonOptions,
  maintainableLessonHandler,
} from './handlers/maintainableLesson';

import {
  createLessonOptions,
  createLessonHandler,
} from './handlers/createLesson';

import {
  updateLessonOptions,
  updateLessonHandler,
} from './handlers/updateLesson';

import {
  enrolledLessonOptions,
  enrolledLessonHandler,
} from './handlers/enrolledLesson';

import {
  enrollToLessonOptions,
  enrollToLessonHandler,
} from './handlers/enrollToLesson';

import {
  enrolledLessonsOptions,
  enrolledLessonsHandler,
} from './handlers/enrolledLessons';

import {
  finishedLessonsOptions,
  finishedLessonsHandler,
} from './handlers/finishedLessons';

import {
  studentsByLessonOptions,
  studentsByLessonHandler,
} from './handlers/studentsByLesson';

import { learnLessonOptions, learnLessonHandler } from './handlers/learnLesson';

export default async function router(instance) {
  /**
   * get all lessons where status = 'Public' with authors,
   * search, pagination and total
   */
  instance.get('/', publicLessonsOptions, publicLessonsHandler);

  /**
   * get lesson where status = 'Public' by id with authors, isFinal key, blocks
   * and blocks total
   */
  instance.get('/:lessonId', getLearnOptions, getLearnHandler);

  /**
   * get lesson schema
   */
  instance.options('/', lessonSchemaOptions, lessonSchemaHandler);

  /**
   * get all students enrolled to teacher`s lessons
   * with search, pagination and total
   */
  instance.get(
    '/maintain/students',
    enrolledStudentsOptions,
    enrolledStudentsHandler,
  );

  /**
   * get all lessons that teacher is maintaining
   * with search, pagination and total
   */
  instance.get(
    '/maintain/',
    maintainableLessonsOptions,
    maintainableLessonsHandler,
  );

  /**
   * get maintainable lesson by id with all blocks
   */
  instance.get(
    '/maintain/:lessonId',
    maintainableLessonOptions,
    maintainableLessonHandler,
  );

  /**
   * create new lesson with status "Draft" by default
   */
  instance.post('/maintain/', createLessonOptions, createLessonHandler);

  /**
   * update lesson by id
   */
  instance.put('/maintain/:lessonId', updateLessonOptions, updateLessonHandler);

  /**
   * get enrolled lesson with authors by id
   */
  instance.get(
    '/enroll/:lessonId',
    enrolledLessonOptions,
    enrolledLessonHandler,
  );

  /**
   * enroll to public lesson by id
   */
  instance.post(
    '/enroll/:lessonId',
    enrollToLessonOptions,
    enrollToLessonHandler,
  );

  /**
   * get all lessons user enrolled to
   */
  instance.get('/enrolled/', enrolledLessonsOptions, enrolledLessonsHandler);

  /**
   * get all finished lessons with search and total
   */
  instance.get(
    '/enrolled-finished/',
    finishedLessonsOptions,
    finishedLessonsHandler,
  );

  /**
   * get all enrolled students by lesson id with search
   * and pagination
   */
  instance.get(
    '/enrolled/:lessonId',
    studentsByLessonOptions,
    studentsByLessonHandler,
  );

  /**
   * lesson learning flow
   */
  instance.post('/:lessonId/learn', learnLessonOptions, learnLessonHandler);
}
