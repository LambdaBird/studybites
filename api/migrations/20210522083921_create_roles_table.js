const config = require('../src/config.js'); // eslint-disable-line import/extensions

exports.up = (knex) =>
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

exports.down = (knex) => knex.schema.dropTable('roles');
