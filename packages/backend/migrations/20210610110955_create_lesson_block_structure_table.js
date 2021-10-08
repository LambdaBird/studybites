export const up = (knex) =>
  knex.schema.createTable('lesson_block_structure', (table) => {
    table.uuid('id').primary();
    table.integer('lesson_id');
    table.uuid('block_id');
    table.uuid('child_id').unique();
    table.uuid('parent_id').unique();
    table.foreign('lesson_id').references('lessons.id');
    table.foreign('child_id').references('lesson_block_structure.id');
    table.foreign('parent_id').references('lesson_block_structure.id');
  });

export const down = (knex) => knex.schema.dropTable('lesson_block_structure');
