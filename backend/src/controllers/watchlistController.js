const WatchlistService = require("../services/watchlistService");

const WatchlistController = {
  getUserWatchlist: async (req, res, next) => {
    try {
      const userId = req.user.user_id;
      const filters = req.query;
      const watchlist = await WatchlistService.getUserWatchlist(
        userId,
        filters
      );
      res.status(200).json({ status: "success", data: watchlist });
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
        status: "success",
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
      if (!item) {
        return res
          .status(404)
          .json({ status: "not_found", message: "Movie not in watchlist" });
      }
      res.status(200).json({ status: "success", data: item });
    } catch (error) {
      next(error);
    }
  },

  deleteWatchlistItem: async (req, res, next) => {
    try {
      const userId = req.user.user_id;
      const { movieId } = req.params;
      await WatchlistService.deleteWatchlistItem(userId, movieId);
      res
        .status(200)
        .json({
          status: "success",
          message: "Watchlist item deleted successfully",
        });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = WatchlistController;
