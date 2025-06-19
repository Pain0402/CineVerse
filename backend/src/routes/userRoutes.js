// src/routes/userRoutes.js
const express = require("express");
const UserController = require("../controllers/userController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const { apiLimiter } = require("../middlewares/rateLimitMiddleware");

const router = express.Router();

// Route để người dùng xem/cập nhật/xóa hồ sơ của chính mình
router
  .route("/me")
  .get(protect, apiLimiter, UserController.getMe)
  .put(protect, apiLimiter, UserController.updateMe)
  .delete(protect, apiLimiter, UserController.deleteMe);

// Route cho Admin quản lý người dùng khác
router
  .route("/:id")
  .get(protect, authorize("admin"), apiLimiter, UserController.getUserById)
  .put(protect, authorize("admin"), apiLimiter, UserController.updateUserById)
  .delete(
    protect,
    authorize("admin"),
    apiLimiter,
    UserController.deleteUserById
  );

module.exports = router;
