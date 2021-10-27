export const up = (knex) =>
  knex.schema.alterTable('invites', (table) => {
    table.enum('email_status', ['error', 'pending', 'success']);
  });

export const down = (knex) =>
  knex.schema.alterTable('invites', (table) => {
    table.dropColumn('email_status');
  });
