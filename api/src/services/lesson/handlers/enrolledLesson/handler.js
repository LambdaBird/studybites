export async function enrolledLessonHandler({ params: { lessonId } }) {
  const {
    models: { Lesson },
  } = this;

  const lesson = await Lesson.getLessonWithAuthor({ lessonId });

  return { lesson };
}
