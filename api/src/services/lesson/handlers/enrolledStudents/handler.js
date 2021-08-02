export async function enrolledStudentsHandler({
  user: { id: userId },
  query: { search, offset, limit },
}) {
  const {
    models: { Lesson },
  } = this;

  const { total, results: students } = await Lesson.getAllEnrolledStudents({
    userId,
    offset,
    limit,
    search,
  });

  return { total, students };
}
