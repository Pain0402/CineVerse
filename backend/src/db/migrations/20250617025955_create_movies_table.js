exports.up = function (knex) {
  return knex.schema.createTable("movies", function (table) {
    // --- Các cột chính ---
    table.uuid("movie_id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.integer("tmdb_id").notNullable().unique().index(); // Thêm notNullable
    table.string("title", 255).notNullable().index(); // Thêm index để tìm kiếm theo tên nhanh hơn
    table.string("original_title", 255);

    // --- Chi tiết phim ---
    table.date("release_date"); // Đổi thành kiểu 'date' để lưu ngày đầy đủ
    table.text("synopsis");
    table.string("poster_url", 500);
    table.string("trailer_url", 500);
    table.integer("runtime_minutes");
    table.integer("episode_count");

    // --- Phân loại & Trạng thái ---
    table.string("type", 20).notNullable().checkIn(["movie", "tv_series"]);
    table
      .string("status", 20)
      .notNullable()
      .checkIn(["released", "airing", "upcoming", "cancelled"]);

    // --- Dữ liệu Rating ---
    table.decimal("average_rating", 3, 1).notNullable().defaultTo(0.0); // 3,1 là đủ cho thang 10.0
    table.integer("rating_count").notNullable().defaultTo(0);

    // --- Timestamps ---
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("movies");
};
