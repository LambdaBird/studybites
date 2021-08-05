export async function studentsByLessonHandler({
  user: { id: userId },
  params: { lessonId },
  query: { search, offset, limit },
}) {
  const {
    models: { UserRole },
  } = this;

  const { total, results: students } = await UserRole.getAllStudentsOfLesson({
    userId,
    lessonId,
    offset,
    limit,
    search,
  });

  return { total, students };
}
