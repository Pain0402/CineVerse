// src/routes/watchlistRoutes.js
const express = require("express");
const WatchlistController = require("../controllers/watchlistController");
const { protect } = require("../middlewares/authMiddleware");
const { apiLimiter } = require("../middlewares/rateLimitMiddleware");

const router = express.Router();

// Lấy danh sách xem của người dùng hiện tại
router.get("/", protect, apiLimiter, WatchlistController.getUserWatchlist);

// Thêm/cập nhật một mục trong danh sách xem
router.post(
  "/",
  protect,
  apiLimiter,
  WatchlistController.addOrUpdateWatchlistItem
);

// Lấy một mục cụ thể trong danh sách xem
router.get(
  "/:movieId",
  protect,
  apiLimiter,
  WatchlistController.getWatchlistItem
);

// Xóa một mục khỏi danh sách xem
router.delete(
  "/:movieId",
  protect,
  apiLimiter,
  WatchlistController.deleteWatchlistItem
);

module.exports = router;
