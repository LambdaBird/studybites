export const up = (knex) =>
  knex.schema.createTable('course_lesson_structure', (table) => {
    table.uuid('id').primary();
    table.integer('course_id');
    table.integer('lesson_id');
    table.uuid('child_id').unique();
    table.uuid('parent_id').unique();
    table.foreign('lesson_id').references('lessons.id');
    table.foreign('child_id').references('course_lesson_structure.id');
    table.foreign('parent_id').references('course_lesson_structure.id');
  });

export const down = (knex) => knex.schema.dropTable('course_lesson_structure');
