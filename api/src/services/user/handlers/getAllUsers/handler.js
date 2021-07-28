export async function getAllUsersHandler(req) {
  const {
    config: {
      globals: { roles, searchLimits },
      userService: { userServiceConstants: constants },
    },
    knex,
    models: { User },
  } = this;

  const columns = {
    email: 'email',
    firstName: 'firstName',
    lastName: 'lastName',
  };

  const { search: searchRaw } = req.query;
  const search = searchRaw?.trim();

  if (!search) {
    columns.email = undefined;
    columns.firstName = undefined;
    columns.lastName = undefined;
  }

  const [firstName, lastName] = search?.split(' ') || [];

  const data = await User.query()
    .skipUndefined()
    .select(
      constants.USER_CONST_ALLOWED_ADMIN_FIELDS,
      User.relatedQuery('users_roles')
        .where('role_id', roles.TEACHER.id)
        .select(
          knex.raw(`CAST(CASE WHEN COUNT(*) > 0 THEN 1 ELSE 0 END AS INT)`),
        )
        .as('isTeacher'),
    )
    // eslint-disable-next-line func-names
    .where(function () {
      this.skipUndefined()
        .where(columns.email, 'ilike', `%${search}%`)
        .orWhere(columns.firstName, 'ilike', `%${search}%`)
        .orWhere(columns.lastName, 'ilike', `%${search}%`)
        .modify((queryBuilder) => {
          if (firstName && lastName) {
            queryBuilder.orWhere(
              knex.raw(`concat(first_name,' ',last_name)`),
              'ilike',
              `%${firstName}% %${lastName}%`,
            );
          }
        });
    })
    // eslint-disable-next-line func-names
    .orWhere(function () {
      if (firstName && lastName) {
        this.skipUndefined()
          .where(columns.firstName, 'ilike', `%${firstName}%`)
          .andWhere(columns.lastName, 'ilike', `%${lastName}%`);
      }
    })
    .andWhereNot({
      id: req.user.id,
    })
    .offset(req.query.offset || 0)
    .limit(req.query.limit || searchLimits.USER_SEARCH_LIMIT);

  const count = await User.query()
    .skipUndefined()
    // eslint-disable-next-line func-names
    .where(function () {
      this.skipUndefined()
        .where(columns.email, 'ilike', `%${search}%`)
        .orWhere(columns.firstName, 'ilike', `%${search}%`)
        .orWhere(columns.lastName, 'ilike', `%${search}%`);
    })
    .modify((queryBuilder) => {
      if (firstName && lastName) {
        queryBuilder.orWhere(
          knex.raw(`concat(first_name,' ',last_name)`),
          'ilike',
          `%${firstName}% %${lastName}%`,
        );
      }
    })
    .andWhereNot({
      id: req.user.id,
    })
    .count('*');

  return { total: +count[0].count, data };
}
