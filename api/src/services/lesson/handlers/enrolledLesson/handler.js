export async function enrolledLessonHandler({ params: { lessonId } }) {
  const {
    models: { Lesson, ResourceKeyword },
  } = this;

  const lesson = await Lesson.getLessonWithAuthor({ lessonId });
  const keywords = await ResourceKeyword.getLessonKeywords({ lessonId });

  return { lesson, keywords };
}
