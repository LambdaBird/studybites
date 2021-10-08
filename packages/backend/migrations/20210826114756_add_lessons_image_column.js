export const up = (knex) =>
  knex.schema.alterTable('lessons', (table) => {
    table.string('image');
  });

export const down = (knex) =>
  knex.schema.alterTable('lessons', (table) => {
    table.dropColumn('image');
  });
