if (process.env.DEMO_MODE) {
  exports.up = (knex) =>
    knex.schema.alterTable('users', (table) => {
      table.string('email').alter();
      table.string('password').alter();
      table.string('first_name').alter();
      table.string('last_name').alter();
    });

  exports.down = (knex) =>
    knex.schema.alterTable('users', (table) => {
      table.string('email').unique().notNullable().alter();
      table.string('password').notNullable().alter();
      table.string('first_name').notNullable().alter();
      table.string('last_name').notNullable().alter();
    });
} else {
  exports.up = () => {};
  exports.down = () => {};
}
