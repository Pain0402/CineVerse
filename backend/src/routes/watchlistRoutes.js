const express = require("express");
const WatchlistController = require("../controllers/watchlistController");
const { protect } = require("../middlewares/authMiddleware");
const { apiLimiter } = require("../middlewares/rateLimitMiddleware");

const router = express.Router();

router.get("/", protect, apiLimiter, WatchlistController.getUserWatchlist);

router.post(
  "/",
  protect,
  apiLimiter,
  WatchlistController.addOrUpdateWatchlistItem
);

router.get(
  "/:movieId",
  protect,
  apiLimiter,
  WatchlistController.getWatchlistItem
);

router.delete(
  "/:movieId",
  protect,
  apiLimiter,
  WatchlistController.deleteWatchlistItem
);

module.exports = router;
