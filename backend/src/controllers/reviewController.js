// src/controllers/reviewController.js
const ReviewService = require("../services/reviewService");

const ReviewController = {
  getReviewsForMovie: async (req, res, next) => {
    try {
      const { movieId } = req.params;
      const reviews = await ReviewService.getReviewsByMovie(movieId);
      res.status(200).json({ status: "success", data: reviews });
    } catch (error) {
      next(error);
    }
  },

  createReview: async (req, res, next) => {
    try {
      const { movieId } = req.params;
      const { rating, comment } = req.body;
      const userId = req.user.user_id; // Lấy từ token đã xác thực

      if (!rating || rating < 0 || rating > 10) {
        return res
          .status(400)
          .json({ message: "Rating must be between 0 and 10." });
      }

      const newReview = await ReviewService.createReview(
        userId,
        movieId,
        rating,
        comment
      );
      res
        .status(201)
        .json({ message: "Review created successfully", data: newReview });
    } catch (error) {
      next(error);
    }
  },

  updateReview: async (req, res, next) => {
    try {
      const { reviewId } = req.params;
      const userId = req.user.user_id; // Người dùng hiện tại
      const updatedReview = await ReviewService.updateReview(
        reviewId,
        userId,
        req.body
      );
      res
        .status(200)
        .json({ message: "Review updated successfully", data: updatedReview });
    } catch (error) {
      next(error);
    }
  },

  deleteReview: async (req, res, next) => {
    try {
      const { reviewId } = req.params;
      const userId = req.user.user_id; // Người dùng hiện tại
      // Có thể thêm kiểm tra vai trò admin ở đây nếu muốn admin cũng xóa được review
      await ReviewService.deleteReview(reviewId, userId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};

module.exports = ReviewController;
