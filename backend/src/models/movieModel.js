const db = require("../db");
const { findById } = require("./userModel");

const TABLE_NAME = "movies";

const MovieModel = {
  findAll: async (filters = {}) => {
    let query = db(TABLE_NAME)
      .select("movies.*", db.raw("ARRAY_AGG(genres.name) as genres"))
      .leftJoin("movie_genres", "movies.movie_id", "movie_genres.movie_id")
      .leftJoin("genres", "movie_genres.genre_id", "genres.genre_id")
      .groupBy("movies.movie_id");

    // --- Lọc theo type ---
    if (filters.type) {
      query = query.where("movies.type", filters.type);
    }

    // --- Lọc theo genre_id ---
    if (filters.genre_id) {
      query = query.whereExists(function () {
        this.select("*")
          .from("movie_genres")
          .whereRaw("movie_genres.movie_id = movies.movie_id")
          .andWhere("movie_genres.genre_id", filters.genre_id);
      });
    }

    // --- Tìm kiếm theo title ---
    if (filters.search) {
      query = query.where("movies.title", "ilike", `%${filters.search}%`);
    }

    // --- Lọc theo năm phát hành ---
    if (filters.release_year) {
      query = query.where("movies.release_year", filters.release_year);
    }

    // --- Lọc theo status ---
    if (filters.status) {
      query = query.where("movies.status", filters.status);
    }

    // --- Sắp xếp ---
    const sortBy = filters.sortBy || "movies.created_at";
    const sortOrder = filters.sortOrder === "asc" ? "asc" : "desc";
    query = query.orderBy(sortBy, sortOrder);

    // --- Phân trang ---
    if (filters.page && filters.limit) {
      const limit = parseInt(filters.limit);
      const page = parseInt(filters.page);
      const offset = (page - 1) * limit;
      query = query.limit(limit).offset(offset);
    }

    return query;
  },

  findById: async (id) => {
    const movie = await db(TABLE_NAME)
      .select("movies.*", db.raw("ARRAY_AGG(genres.name) as genres"))
      .leftJoin("movie_genres", "movies.movie_id", "movie_genres.movie_id")
      .leftJoin("genres", "movie_genres.genre_id", "genres.genre_id")
      .where("movies.movie_id", id)
      .groupBy("movies.movie_id")
      .first();
    if (!movie) {
      throw new Error("Movie not found");
    }
    return movie;
  },

  create: async (movieData) => {
    const { genres, ...movieDetails } = movieData;
    const [newMovie] = await db(TABLE_NAME).insert(movieDetails).returning("*");

    if (genres && genres.length > 0) {
      const movieGenresData = genres.map((genreId) => ({
        movie_id: newMovie.movie_id,
        genre_id: genreId,
      }));
      await db("movie_genres").insert(movieGenresData);
    }
    return newMovie;
  },

  update: async (id, updateData) => {
    const { genres, ...movieDetails } = updateData;
    const [updatedMovie] = await db(TABLE_NAME)
      .where({ movie_id: id })
      .update(movieDetails)
      .returning("*");

    if (genres !== undefined) {
      await db("movie_genres").where({ movie_id: id }).del();
      if (genres && genres.length > 0) {
        const movieGenresData = genres.map((genreId) => ({
          movie_id: id,
          genre_id: genreId,
        }));
        await db("movie_genres").insert(movieGenresData);
      }
    }
    return updatedMovie;
  },

  delete: async (id) => {
    return db(TABLE_NAME).where({ movie_id: id }).del();
  },
};

module.exports = MovieModel;
