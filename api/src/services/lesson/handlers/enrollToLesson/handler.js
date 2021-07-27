import { ENROLL_SUCCESS } from '../../constants';

export async function enrollToLessonHandler({
  user: { id: userId },
  params: { lessonId },
}) {
  const {
    models: { Lesson, UserRole },
  } = this;

  await Lesson.checkIfEnrolled({ lessonId, userId });
  await UserRole.enrollToLesson({ userId, lessonId });

  return { message: ENROLL_SUCCESS };
}
