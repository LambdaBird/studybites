export async function finishedLessonsHandler({
  user: { id: userId },
  query: { search, offset, limit },
}) {
  const {
    config,
    knex,
    models: { Lesson, Result },
  } = this;

  const columns = {
    name: 'name',
    firstName: 'maintainer:userInfo.first_name',
    lastName: 'maintainer:userInfo.last_name',
  };

  if (!search) {
    columns.name = undefined;
    columns.firstName = undefined;
    columns.lastName = undefined;
  }

  const firstIndex = parseInt(offset, 10) || 0;
  const lastIndex =
    firstIndex + (parseInt(limit, 10) || config.search.LESSON_SEARCH_LIMIT) - 1;

  const { finishedLessons } = await Result.query()
    .first()
    .select(knex.raw('array_agg(lesson_id) as finished_lessons'))
    .where({
      action: 'finish',
      userId,
    });

  if (finishedLessons === null) {
    return { total: 0, lessons: [] };
  }

  const { total, results } = await Lesson.getAllEnrolled({
    columns,
    userId,
    search: search?.trim(),
  })
    .whereIn('lessons.id', finishedLessons)
    .range(firstIndex, lastIndex);

  const lessons = results?.map((result) => ({
    ...result,
    percentage: 100,
  }));

  return { total, lessons };
}
