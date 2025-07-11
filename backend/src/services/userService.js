const UserModel = require("../models/userModel");
const bcrypt = require("bcryptjs");

const UserService = {
  getUserProfile: async (userId) => {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const { password_hash, ...userWithoutHash } = user;
    return userWithoutHash;
  },

  updateUserProfile: async (userId, updateData) => {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password_hash = await bcrypt.hash(updateData.password, salt);
      delete updateData.password; 
    }

    const [updatedUser] = await UserModel.update(userId, updateData);
    if (!updatedUser) {
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
