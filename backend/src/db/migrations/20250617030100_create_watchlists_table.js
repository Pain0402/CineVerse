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
