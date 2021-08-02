export const up = (knex) =>
  knex.schema.alterTable('users', (table) => {
    table.jsonb('settings').defaultTo('{}');
  });

export const down = (knex) =>
  knex.schema.alterTable('users', (table) => {
    table.dropColumn('settings');
  });
