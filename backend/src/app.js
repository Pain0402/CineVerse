// src/app.js
const express = require("express");
const cors = require("cors"); // Import cors middleware
const swaggerUi = require("swagger-ui-express");
// const YAML = require("yamljs");
// const path = require("path");

const app = express();

// 1. Middleware chung
app.use(express.json()); // Cho phép Express đọc JSON từ request body
app.use(express.urlencoded({ extended: true })); // Cho phép Express đọc dữ liệu từ URL-encoded form
app.use(cors()); // Cho phép tất cả các nguồn truy cập (có thể cấu hình cụ thể hơn trong production)

// 2. Định nghĩa các routes (chúng ta sẽ tạo các file này sau)
// const authRoutes = require('./routes/authRoutes');
// const movieRoutes = require('./routes/movieRoutes');
// const userRoutes = require('./routes/userRoutes');
// const reviewRoutes = require('./routes/reviewRoutes');

// app.use('/api/auth', authRoutes);
// app.use('/api/movies', movieRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/reviews', reviewRoutes);

// 3. Cấu hình Swagger/OpenAPI (Tài liệu API)
// Đảm bảo file swagger.yaml nằm ở thư mục gốc của backend hoặc /src
const swaggerDoc = require("../docs/openapiSpec.json"); // Import file JSON đã chuyển đổi từ YAML
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// 4. Middleware xử lý lỗi (sẽ tạo chi tiết sau)
// const errorHandler = require('./middlewares/errorHandler');
// app.use(errorHandler);

// Endpoint kiểm tra server hoạt động
app.get("/", (req, res) => {
  res.send("CineVerse Backend API is running!");
});

module.exports = app;
