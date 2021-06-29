exports.up = (knex) =>
  knex.schema.createTable('lessons', (table) => {
    table.increments();
    table.string('name').notNullable();
    table.text('description');
    table
      .enum('status', ['Draft', 'Public', 'Private', 'Archived'])
      .defaultTo('Draft');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

exports.down = (knex) => knex.schema.dropTable('lessons');
