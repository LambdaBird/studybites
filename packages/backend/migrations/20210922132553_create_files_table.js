export const up = (knex) =>
  knex.schema.createTable('files', (table) => {
    table.increments();
    table.string('type').notNullable();
    table.string('location').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

export const down = (knex) => knex.schema.dropTable('files');
