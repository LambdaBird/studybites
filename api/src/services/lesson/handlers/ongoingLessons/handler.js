export async function ongoingLessonsHandler({
  user: { id: userId },
  query: { search, offset, limit },
}) {
  const {
    knex,
    models: { Lesson, Result },
  } = this;

  const { excludeLessons } = await Result.getFinishedLessons({ knex, userId });

  const { total, results: lessons } = await Lesson.getOngoingLessons({
    knex,
    userId,
    excludeLessons,
    offset,
    limit,
    search,
  });

  return { total, lessons };
}
