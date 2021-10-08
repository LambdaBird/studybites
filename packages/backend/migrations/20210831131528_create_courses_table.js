export const up = (knex) =>
  knex.schema.createTable('courses', (table) => {
    table.increments();
    table.string('name').notNullable();
    table.string('description');
    table
      .enum('status', ['Draft', 'Public', 'Private', 'Archived'])
      .defaultTo('Draft');
  });

export const down = (knex) => knex.schema.dropTable('courses');
