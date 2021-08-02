export async function ongoingLessonsHandler({
  user: { id: userId },
  query: { search, offset, limit },
}) {
  const {
    models: { Lesson, Result },
  } = this;

  const { excludeLessons } = await Result.getFinishedLessons({ userId });

  const { total, results: lessons } = await Lesson.getOngoingLessons({
    userId,
    excludeLessons,
    offset,
    limit,
    search,
  });

  return { total, lessons };
}
