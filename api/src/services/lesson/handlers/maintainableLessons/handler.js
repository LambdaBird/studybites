export async function maintainableLessonsHandler({
  user: { id: userId },
  query: { search, offset, limit },
}) {
  const {
    models: { Lesson },
  } = this;

  const { total, results: data } = await Lesson.getAllMaintainableLessons({
    userId,
    offset,
    limit,
    search,
  });

  return { total, data };
}
