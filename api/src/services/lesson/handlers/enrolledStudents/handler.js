export async function enrolledStudentsHandler({
  user: { id: userId },
  query: { search, offset, limit },
}) {
  const {
    knex,
    models: { Lesson },
  } = this;

  const { total, results: students } = await Lesson.getAllEnrolledStudents({
    knex,
    userId,
    offset,
    limit,
    search,
  });

  return { total, students };
}
