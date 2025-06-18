// src/middlewares/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // Ghi log chi tiết lỗi cho việc debug

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode; // Mặc định lỗi server 500

  res.status(statusCode).json({
    message: err.message,
    // Chỉ hiện stack trace trong môi trường phát triển
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = errorHandler;
