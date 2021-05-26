export const up = (knex) =>
  knex.schema.createTable('users_roles', (table) => {
    table.integer('user_id').notNullable();
    table.integer('role_id').notNullable();
    table.string('resource_type');
    table.integer('resource_id');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.foreign('user_id').references('users.id');
    table.foreign('role_id').references('roles.id');
  });

export const down = (knex) => knex.schema.dropTable('users_roles');
