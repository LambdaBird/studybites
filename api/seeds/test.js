import { hashPassword } from '../utils/salt';
import { users, usersRoles } from './testData/users';
import { lessons, blocks, lessonBlockStructure } from './testData/lessons';

const PASSWORD = 'passwd3';

export const seed = async (knex) => {
  await Promise.all(
    users.map(async (user) => {
      user.password = await hashPassword(PASSWORD);

      return await knex('users').insert(user);
    }),
  );
  await knex('lessons').insert(lessons);
  await knex('users_roles').insert(usersRoles);
  await knex('blocks').insert(blocks);
  await knex('lesson_block_structure').insert(lessonBlockStructure);
  await knex.raw('ALTER SEQUENCE users_id_seq RESTART WITH 5');
  await knex.raw('ALTER SEQUENCE lessons_id_seq RESTART WITH 6');
};
