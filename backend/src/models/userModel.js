const db = require("../db");

const TABLE_NAME = "users";

const UserModel = {
  findById: async (id) => {
    return db(TABLE_NAME).where({ user_id: id }).first();
  },

  findByCredentials: async (email) => {
    return db(TABLE_NAME).where({ email }).first();
  },

  create: async (userData) => {
    const [newUser] = await db(TABLE_NAME).insert(userData).returning("*");
    return newUser;
  },

  update: async (id, updateData) => {
    const [updatedUser] = await db(TABLE_NAME)
      .where({ user_id: id })
      .update(updateData)
      .returning("*");
    return updatedUser;
  },

  delete: async (id) => {
    return db(TABLE_NAME).where({ user_id: id }).del();
  },
};

module.exports = UserModel;
