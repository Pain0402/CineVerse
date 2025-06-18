// src/models/userModel.js
const db = require("../db"); // Import Knex instance

const TABLE_NAME = "users";

const UserModel = {
  // Tìm người dùng theo ID
  findById: async (id) => {
    return db(TABLE_NAME).where({ user_id: id }).first();
  },

  // Tìm người dùng theo Email hoặc Username
  findByCredentials: async (email) => {
    return db(TABLE_NAME).where({ email }).first();
  },

  // Tạo người dùng mới
  create: async (userData) => {
    const [newUser] = await db(TABLE_NAME).insert(userData).returning("*");
    return newUser;
  },

  // Cập nhật người dùng
  update: async (id, updateData) => {
    const [updatedUser] = await db(TABLE_NAME)
      .where({ user_id: id })
      .update(updateData)
      .returning("*");
    return updatedUser;
  },

  // Xóa người dùng
  delete: async (id) => {
    return db(TABLE_NAME).where({ user_id: id }).del();
  },
};

module.exports = UserModel;
