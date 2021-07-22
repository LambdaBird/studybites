export async function enrolledLessonsHandler({
  user: { id: userId },
  query: { search, offset, limit },
}) {
  const {
    knex,
    models: { Lesson },
  } = this;

  const { total, results: lessons } = await Lesson.getAllEnrolledLessons({
    knex,
    userId,
    offset,
    limit,
    search,
  });

  return { total, lessons };
}
