import { NotFoundError } from '../../../../validation/errors';

import { NOT_FOUND } from '../../constants';

export async function maintainerLessonByIdHandler({ params: { lessonId } }) {
  const {
    models: { Lesson, LessonBlockStructure },
  } = this;

  const lesson = await Lesson.query().findById(lessonId);
  if (!lesson) {
    throw new NotFoundError(NOT_FOUND);
  }

  lesson.blocks = await LessonBlockStructure.getAllBlocks({ lessonId });

  return { lesson };
}
