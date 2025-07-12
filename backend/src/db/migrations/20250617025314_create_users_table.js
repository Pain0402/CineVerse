exports.up = function (knex) {
  return knex.schema.createTable("users", function (table) {
    table.uuid("user_id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.string("username", 50).notNullable().unique();
    table.string("email", 100).notNullable().unique();
    table.string("password_hash", 255).notNullable();
    table.text("bio");
    table.string("avatar_url", 255);
    table.string("role", 20).notNullable().defaultTo("user"); // Mặc định là 'user'
    table.timestamps(true, true); // Adds created_at and updated_at with defaults
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("users");
};
