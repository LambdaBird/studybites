export const up = (knex) =>
  knex.schema.createTable('invites', (table) => {
    table
      .uuid('id')
      .notNullable()
      .defaultTo(knex.raw('gen_random_uuid()'))
      .primary();
    table.integer('resource_id').notNullable();
    table.enum('resource_type', ['lesson', 'course']).notNullable();
    table.enum('status', ['revoked', 'pending', 'success']).notNullable();
    table.string('email');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

export const down = (knex) => knex.schema.dropTable('invites');
