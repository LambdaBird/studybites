import lessonsData from './data/lessons';

const { lessons, usersRoles, blocks, lessonBlockStructure } = lessonsData;

export const seed = async (knex) => {
  await knex('results').del();
  await knex('lesson_block_structure').del();
  await knex('blocks').del();
  await knex('users_roles').del();
  await knex('lessons').del();

  await knex('lessons').insert(lessons);
  await knex('users_roles').insert(usersRoles);
  await knex('blocks').insert(blocks);
  await knex('lesson_block_structure').insert(lessonBlockStructure);
};
