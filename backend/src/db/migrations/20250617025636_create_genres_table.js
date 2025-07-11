exports.up = function (knex) {
  return knex.schema.createTable("genres", function (table) {
    table.increments("genre_id").primary(); // SERIAL
    table.string("name", 50).notNullable().unique();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("genres");
};
