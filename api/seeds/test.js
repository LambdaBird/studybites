import { hashPassword } from '../utils/salt';
import { users, usersRoles } from './testData/users';
import { lessons, blocks, lessonBlockStructure } from './testData/lessons';

const PASSWORD = 'passwd3';

export const seed = async (knex) => {
  await Promise.all(
    users.map(async (user) => {
      const hash = await hashPassword(PASSWORD);
      return knex('users').insert({ ...user, password: hash });
    }),
  );
  await knex('lessons').insert(lessons);
  await knex('users_roles').insert(usersRoles);
  await knex('blocks').insert(blocks);
  await knex('lesson_block_structure').insert(lessonBlockStructure);
};
