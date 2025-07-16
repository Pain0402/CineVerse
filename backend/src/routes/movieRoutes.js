const express = require("express");
const MovieController = require("../controllers/movieController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const { apiLimiter } = require("../middlewares/rateLimitMiddleware");

const router = express.Router();

router.get("/", apiLimiter, MovieController.getAllMovies);
router.get("/advanced", apiLimiter, MovieController.getAllMoviesAdvanced);
router.get("/:id", apiLimiter, MovieController.getMovieById);
router.post("/", protect, authorize("admin"), MovieController.createMovie);
router.put("/:id", protect, authorize("admin"), MovieController.updateMovie);
router.delete("/:id", protect, authorize("admin"), MovieController.deleteMovie);

module.exports = router;
