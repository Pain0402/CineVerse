// src/controllers/watchlistController.js
const WatchlistService = require("../services/watchlistService");

const WatchlistController = {
  getUserWatchlist: async (req, res, next) => {
    try {
      const userId = req.user.user_id; // Lấy từ token đã xác thực
      const filters = req.query; // Lấy các bộ lọc (status, movie_type)
      const watchlist = await WatchlistService.getUserWatchlist(
        userId,
        filters
      );
      res.status(200).json({ data: watchlist });
    } catch (error) {
      next(error);
    }
  },

  addOrUpdateWatchlistItem: async (req, res, next) => {
    try {
      const userId = req.user.user_id;
      const { movieId, status, currentEpisode } = req.body;

      if (!movieId || !status) {
        return res
          .status(400)
          .json({ message: "Movie ID and status are required." });
      }

      const item = await WatchlistService.addOrUpdateWatchlistItem(
        userId,
        movieId,
        status,
        currentEpisode
      );
      res.status(200).json({
        message: "Watchlist item updated/added successfully",
        data: item,
      });
    } catch (error) {
      next(error);
    }
  },

  getWatchlistItem: async (req, res, next) => {
    try {
      const userId = req.user.user_id;
      const { movieId } = req.params;
      const item = await WatchlistService.getWatchlistItem(userId, movieId);
      res.status(200).json({ data: item });
    } catch (error) {
      next(error);
    }
  },

  deleteWatchlistItem: async (req, res, next) => {
    try {
      const userId = req.user.user_id;
      const { movieId } = req.params; // Lấy movieId từ params để xóa
      await WatchlistService.deleteWatchlistItem(userId, movieId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};

module.exports = WatchlistController;
