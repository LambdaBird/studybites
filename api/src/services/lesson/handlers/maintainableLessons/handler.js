export async function maintainableLessonsHandler({
  user: { id: userId },
  query: { search, offset, limit, tags },
}) {
  const {
    models: { Lesson },
  } = this;

  const { total, results: lessons } = await Lesson.getAllMaintainableLessons({
    userId,
    offset,
    limit,
    search,
    tags,
  });

  return { total, lessons };
}
