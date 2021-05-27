export const up = (knex) =>
  knex.schema
    .createTable('roles', (table) => {
      table.increments();
      table.string('name').unique().notNullable();
    })
    .then(() =>
      knex('roles').insert([
        { name: 'Teacher' },
        { name: 'Maintainer' },
        { name: 'Student' },
      ]),
    );

export const down = (knex) => knex.schema.dropTable('roles');
