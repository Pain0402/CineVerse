// src/services/watchlistService.js
const WatchlistModel = require("../models/watchlistModel");
const MovieModel = require("../models/movieModel"); // Để kiểm tra movie có tồn tại không

const WatchlistService = {
  getUserWatchlist: async (userId, filters) => {
    return WatchlistModel.findByUserId(userId, filters);
  },

  addOrUpdateWatchlistItem: async (
    userId,
    movieId,
    status,
    currentEpisode = 0
  ) => {
    // Kiểm tra xem phim có tồn tại không
    const movie = await MovieModel.findById(movieId);
    if (!movie) {
      throw new Error("Movie not found");
    }

    const data = {
      user_id: userId,
      movie_id: movieId,
      status,
      current_episode: currentEpisode,
    };
    return WatchlistModel.addOrUpdate(data);
  },

  getWatchlistItem: async (userId, movieId) => {
    const item = await WatchlistModel.findByUserAndMovie(userId, movieId);
    if (!item) {
      throw new Error("Watchlist item not found");
    }
    return item;
  },

  deleteWatchlistItem: async (userId, movieId) => {
    const item = await WatchlistModel.findByUserAndMovie(userId, movieId);
    if (!item) {
      throw new Error("Watchlist item not found");
    }
    await WatchlistModel.delete(userId, movieId);
    return { message: "Watchlist item deleted successfully" };
  },
};

module.exports = WatchlistService;
