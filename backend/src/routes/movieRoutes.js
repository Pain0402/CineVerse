// src/routes/movieRoutes.js
const express = require("express");
const MovieController = require("../controllers/movieController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const { apiLimiter } = require("../middlewares/rateLimitMiddleware"); // Import rate limiter

const router = express.Router();

// Các route công khai (không cần xác thực)
router.get("/", apiLimiter, MovieController.getAllMovies);
// router.get("/:id", apiLimiter, MovieController.getMovieById);
router.get("/:id", MovieController.getMovieById);

// Các route cần xác thực và quyền admin
router.post("/", protect, authorize("admin"), MovieController.createMovie);
router.put("/:id", protect, authorize("admin"), MovieController.updateMovie);
router.delete("/:id", protect, authorize("admin"), MovieController.deleteMovie);

module.exports = router;
