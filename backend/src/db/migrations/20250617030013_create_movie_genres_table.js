// src/db/migrations/[timestamp]_create_movie_genres_table.js
exports.up = function (knex) {
  return knex.schema.createTable("movie_genres", function (table) {
    table
      .uuid("movie_id")
      .notNullable()
      .references("movie_id")
      .inTable("movies")
      .onDelete("CASCADE"); // Quan trọng: khi phim bị xóa, bản ghi liên kết cũng xóa

    table
      .integer("genre_id")
      .notNullable()
      .references("genre_id")
      .inTable("genres")
      .onDelete("CASCADE"); // Quan trọng: khi thể loại bị xóa, bản ghi liên kết cũng xóa

    table.primary(["movie_id", "genre_id"]); // Khóa chính tổ hợp
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("movie_genres");
};
