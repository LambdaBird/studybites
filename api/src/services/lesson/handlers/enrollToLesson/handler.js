export async function enrollToLessonHandler({
  user: { id: userId },
  params: { lessonId },
}) {
  const {
    config: {
      lessonService: { lessonServiceMessages: messages },
    },
    models: { Lesson, UserRole },
  } = this;

  await Lesson.checkIfEnrolled({ lessonId, userId });
  await UserRole.enrollToLesson({ userId, lessonId });

  return { message: messages.LESSON_MSG_SUCCESS_ENROLL };
}
