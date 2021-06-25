import config from '../config';
import { hashPassword } from '../utils/salt';

export const seed = async (knex) => {
  const teacher = {
    first_name: 'Teacher',
    last_name: 'User',
    email: 'teacher@test.io',
    password: 'passwd3',
  };

  teacher.password = await hashPassword(teacher.password);

  const teacherData = await knex('users').insert(teacher).returning('id');
  await knex('users_roles').insert({
    user_id: teacherData[0],
    role_id: config.roles.TEACHER.id,
  });
};
