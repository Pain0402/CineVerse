//Users table
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

//Genres table
exports.up = function (knex) {
  return knex.schema.createTable("genres", function (table) {
    table.increments("genre_id").primary(); // SERIAL
    table.string("name", 50).notNullable().unique();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("genres");
};

//Movies table
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
    table.decimal("average_rating", 3, 1).notNullable().defaultTo(0.0);
    table.integer("rating_count").notNullable().defaultTo(0);
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("movies");
};

//Movie Genres table
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

//  Reviews table
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

    table.decimal("rating", 3, 1).notNullable().checkBetween([0.0, 10.0]);
    table.text("comment");
    table.timestamps(true, true);

    table.unique(["user_id", "movie_id"]); // Mỗi user chỉ review 1 movie 1 lần
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("reviews");
};

// Watchlists table
exports.up = function (knex) {
  return knex.schema.createTable("watchlists", function (table) {
    table
      .uuid("watchlist_id")
      .primary()
      .defaultTo(knex.raw("gen_random_uuid()"));

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

    table
      .string("status", 20)
      .notNullable()
      .checkIn(["watching", "completed", "plan_to_watch", "dropped"]);
    table.integer("current_episode").notNullable().defaultTo(0);
    table.timestamp("added_at").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now()); // Không dùng .timestamps() vì cần kiểm soát riêng

    table.unique(["user_id", "movie_id"]); // Mỗi user chỉ có 1 trạng thái cho 1 movie
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("watchlists");
};
