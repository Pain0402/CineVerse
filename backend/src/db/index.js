// src/db/index.js
const knexConfig = require("../../knexfile"); // Import cấu hình Knex
const knex = require("knex");

// Chọn cấu hình dựa trên môi trường (development/production)
const environment = process.env.NODE_ENV || "development";
const db = knex(knexConfig[environment]);

module.exports = db; // Export instance Knex đã kết nối
