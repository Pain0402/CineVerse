require("dotenv").config({ path: "./.env" });

module.exports = {
  development: {
    client: "pg", 
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    migrations: {
      tableName: "knex_migrations", // Tên bảng lưu lịch sử migrations
      directory: "./src/db/migrations", // Thư mục chứa các file migration
    },
    seeds: {
      directory: "./src/db/seeds", // Thư mục chứa các file seeders (dữ liệu mẫu)
    },
    pool: {
      // Cấu hình pool kết nối
      min: 2,
      max: 10,
    },
  },

  production: {
    client: "pg",
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: {
        rejectUnauthorized: false,
      },
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "./src/db/migrations",
    },
    pool: {
      min: 2,
      max: 10,
    },
  },
};
