// src/models/movieModel.js
const db = require("../db");

const TABLE_NAME = "movies";

const MovieModel = {
  // Lấy tất cả phim
  findAll: async (filters = {}) => {
    let query = db(TABLE_NAME)
      .select("movies.*", db.raw("ARRAY_AGG(genres.name) as genres"))
      .leftJoin("movie_genres", "movies.movie_id", "movie_genres.movie_id")
      .leftJoin("genres", "movie_genres.genre_id", "genres.genre_id")
      .groupBy("movies.movie_id")
      .orderBy("movies.created_at", "desc"); // Sắp xếp theo thời gian tạo mới nhất

    // Áp dụng bộ lọc (ví dụ đơn giản)
    if (filters.type) {
      query = query.where("movies.type", filters.type);
    }
    if (filters.genre_id) {
      query = query.whereExists(function () {
        this.select("*")
          .from("movie_genres")
          .whereRaw("movie_genres.movie_id = movies.movie_id")
          .andWhere("movie_genres.genre_id", filters.genre_id);
      });
    }
    if (filters.search) {
      query = query.where("movies.title", "ilike", `%${filters.search}%`);
    }

    return query;
  },

  // Tìm phim theo ID
  findById: async (id) => {
    return db(TABLE_NAME)
      .select("movies.*", db.raw("ARRAY_AGG(genres.name) as genres"))
      .leftJoin("movie_genres", "movies.movie_id", "movie_genres.movie_id")
      .leftJoin("genres", "movie_genres.genre_id", "genres.genre_id")
      .where("movies.movie_id", id)
      .groupBy("movies.movie_id")
      .first();
  },

  // Tạo phim mới
  create: async (movieData) => {
    const { genres, ...movieDetails } = movieData; // Tách genres ra
    const [newMovie] = await db(TABLE_NAME).insert(movieDetails).returning("*");

    if (genres && genres.length > 0) {
      // Chèn vào bảng movie_genres
      const movieGenresData = genres.map((genreId) => ({
        movie_id: newMovie.movie_id,
        genre_id: genreId,
      }));
      await db("movie_genres").insert(movieGenresData);
    }
    return newMovie;
  },

  // Cập nhật phim
  update: async (id, updateData) => {
    const { genres, ...movieDetails } = updateData; // Tách genres ra
    const [updatedMovie] = await db(TABLE_NAME)
      .where({ movie_id: id })
      .update(movieDetails)
      .returning("*");

    // Cập nhật lại các thể loại (xóa cũ, thêm mới)
    if (genres !== undefined) {
      // Chỉ cập nhật nếu genres được cung cấp
      await db("movie_genres").where({ movie_id: id }).del(); // Xóa tất cả genres cũ
      if (genres && genres.length > 0) {
        const movieGenresData = genres.map((genreId) => ({
          movie_id: id,
          genre_id: genreId,
        }));
        await db("movie_genres").insert(movieGenresData); // Thêm genres mới
      }
    }
    return updatedMovie;
  },

  // Xóa phim
  delete: async (id) => {
    return db(TABLE_NAME).where({ movie_id: id }).del();
  },
};

module.exports = MovieModel;
