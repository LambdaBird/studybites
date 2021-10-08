export const up = (knex) =>
  knex.schema.createTable('resource_keywords', (table) => {
    table.integer('keyword_id').notNullable();
    table.integer('resource_id').notNullable();
    table.enum('resource_type', ['lesson', 'course']);
    table.foreign('keyword_id').references('keywords.id');
    table.foreign('resource_id').references('lessons.id');
  });

export const down = (knex) => knex.schema.dropTable('resource_keywords');
