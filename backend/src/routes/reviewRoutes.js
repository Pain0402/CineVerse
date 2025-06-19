// src/routes/reviewRoutes.js
const express = require("express");
const ReviewController = require("../controllers/reviewController");
const { protect } = require("../middlewares/authMiddleware");
const { apiLimiter } = require("../middlewares/rateLimitMiddleware");

const router = express.Router();

// Lấy tất cả reviews cho một phim (công khai)
router.get("/movies/:movieId", apiLimiter, ReviewController.getReviewsForMovie);

// Thêm review mới (yêu cầu đăng nhập)
router.post(
  "/movies/:movieId",
  protect,
  apiLimiter,
  ReviewController.createReview
);

// Cập nhật/xóa review (yêu cầu đăng nhập và là chủ sở hữu)
router
  .route("/:reviewId")
  .put(protect, apiLimiter, ReviewController.updateReview)
  .delete(protect, apiLimiter, ReviewController.deleteReview);

module.exports = router;
