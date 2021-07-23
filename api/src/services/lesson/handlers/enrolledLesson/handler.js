export async function enrolledLessonHandler({ params: { lessonId } }) {
  const {
    models: { Lesson },
  } = this;

  const lesson = await Lesson.query()
    .findById(lessonId)
    .withGraphFetched('maintainers');

  return { lesson };
}
