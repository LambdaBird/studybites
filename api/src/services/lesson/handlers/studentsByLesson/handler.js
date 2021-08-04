export async function studentsByLessonHandler({
  user: { id: userId },
  params: { lessonId },
  query: { search, offset, limit },
}) {
  const {
    models: { User },
  } = this;

  const { total, results: students } = await User.getAllStudentsOfLesson({
    userId,
    lessonId,
    offset,
    limit,
    search,
  })
    .withGraphFetched('results')
    .modifyGraph('results', (builder) => {
      builder.where('lessonId', lessonId);
    });

  return { total, students };
}
