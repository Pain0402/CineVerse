// src/db/migrations/[timestamp]_create_movies_table.js
exports.up = function (knex) {
  return knex.schema.createTable("movies", function (table) {
    // Unique identifier for the movie/series. Using UUID for robust unique IDs.
    table.uuid("movie_id").primary().defaultTo(knex.raw("gen_random_uuid()"));

    // Main title of the movie/series. Cannot be null.
    table.string("title", 255).notNullable();

    // Original title, can be different from the main title (e.g., Japanese title for anime).
    table.string("original_title", 255); // Can be null

    // Year of release.
    table.integer("release_year"); // Can be null

    // Brief summary of the movie/series' plot. Using 'text' for potentially longer descriptions.
    table.text("synopsis"); // Can be null

    // URL to the main poster image. Increased length for typical URL sizes.
    table.string("poster_url", 500); // Can be null, increased length

    // URL to the trailer video. Increased length for typical URL sizes.
    table.string("trailer_url", 500); // Can be null, increased length

    // Runtime in minutes, primarily for 'movie' type content.
    // Set to nullable as it won't apply to 'series' type.
    table.integer("runtime_minutes").nullable();

    // Total number of episodes, primarily for 'series' type content.
    // Set to nullable as it won't apply to 'movie' type.
    table.integer("episode_count").nullable();

    // The production/release status of the content. Must be one of the defined values.
    // Aligned with OpenAPI schema: ["released", "in_production", "upcoming"]
    table
      .string("status", 20)
      .notNullable()
      .defaultTo("released")
      .checkIn(["released", "in_production", "upcoming"]);

    // The type of content: 'movie' for films, 'series' for TV series/anime TV.
    // Aligned with OpenAPI schema: ["movie", "series"]
    table
      .string("type", 20)
      .notNullable()
      .checkIn(["movie", "series"]);

    // The company that produced the movie/series. Added this column as it was in the seed file and OpenAPI.
    table.string("production_company", 255).nullable();

    // Average rating based on user reviews (e.g., 1-10 scale).
    // Decimal(precision, scale) for precise rating.
    table.decimal("average_rating", 3, 1).notNullable().defaultTo(0.0);

    // Number of ratings received, used to calculate average_rating.
    table.integer("rating_count").notNullable().defaultTo(0);

    // Automatically adds 'created_at' and 'updated_at' columns.
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  // Drops the 'movies' table when rolling back the migration.
  return knex.schema.dropTable("movies");
};
