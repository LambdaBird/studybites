export async function finishedLessonsHandler({
  user: { id: userId },
  query: { search, offset, limit, tags },
}) {
  const {
    models: { Lesson },
  } = this;

  const { total, results: lessons } = await Lesson.getAllFinishedLessons({
    userId,
    offset,
    limit,
    search,
    tags,
  });

  return { total, lessons };
}
