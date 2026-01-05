const MovieService = require("../services/movieService");

const MovieController = {
  getAllMovies: async (req, res, next) => {
    try {
      const filters = req.query; // Lấy bộ lọc từ query parameters
      const movies = await MovieService.getAllMovies(filters);
      res.status(200).json({
        status: "success",
        data: movies,
      });
    } catch (error) {
      next(error);
    }
  },

  getAllMoviesAdvanced: async (req, res) => {
    try {
      const {
        type,
        genre_id,
        search,
        release_year,
        status,
        sortBy,
        sortOrder,
        page = 1,
        limit = 10,
      } = req.query;

      const filters = {
        type,
        genre_id: genre_id ? Number(genre_id) : undefined,
        search,
        release_year: release_year ? Number(release_year) : undefined,
        status,
        sortBy,
        sortOrder,
        page: Number(page),
        limit: Number(limit),
      };

      // Fetch movies with filters
      const movies = await MovieService.getAllMovies(filters);

      // Optional: Get total count (for pagination)
      const totalQuery = await MovieService.getAllMovies({
        ...filters,
        page: undefined,
        limit: undefined,
      });
      const total = totalQuery.length;

      return res.json({
        status: "success",
        data: {
          movies,
          pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / limit),
          },
        },
      });
    } catch (err) {
      return res
        .status(500)
        .json({ error: "Đã xảy ra lỗi khi lấy dữ liệu phim." });
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
      const { id } = req.params;
      await MovieService.deleteMovie(id);
      res.status(204).send(); // 204 No Content for successful deletion
    } catch (error) {
      next(error);
    }
  },
};

module.exports = MovieController;
