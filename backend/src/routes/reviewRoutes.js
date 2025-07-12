const express = require("express");
const ReviewController = require("../controllers/reviewController");
const { protect } = require("../middlewares/authMiddleware");
const { apiLimiter } = require("../middlewares/rateLimitMiddleware");

const router = express.Router();

router.get("/movies/:movieId", apiLimiter, ReviewController.getReviewsForMovie);

router.post(
  "/movies/:movieId",
  protect,
  apiLimiter,
  ReviewController.createReview
);

router
  .route("/:reviewId")
  .put(protect, apiLimiter, ReviewController.updateReview)
  .delete(protect, apiLimiter, ReviewController.deleteReview);

module.exports = router;
