// Vị trí file: D:/CineVerse/backend/ecosystem.config.js
module.exports = {
  apps: [
    {
      // --- Cấu hình cho Backend ---
      name: "cineverse-api",
      script: "./src/server.js",
      instances: "max",
      exec_mode: "cluster",
      watch: false,
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
