exports.up = (knex) => knex.raw(`create extension if not exists "tablefunc"`);

exports.down = (knex) => knex.raw(`drop extension if exists "tablefunc"`);
