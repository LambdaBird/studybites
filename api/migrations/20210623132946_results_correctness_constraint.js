exports.up = (knex) =>
  knex.schema.raw(`
    alter table results
    add constraint correctness_range
    check (correctness between 0 and 1); 
  `);

exports.down = (knex) =>
  knex.schema.raw(`
    alter table results
    drop constraint correctness_range
  `);
