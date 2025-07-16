const ReviewModel = require("../models/reviewModel");
const MovieModel = require("../models/movieModel");

const ReviewService = {
  getReviewsByMovie: async (movieId) => {
    return ReviewModel.findByMovieId(movieId);
  },

  getReviewById: async (reviewId) => {
    const review = await ReviewModel.findById(reviewId);
    if (!review) {
      throw new Error("Review not found");
    }
    return review;
  },

  createReview: async (userId, movieId, rating, comment) => {
    const newReview = await ReviewModel.create({
      user_id: userId,
      movie_id: movieId,
      rating,
      comment,
    });
    await ReviewService._updateMovieRating(movieId);
    return newReview;
  },

  updateReview: async (reviewId, userId, updateData) => {
    const review = await ReviewModel.findById(reviewId);
    if (!review) {
      throw new Error("Review not found");
    }
    if (review.user_id !== userId) {
      throw new Error("Forbidden: You can only update your own reviews.");
    }

    const updatedReview = await ReviewModel.update(reviewId, updateData);
    await ReviewService._updateMovieRating(review.movie_id);
    return updatedReview;
  },

  deleteReview: async (reviewId, userId) => {
    const review = await ReviewModel.findById(reviewId);
    if (!review) {
      throw new Error("Review not found");
    }
    if (review.user_id !== userId && req.user.role !== "admin") {
      throw new Error("Forbidden: You can only delete your own reviews.");
    }

    await ReviewModel.delete(reviewId);
    await ReviewService._updateMovieRating(review.movie_id);
    return { message: "Review deleted successfully" };
  },

  _updateMovieRating: async (movieId) => {
    const reviews = await ReviewModel.findByMovieId(movieId);
    const totalRatings = reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    const ratingCount = reviews.length;
    const averageRating =
      ratingCount > 0 ? (totalRatings / ratingCount).toFixed(1) : 0.0;

    await MovieModel.update(movieId, {
      average_rating: parseFloat(averageRating),
      rating_count: ratingCount,
    });
  },
};

module.exports = ReviewService;
