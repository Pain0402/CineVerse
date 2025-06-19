// src/models/reviewModel.js
const db = require("../db");

const TABLE_NAME = "reviews";

const ReviewModel = {
  // Tìm tất cả đánh giá cho một phim cụ thể
  findByMovieId: async (movieId) => {
    return db(TABLE_NAME)
      .where({ movie_id: movieId })
      .join("users", "reviews.user_id", "users.user_id")
      .select("reviews.*", "users.username", "users.avatar_url")
      .orderBy("created_at", "desc");
  },

  // Tìm một đánh giá cụ thể
  findById: async (id) => {
    return db(TABLE_NAME).where({ review_id: id }).first();
  },

  // Tạo đánh giá mới
  create: async (reviewData) => {
    const [newReview] = await db(TABLE_NAME).insert(reviewData).returning("*");
    return newReview;
  },

  // Cập nhật đánh giá
  update: async (id, updateData) => {
    const [updatedReview] = await db(TABLE_NAME)
      .where({ review_id: id })
      .update(updateData)
      .returning("*");
    return updatedReview;
  },

  // Xóa đánh giá
  delete: async (id) => {
    return db(TABLE_NAME).where({ review_id: id }).del();
  },
};

module.exports = ReviewModel;
