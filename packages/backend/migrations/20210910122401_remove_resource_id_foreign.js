export const up = (knex) =>
  knex.schema.alterTable('resource_keywords', (table) => {
    table.dropForeign('resource_id');
  });

export const down = (knex) =>
  knex.schema.alterTable('resource_keywords', (table) => {
    table.foreign('resource_id').references('lessons.id');
  });
