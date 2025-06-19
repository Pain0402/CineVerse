// src/app.js
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require("path");

// Import routes
const authRoutes = require("./routes/authRoutes");
const movieRoutes = require("./routes/movieRoutes");
const userRoutes = require("./routes/userRoutes"); // Thêm dòng này
const reviewRoutes = require("./routes/reviewRoutes"); // Thêm dòng này
const watchlistRoutes = require("./routes/watchlistRoutes"); // Thêm dòng này

// Import middleware xử lý lỗi
const errorHandler = require("./middlewares/errorHandler");

const app = express();

// 1. Middleware chung
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// 2. Định nghĩa các routes
app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/users", userRoutes); // Mở comment/thêm
app.use("/api/reviews", reviewRoutes); // Mở comment/thêm
app.use("/api/watchlists", watchlistRoutes); // Mở comment/thêm

// 3. Cấu hình Swagger/OpenAPI (Tài liệu API)
const swaggerDoc = require("../docs/openapiSpec.json"); // Import file JSON đã chuyển đổi từ YAML
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// Endpoint kiểm tra server hoạt động
app.get("/", (req, res) => {
  res.send("CineVerse Backend API is running!");
});

// 4. Middleware xử lý lỗi (phải luôn đặt cuối cùng)
app.use(errorHandler);

module.exports = app;
