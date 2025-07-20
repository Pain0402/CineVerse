// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: "cineverse-frontend",
      script: "serve", // Lệnh 'serve' phải có trong PATH của hệ thống
      args: "frontend/dist -s -p 8085", // Đường dẫn tương đối từ vị trí của ecosystem.config.js
      interpreter: "none", // Quan trọng: Bảo PM2 không cố gắng chạy 'serve' bằng Node.js interpreter
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      // Sử dụng env_production thay vì env khi dùng --env production
      env_production: {
        NODE_ENV: "production",
        FE_PORT: 8085, // Biến môi trường cho serve (nếu serve sử dụng nó)
      },
    },
    {
      name: "cineverse-backend",
      script: "./backend/src/server.js", // Đảm bảo đường dẫn này đúng
      instances: "max",
      exec_mode: "cluster",
      autorestart: true,
      watch: false, // Tắt watch trong production
      ignore_watch: ["node_modules", ".git", "logs", "uploads"],
      max_memory_restart: "1G",
      // Sử dụng env_production thay vì env khi dùng --env production
      env_production: {
        NODE_ENV: "production",
        // PORT: 3000,
        // DATABASE_URL: "your_production_database_url", // Đảm bảo các biến này được đặt đúng
        // JWT_SECRET: "your_jwt_secret_key",
      },
      // env_development: { // Giữ lại nếu bạn muốn có cấu hình dev riêng biệt cho PM2
      //   NODE_ENV: 'development',
      //   PORT: 3000,
      // },
    },
  ],
};
