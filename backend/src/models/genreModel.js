const db = require("../db");
const TABLE_NAME = "genres";
const GenreModel = {
  findAll: async () => {
    return db(TABLE_NAME).select("*");
  },
};
module.exports = GenreModel;
