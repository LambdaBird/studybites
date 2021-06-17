export const up = (knex) =>
  knex.raw(`create extension if not exists "tablefunc"`);

export const down = (knex) => knex.raw(`drop extension if exists "tablefunc"`);
