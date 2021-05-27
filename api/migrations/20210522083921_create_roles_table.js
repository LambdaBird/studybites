export const up = (knex) =>
  knex.schema
    .createTable('roles', (table) => {
      table.increments();
      table.string('name').unique().notNullable();
    })
    .then(() =>
      knex('roles').insert([
        { id: 1, name: 'Teacher' },
        { id: 2, name: 'Maintainer' },
        { id: 3, name: 'Student' },
      ]),
    );

export const down = (knex) => knex.schema.dropTable('roles');
