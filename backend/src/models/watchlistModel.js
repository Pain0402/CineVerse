const db = require("../db");

const TABLE_NAME = "watchlists";

const WatchlistModel = {
  findByUserId: async (userId, filters = {}) => {
    let query = db(TABLE_NAME)
      .where({ "watchlists.user_id": userId })
      .join("movies", "watchlists.movie_id", "movies.movie_id")
      .select(
        "watchlists.*",
        "movies.title",
        "movies.poster_url",
        "movies.type",
        "movies.release_date"
      );

    if (filters.status) {
      query = query.where("watchlists.status", filters.status);
    }
    if (filters.movie_type) {
      query = query.where("movies.type", filters.movie_type);
    }

    return query.orderBy("watchlists.updated_at", "desc");
  },

  findByUserAndMovie: async (userId, movieId) => {
    return db(TABLE_NAME).where({ user_id: userId, movie_id: movieId }).first();
  },

  addOrUpdate: async (data) => {
    const existingEntry = await WatchlistModel.findByUserAndMovie(
      data.user_id,
      data.movie_id
    );

    if (existingEntry) {
      const [updatedEntry] = await db(TABLE_NAME)
        .where({ watchlist_id: existingEntry.watchlist_id })
        .update(data)
        .returning("*");
      return updatedEntry;
    } else {
      const [newEntry] = await db(TABLE_NAME).insert(data).returning("*");
      return newEntry;
    }
  },

  delete: async (userId, movieId) => {
    return db(TABLE_NAME).where({ user_id: userId, movie_id: movieId }).del();
  },
};

module.exports = WatchlistModel;
