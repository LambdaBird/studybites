export async function publicLessonsHandler({
  user: { id: userId },
  query: { search, offset, limit, tags },
}) {
  const {
    models: { Lesson },
  } = this;

  const { total, results: lessons } = await Lesson.getAllPublicLessons({
    userId,
    offset,
    limit,
    search,
    tags,
  });

  return { total, lessons };
}
