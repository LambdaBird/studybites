export async function finishedLessonsHandler({
  user: { id: userId },
  query: { search, offset, limit },
}) {
  const {
    knex,
    models: { Lesson },
  } = this;

  const { total, results: lessons } = await Lesson.getAllFinishedLessons({
    knex,
    userId,
    offset,
    limit,
    search,
  });

  return { total, lessons };
}
