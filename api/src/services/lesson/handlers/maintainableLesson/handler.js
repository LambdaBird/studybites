import { NotFoundError } from '../../../../validation/errors';

import { NOT_FOUND } from '../../constants';

export async function maintainableLessonHandler({ params: { lessonId } }) {
  const {
    models: { Lesson, LessonBlockStructure, UserRole },
  } = this;

  const lesson = await Lesson.query().findById(lessonId);
  if (!lesson) {
    throw new NotFoundError(NOT_FOUND);
  }

  const { count: studentsCount } = await UserRole.getLessonStudentsCount({
    lessonId,
  });

  lesson.studentsCount = studentsCount;

  lesson.blocks = await LessonBlockStructure.getAllBlocks({ lessonId });

  return { lesson };
}
