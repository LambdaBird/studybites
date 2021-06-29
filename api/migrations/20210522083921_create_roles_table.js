import config from '../src/config.js'; // eslint-disable-line import/extensions

export const up = (knex) =>
  knex.schema
    .createTable('roles', (table) => {
      table.increments();
      table.string('name').unique().notNullable();
    })
    .then(() =>
      knex('roles').insert([
        config.roles.TEACHER,
        config.roles.MAINTAINER,
        config.roles.STUDENT,
      ]),
    );

export const down = (knex) => knex.schema.dropTable('roles');
