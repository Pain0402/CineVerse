exports.up = function (knex) {
  return knex.schema.createTable("movies", function (table) {
    table.uuid("movie_id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.string("title", 255).notNullable();
    table.string("original_title", 255);
    table.integer("release_year");
    table.text("synopsis");
    table.string("poster_url", 255);
    table.string("trailer_url", 255);
    table.integer("runtime_minutes");
    table.integer("episode_count").defaultTo(1);
    table
      .string("status", 20)
      .notNullable()
      .defaultTo("released")
      .checkIn(["released", "airing", "upcoming", "cancelled"]);
    table.string("type", 20).notNullable().checkIn(["movie", "tv_series"]);
    table.decimal("average_rating", 4, 1).notNullable().defaultTo(0.0);
    table.integer("rating_count").notNullable().defaultTo(0);
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("movies");
};
