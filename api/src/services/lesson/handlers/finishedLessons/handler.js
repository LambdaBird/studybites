export async function finishedLessonsHandler({
  user: { id: userId },
  query: { search, offset, limit },
}) {
  const {
    models: { Lesson },
  } = this;

  const { total, results: lessons } = await Lesson.getAllFinishedLessons({
    userId,
    offset,
    limit,
    search,
  });

  return { total, lessons };
}
