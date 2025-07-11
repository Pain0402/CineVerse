exports.up = function (knex) {
  return knex.schema.createTable("movie_genres", function (table) {
    table
      .uuid("movie_id")
      .notNullable()
      .references("movie_id")
      .inTable("movies")
      .onDelete("CASCADE");

    table
      .integer("genre_id")
      .notNullable()
      .references("genre_id")
      .inTable("genres")
      .onDelete("CASCADE");

    table.primary(["movie_id", "genre_id"]);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("movie_genres");
};
