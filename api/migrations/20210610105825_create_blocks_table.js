export const up = (knex) =>
  knex.schema.createTable('blocks', (table) => {
    table
      .uuid('block_id')
      .notNullable()
      .defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('revision_id').primary();
    table.json('content');
    table.string('type');
    table.json('answer');
    table.float('weight', [1.0]);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

export const down = (knex) => knex.schema.dropTable('blocks');
