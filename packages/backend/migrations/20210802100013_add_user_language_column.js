export const up = (knex) =>
  knex.schema.alterTable('users', (table) => {
    table.string('language');
  });

export const down = (knex) =>
  knex.schema.alterTable('users', (table) => {
    table.dropColumn('language');
  });
