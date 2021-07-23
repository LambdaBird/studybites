export async function studentsByLessonHandler({
  params: { lessonId: resourceId },
  query: { search, offset, limit },
}) {
  const {
    config,
    models: { UserRole },
  } = this;

  const columns = {
    email: 'email',
    firstName: 'firstName',
  };

  if (!search) {
    columns.email = undefined;
    columns.firstName = undefined;
  }

  const students = await UserRole.relatedQuery('users')
    .skipUndefined()
    .for(
      UserRole.query().select('user_id').where({
        roleId: config.roles.STUDENT.id,
        resourceType: config.resources.LESSON,
        resourceId,
      }),
    )
    .select('id', 'email', 'firstName', 'lastName')
    .where(columns.email, 'ilike', `%${search}%`)
    .orWhere(columns.firstName, 'ilike', `%${search}%`)
    .offset(offset || 0)
    .limit(limit || config.search.USER_SEARCH_LIMIT);

  const count = await UserRole.relatedQuery('users')
    .skipUndefined()
    .for(
      UserRole.query().select('user_id').where({
        roleId: config.roles.STUDENT.id,
        resourceType: config.resources.LESSON,
        resourceId,
      }),
    )
    .where(columns.email, 'ilike', `%${search}%`)
    .orWhere(columns.firstName, 'ilike', `%${search}%`)
    .count('*');

  return { total: +count[0].count, students };
}
