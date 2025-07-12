const MovieService = require("../services/movieService");

const MovieController = {
  getAllMovies: async (req, res, next) => {
    try {
      const filters = req.query;
      const movies = await MovieService.getAllMovies(filters);
      res.status(200).json({
        status: "success",
        data: movies,
      });
    } catch (error) {
      next(error);
    }
  },

  getMovieById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const movie = await MovieService.getMovieById(id);

      if (!movie) {
        return res.status(404).json({
          status: "fail",
          message: "Movie not found",
        });
      }

      res.status(200).json({
        status: "success",
        data: movie,
      });
    } catch (error) {
      next(error);
    }
  },

  createMovie: async (req, res, next) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({
          status: "fail",
          message: "Forbidden: Only admins can add movies",
        });
      }

      const newMovie = await MovieService.createMovie(req.body);
      res.status(201).json({
        status: "success",
        data: newMovie,
      });
    } catch (error) {
      next(error);
    }
  },

  updateMovie: async (req, res, next) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({
          status: "fail",
          message: "Forbidden: Only admins can update movies",
        });
      }

      const { id } = req.params;
      const updatedMovie = await MovieService.updateMovie(id, req.body);

      if (!updatedMovie) {
        return res.status(404).json({
          status: "fail",
          message: "Movie not found",
        });
      }

      res.status(200).json({
        status: "success",
        data: updatedMovie,
      });
    } catch (error) {
      next(error);
    }
  },

  deleteMovie: async (req, res, next) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({
          status: "fail",
          message: "Forbidden: Only admins can delete movies",
        });
      }

      const { id } = req.params;
      const result = await MovieService.deleteMovie(id);

      if (!result) {
        return res.status(404).json({
          status: "fail",
          message: "Movie not found",
        });
      }

      res.status(204).json({
        status: "success",
        data: null,
      }); // Cũng có thể dùng res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = MovieController;
