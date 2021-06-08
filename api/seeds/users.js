import config from '../config';
import usersData from './data/users';

export const seed = async (knex) => {
  await knex('users_roles').del();
  await knex('users').where('is_super_admin', false).del();
  const promises = usersData.map(async ({ _isTeacher, ...user }) => {
    const userData = await knex('users').insert(user).returning('id');
    if (_isTeacher) {
      return knex('users_roles').insert({
        user_id: userData[0],
        role_id: config.roles.TEACHER.id,
      });
    }
    return userData;
  });
  await Promise.all(promises);
};
