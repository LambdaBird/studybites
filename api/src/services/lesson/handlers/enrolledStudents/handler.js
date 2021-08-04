export async function enrolledStudentsHandler({
  user: { id: userId },
  query: { search, offset, limit },
}) {
  const {
    models: { UserRole },
  } = this;

  const { total, results: students } = await UserRole.getAllStudentsOfTeacher({
    userId,
    offset,
    limit,
    search,
  }).withGraphFetched('results');

  return { total, students };
}
