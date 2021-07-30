export async function studentsByLessonHandler({
  user: { id: userId },
  params: { lessonId },
  query: { search, offset, limit },
}) {
  const {
    models: { Lesson },
  } = this;

  const { total, results: students } = await Lesson.getAllEnrolledStudents({
    userId,
    lessonId,
    offset,
    limit,
    search,
  });

  return { total, students };
}
