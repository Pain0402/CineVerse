const genreModel = require("../models/genreModel");
const GenreService = {
  getAllGenres: async () => {
    return genreModel.findAll();
  },
};

module.exports = GenreService;
