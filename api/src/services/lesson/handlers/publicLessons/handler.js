export async function publicLessonsHandler({
  user: { id: userId },
  query: { search, offset, limit },
}) {
  const {
    knex,
    models: { Lesson },
  } = this;

  const { total, results: lessons } = await Lesson.getAllPublicLessons({
    knex,
    userId,
    offset,
    limit,
    search,
  });

  return { total, lessons };
}
