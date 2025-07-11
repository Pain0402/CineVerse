const UserService = require("../services/userService");

const UserController = {
  getMe: async (req, res, next) => {
    try {
      const user = await UserService.getUserProfile(req.user.user_id);
      res.status(200).json({ data: user });
    } catch (error) {
      next(error);
    }
  },

  getUserById: async (req, res, next) => {
    try {
      if (req.user.role !== "admin" && req.user.user_id !== req.params.id) {
        return res.status(403).json({
          message:
            "Forbidden: You can only view your own profile unless you are an admin",
        });
      }
      const user = await UserService.getUserProfile(req.params.id);
      res.status(200).json({ data: user });
    } catch (error) {
      next(error);
    }
  },

  updateMe: async (req, res, next) => {
    try {
      const updatedUser = await UserService.updateUserProfile(
        req.user.user_id,
        req.body
      );
      res
        .status(200)
        .json({ message: "Profile updated successfully", data: updatedUser });
    } catch (error) {
      next(error);
    }
  },

  updateUserById: async (req, res, next) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({
          message: "Forbidden: Only admins can update other user profiles",
        });
      }
      const updatedUser = await UserService.updateUserProfile(
        req.params.id,
        req.body
      );
      res.status(200).json({
        message: "User profile updated successfully by admin",
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  },

  deleteMe: async (req, res, next) => {
    try {
      await UserService.deleteUser(req.user.user_id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },

  deleteUserById: async (req, res, next) => {
    try {
      if (req.user.role !== "admin") {
        return res
          .status(403)
          .json({ message: "Forbidden: Only admins can delete other users" });
      }
      await UserService.deleteUser(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};

module.exports = UserController;
