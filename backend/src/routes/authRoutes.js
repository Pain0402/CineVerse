// src/routes/authRoutes.js
const express = require("express");
const AuthController = require("../controllers/authController");
const { loginLimiter } = require("../middlewares/rateLimitMiddleware"); // Import rate limiter

const router = express.Router();

router.post("/register", AuthController.register);
router.post("/login", loginLimiter, AuthController.login); // Áp dụng rate limit cho login

module.exports = router;
