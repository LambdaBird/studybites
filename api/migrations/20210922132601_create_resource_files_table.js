export const up = (knex) =>
  knex.schema.createTable('resource_files', (table) => {
    table.integer('user_id').notNullable();
    table.integer('file_id').notNullable();
    table.integer('resource_id');
    table.string('resource_type').notNullable();
    table.string('resource_uuid');
    table.foreign('user_id').references('users.id');
    table.foreign('file_id').references('files.id');
  });

export const down = (knex) => knex.schema.dropTable('resource_files');
