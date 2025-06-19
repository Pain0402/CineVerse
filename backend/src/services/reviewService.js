// src/services/reviewService.js
const ReviewModel = require("../models/reviewModel");
const MovieModel = require("../models/movieModel"); // Cần để cập nhật average_rating

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
    // Kiểm tra xem user đã review phim này chưa (thay vì UNIQUE constraint trên DB)
    // const existingReview = await ReviewModel.findByUserAndMovie(userId, movieId);
    // if (existingReview) {
    //   throw new Error('You have already reviewed this movie.');
    // }

    const newReview = await ReviewModel.create({
      user_id: userId,
      movie_id: movieId,
      rating,
      comment,
    });
    await ReviewService._updateMovieRating(movieId); // Cập nhật điểm trung bình phim
    return newReview;
  },

  updateReview: async (reviewId, userId, updateData) => {
    const review = await ReviewModel.findById(reviewId);
    if (!review) {
      throw new Error("Review not found");
    }
    // Đảm bảo chỉ chủ sở hữu review mới được cập nhật
    if (review.user_id !== userId) {
      throw new Error("Forbidden: You can only update your own reviews.");
    }

    const updatedReview = await ReviewModel.update(reviewId, updateData);
    await ReviewService._updateMovieRating(review.movie_id); // Cập nhật điểm trung bình phim
    return updatedReview;
  },

  deleteReview: async (reviewId, userId) => {
    const review = await ReviewModel.findById(reviewId);
    if (!review) {
      throw new Error("Review not found");
    }
    // Đảm bảo chỉ chủ sở hữu review hoặc admin mới được xóa
    if (review.user_id !== userId && req.user.role !== "admin") {
      // req.user.role sẽ được kiểm tra ở controller
      throw new Error("Forbidden: You can only delete your own reviews.");
    }

    await ReviewModel.delete(reviewId);
    await ReviewService._updateMovieRating(review.movie_id); // Cập nhật điểm trung bình phim
    return { message: "Review deleted successfully" };
  },

  // Hàm nội bộ để cập nhật average_rating và rating_count của phim
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
