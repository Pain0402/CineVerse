const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");
const config = require("../config");

const AuthService = {
  register: async (username, email, password) => {
    const existingUser = await UserModel.findByCredentials(email);
    if (existingUser) {
      throw new Error("User with this email already exists.");
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await UserModel.create({
      username,
      email,
      password_hash: passwordHash,
      role: "user",
    });

    const token = jwt.sign(
      { user: { user_id: newUser.user_id, role: newUser.role } },
      config.jwtSecret, 
      { expiresIn: "1h" } 
    );

    return { user: newUser, token };
  },

  login: async (email, password) => {
    const user = await UserModel.findByCredentials(email);
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign(
      { user: { user_id: user.user_id, role: user.role } },
      config.jwtSecret,
      { expiresIn: "1h" }
    );

    return { user, token };
  },
};

module.exports = AuthService;
