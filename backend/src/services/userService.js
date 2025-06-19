// src/services/userService.js
const UserModel = require("../models/userModel");
const bcrypt = require("bcryptjs");

const UserService = {
  getUserProfile: async (userId) => {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    // Loại bỏ password_hash trước khi trả về
    const { password_hash, ...userWithoutHash } = user;
    return userWithoutHash;
  },

  updateUserProfile: async (userId, updateData) => {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Xử lý cập nhật mật khẩu nếu có
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password_hash = await bcrypt.hash(updateData.password, salt);
      delete updateData.password; // Xóa trường password gốc
    }

    const [updatedUser] = await UserModel.update(userId, updateData);
    if (!updatedUser) {
      // Kiểm tra lần nữa nếu update không thành công (trường hợp hiếm)
      throw new Error("Failed to update user profile");
    }
    const { password_hash, ...userWithoutHash } = updatedUser;
    return userWithoutHash;
  },

  deleteUser: async (userId) => {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    await UserModel.delete(userId);
    return { message: "User deleted successfully" };
  },
};

module.exports = UserService;
