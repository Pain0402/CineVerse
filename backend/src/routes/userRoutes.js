const express = require("express");
const UserController = require("../controllers/userController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const { apiLimiter } = require("../middlewares/rateLimitMiddleware");

const router = express.Router();

router
  .route("/me")
  .get(protect, apiLimiter, UserController.getMe)
  .put(protect, apiLimiter, UserController.updateMe)
  .delete(protect, apiLimiter, UserController.deleteMe);

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
