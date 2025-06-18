// src/services/movieService.js
const MovieModel = require("../models/movieModel");

const MovieService = {
  getAllMovies: async (filters) => {
    return MovieModel.findAll(filters);
  },

  getMovieById: async (id) => {
    const movie = await MovieModel.findById(id);
    if (!movie) {
      throw new Error("Movie not found");
    }
    return movie;
  },

  createMovie: async (movieData) => {
    // Có thể thêm logic kiểm tra dữ liệu đầu vào phức tạp hơn tại đây
    return MovieModel.create(movieData);
  },

  updateMovie: async (id, updateData) => {
    const movie = await MovieModel.findById(id);
    if (!movie) {
      throw new Error("Movie not found");
    }
    return MovieModel.update(id, updateData);
  },

  deleteMovie: async (id) => {
    const movie = await MovieModel.findById(id);
    if (!movie) {
      throw new Error("Movie not found");
    }
    return MovieModel.delete(id);
  },
};

module.exports = MovieService;
