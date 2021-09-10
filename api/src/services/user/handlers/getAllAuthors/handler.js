export async function getAllAuthorsHandler({
  query: { search, offset, limit },
}) {
  const {
    models: { UserRole },
  } = this;

  const { total, results: authors } = await UserRole.getAllAuthors({
    offset,
    limit,
    search,
  });

  return { total, authors };
}
