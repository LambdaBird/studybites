export const up = (knex) =>
  knex.schema.alterTable('blocks', (table) => {
    table.dropPrimary('blocks_pkey');
    table.dropColumn('revision_id');
    table.string('revision');
    table.primary(['revision', 'block_id']);
  });

export const down = (knex) =>
  knex.schema.alterTable('blocks', (table) => {
    table.dropPrimary('blocks_pkey');
    table.dropColumn('revision');
    table.uuid('revision_id').primary();
  });
