const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");
const config = require("../config"); // Cần tạo file config sau

const AuthService = {
  register: async (username, email, password) => {
    // Kiểm tra xem user đã tồn tại chưa
    const existingUser = await UserModel.findByCredentials(email);
    if (existingUser) {
      throw new Error("User with this email already exists.");
    }

    // Hash mật khẩu
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Tạo người dùng mới
    const newUser = await UserModel.create({
      username,
      email,
      password_hash: passwordHash,
      role: "user", // Mặc định role là user
    });

    // Tạo JWT Token
    const token = jwt.sign(
      { user: { user_id: newUser.user_id, role: newUser.role } },
      config.jwtSecret, // JWT_SECRET từ config
      { expiresIn: "1h" } // Token hết hạn sau 1 giờ
    );

    return { user: newUser, token };
  },

  login: async (email, password) => {
    // Tìm người dùng theo email
    const user = await UserModel.findByCredentials(email);
    if (!user) {
      throw new Error("Invalid credentials");
    }

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    // Tạo JWT Token
    const token = jwt.sign(
      { user: { user_id: user.user_id, role: user.role } },
      config.jwtSecret,
      { expiresIn: "1h" }
    );

    return { user, token };
  },
};

module.exports = AuthService;
