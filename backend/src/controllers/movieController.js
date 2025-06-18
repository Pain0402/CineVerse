// src/controllers/movieController.js
const MovieService = require("../services/movieService");

const MovieController = {
  getAllMovies: async (req, res, next) => {
    try {
      const filters = req.query; // Lấy bộ lọc từ query parameters
      const movies = await MovieService.getAllMovies(filters);
      res.status(200).json({ data: movies });
    } catch (error) {
      next(error);
    }
  },

  getMovieById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const movie = await MovieService.getMovieById(id);
      res.status(200).json({ data: movie });
    } catch (error) {
      next(error);
    }
  },

  createMovie: async (req, res, next) => {
    try {
      // Kiểm tra quyền (ví dụ: chỉ admin mới được tạo phim)
      if (req.user.role !== "admin") {
        return res
          .status(403)
          .json({ message: "Forbidden: Only admins can add movies" });
      }
      const newMovie = await MovieService.createMovie(req.body);
      res
        .status(201)
        .json({ message: "Movie created successfully", data: newMovie });
    } catch (error) {
      next(error);
    }
  },

  updateMovie: async (req, res, next) => {
    try {
      if (req.user.role !== "admin") {
        return res
          .status(403)
          .json({ message: "Forbidden: Only admins can update movies" });
      }
      const { id } = req.params;
      const updatedMovie = await MovieService.updateMovie(id, req.body);
      res
        .status(200)
        .json({ message: "Movie updated successfully", data: updatedMovie });
    } catch (error) {
      next(error);
    }
  },

  deleteMovie: async (req, res, next) => {
    try {
      if (req.user.role !== "admin") {
        return res
          .status(403)
          .json({ message: "Forbidden: Only admins can delete movies" });
      }
      const { id } = req.params;
      await MovieService.deleteMovie(id);
      res.status(204).send(); // 204 No Content for successful deletion
    } catch (error) {
      next(error);
    }
  },
};

module.exports = MovieController;
