// src/middlewares/rateLimitMiddleware.js
const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 5, // Tối đa 5 request trong windowMs
  message:
    "Too many login attempts from this IP, please try again after 15 minutes",
  handler: (req, res, next, options) => {
    // Tùy chỉnh phản hồi khi bị rate limit
    res.status(options.statusCode).json({ message: options.message });
  },
});

const apiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 giờ
  max: 100, // Tối đa 100 request trong windowMs
  message: "Too many requests from this IP, please try again after an hour",
  handler: (req, res, next, options) => {
    res.status(options.statusCode).json({ message: options.message });
  },
});

module.exports = { loginLimiter, apiLimiter };
