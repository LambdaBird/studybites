export async function getAllUsersHandler({
  user: { id: userId },
  query: { search, offset, limit },
}) {
  const {
    models: { User },
  } = this;

  const { total, results: data } = await User.getAllUsers({
    userId,
    offset,
    limit,
    search,
  });

  return { total, data };
}
