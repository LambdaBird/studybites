export async function enrolledStudentsHandler({
  user: { id: userId },
  query: { search, offset, limit },
}) {
  const {
    models: { User },
  } = this;

  const { total, results: students } = await User.getAllStudentsOfTeacher({
    userId,
    offset,
    limit,
    search,
  });

  return { total, students };
}
