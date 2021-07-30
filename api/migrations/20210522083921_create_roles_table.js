import { roles } from '../src/config';

export const up = (knex) =>
  knex.schema
    .createTable('roles', (table) => {
      table.increments();
      table.string('name').unique().notNullable();
    })
    .then(() =>
      knex('roles').insert([roles.TEACHER, roles.MAINTAINER, roles.STUDENT]),
    );

export const down = (knex) => knex.schema.dropTable('roles');
