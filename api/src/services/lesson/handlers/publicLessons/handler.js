export async function publicLessonsHandler({
  user: { id: userId },
  query: { search, offset, limit },
}) {
  const {
    models: { Lesson },
  } = this;

  const { total, results: lessons } = await Lesson.getAllPublicLessons({
    userId,
    offset,
    limit,
    search,
  });

  return { total, lessons };
}
