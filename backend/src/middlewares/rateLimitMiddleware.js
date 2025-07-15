const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10,
  message:
    "Too many login attempts from this IP, please try again after minutes",
  handler: (req, res, next, options) => {
    res.status(options.statusCode).json({ message: options.message });
  },
});

const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10000,
  message: "Too many requests from this IP, please try again after minutes",
  handler: (req, res, next, options) => {
    res.status(options.statusCode).json({ message: options.message });
  },
});

module.exports = { loginLimiter, apiLimiter };
