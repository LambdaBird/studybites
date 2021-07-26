import { BadRequestError } from '../../../../validation/errors';

import { ENROLL_SUCCESS, INVALID_ENROLL } from '../../constants';

export async function enrollToLessonHandler({
  user: { id: userId },
  params: { lessonId },
}) {
  const {
    models: { Lesson, UserRole },
  } = this;

  const lesson = await Lesson.checkIfEnrolled({ lessonId, userId });
  if (!lesson) {
    throw new BadRequestError(INVALID_ENROLL);
  }

  await UserRole.enrollToLesson({ userId, lessonId });

  return ENROLL_SUCCESS;
}
