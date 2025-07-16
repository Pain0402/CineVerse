const GenreService = require("../services/genreService");

const GenreController = {
  getAllGenres: async (req, res, next) => {
    try {
      const genres = await GenreService.getAllGenres();
      res.status(200).json({
        status: "success",
        data: genres,
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = GenreController;
