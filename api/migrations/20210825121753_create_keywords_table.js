export const up = (knex) =>
  knex.schema.createTable('keywords', (table) => {
    table.increments();
    table.string('name').unique().notNullable();
  });

export const down = (knex) => knex.schema.dropTable('keywords');
