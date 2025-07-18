// file: seeds/03_reviews_and_watchlists.js

const { faker } = require("@faker-js/faker");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Xóa dữ liệu cũ
  await knex("reviews").del();
  await knex("watchlists").del();

  console.log("Đang tạo dữ liệu reviews và watchlists...");

  // Lấy tất cả user_id và movie_id hiện có
  const users = await knex("users").select("user_id");
  const movies = await knex("movies").select("movie_id");

  if (users.length === 0 || movies.length === 0) {
    console.log("Không có user hoặc movie nào để tạo dữ liệu. Bỏ qua.");
    return;
  }

  const interactionsToInsert = [];
  const usedPairs = new Set(); // Dùng để tránh tạo cặp user-movie trùng lặp
  const numberOfInteractions = 2000; // Số lượng tương tác muốn tạo

  for (let i = 0; i < numberOfInteractions; i++) {
    const randomUser = faker.helpers.arrayElement(users);
    const randomMovie = faker.helpers.arrayElement(movies);
    const pairKey = `${randomUser.user_id}-${randomMovie.movie_id}`;

    // Nếu cặp user-movie này đã được sử dụng, bỏ qua
    if (usedPairs.has(pairKey)) {
      continue;
    }

    // 50% cơ hội sẽ tạo review
    if (Math.random() < 0.5) {
      interactionsToInsert.push(
        knex("reviews").insert({
          user_id: randomUser.user_id,
          movie_id: randomMovie.movie_id,
          rating: faker.number.float({ min: 1, max: 10, precision: 0.5 }),
          comment: faker.lorem.paragraph(),
        })
      );
    }

    // 70% cơ hội sẽ tạo watchlist entry
    if (Math.random() < 0.7) {
      const watchlistStatus = faker.helpers.arrayElement([
        "watching",
        "completed",
        "plan_to_watch",
        "dropped",
      ]);
      interactionsToInsert.push(
        knex("watchlists").insert({
          user_id: randomUser.user_id,
          movie_id: randomMovie.movie_id,
          status: watchlistStatus,
        })
      );
    }

    usedPairs.add(pairKey);
  }

  // Thực thi tất cả các lệnh insert và bỏ qua lỗi trùng lặp nếu có
  await Promise.all(interactionsToInsert).catch((err) => {
    if (!err.message.includes("unique constraint")) {
      console.error(err);
    }
  });

  console.log(`✅ Hoàn tất tạo khoảng ${usedPairs.size} tương tác người dùng.`);
};
