exports.up = (knex) =>
  knex.schema.createTable('results', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table
      .enum('action', ['start', 'finish', 'resume', 'next', 'response'])
      .notNullable();
    table.json('data');
    table.integer('user_id').notNullable();
    table.integer('lesson_id').notNullable();
    table.uuid('block_id');
    table.string('revision');
    table.float('correctness', [1.0]);
    table.json('meta');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.foreign('user_id').references('users.id');
    table.foreign('lesson_id').references('lessons.id');
  });

exports.down = (knex) => knex.schema.dropTable('results');
