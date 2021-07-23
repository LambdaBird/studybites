export async function ongoingLessonsHandler({
  user: { id: userId },
  query: { search, offset, limit },
}) {
  const {
    knex,
    models: { Lesson, Result },
  } = this;

  const { excludeLessons } = await Result.query()
    .first()
    .select(knex.raw(`array_agg(lesson_id) as exclude_lessons`))
    .where({ userId })
    .andWhere({ action: 'finish' });

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
