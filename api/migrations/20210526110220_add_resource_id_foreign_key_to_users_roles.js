export const up = (knex) =>
  knex.schema.table('users_roles', (table) => {
    table.foreign('resource_id').references('lessons.id');
  });

export const down = (knex) =>
  knex.schema.table('users_roles', (table) => {
    table.dropForeign('resource_id');
  });
