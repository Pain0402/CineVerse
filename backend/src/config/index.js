// src/config/index.js
require("dotenv").config({ path: "../../.env" }); // Load biến môi trường từ .env

module.exports = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || "supersecretjwtkeyfallback", // Đảm bảo dùng secret mạnh trong .env
  db: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
  },
  // Thêm các cấu hình khác nếu cần
};
