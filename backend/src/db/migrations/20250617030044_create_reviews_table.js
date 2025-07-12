exports.up = function (knex) {
  return knex.schema.createTable("reviews", function (table) {
    table.uuid("review_id").primary().defaultTo(knex.raw("gen_random_uuid()"));

    table
      .uuid("user_id")
      .notNullable()
      .references("user_id")
      .inTable("users")
      .onDelete("CASCADE");

    table
      .uuid("movie_id")
      .notNullable()
      .references("movie_id")
      .inTable("movies")
      .onDelete("CASCADE");

    table.decimal("rating", 4, 1).notNullable().checkBetween([0.0, 10.0]);
    table.text("comment");
    table.timestamps(true, true);

    table.unique(["user_id", "movie_id"]); // Mỗi user chỉ review 1 movie 1 lần
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("reviews");
};
