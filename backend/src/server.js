require("dotenv").config(); // Load biến môi trường từ .env
const app = require("./app"); // Import ứng dụng Express đã cấu hình
const PORT = process.env.PORT || 5000; // Sử dụng port từ .env hoặc mặc định là 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
  console.log(`Access API docs at http://localhost:${PORT}/api-docs`);
});
