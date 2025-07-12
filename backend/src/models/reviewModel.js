const db = require("../db");

const TABLE_NAME = "reviews";

const ReviewModel = {
  findByMovieId: async (movieId) => {
    return db(TABLE_NAME)
      .where({ movie_id: movieId })
      .join("users", "reviews.user_id", "users.user_id")
      .select("reviews.*", "users.username", "users.avatar_url")
      .orderBy("created_at", "desc");
  },

  findById: async (id) => {
    return db(TABLE_NAME).where({ review_id: id }).first();
  },

  create: async (reviewData) => {
    const [newReview] = await db(TABLE_NAME).insert(reviewData).returning("*");
    return newReview;
  },

  update: async (id, updateData) => {
    const [updatedReview] = await db(TABLE_NAME)
      .where({ review_id: id })
      .update(updateData)
      .returning("*");
    return updatedReview;
  },

  delete: async (id) => {
    return db(TABLE_NAME).where({ review_id: id }).del();
  },
};

module.exports = ReviewModel;
