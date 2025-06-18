// src/middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");
const config = require("../config");
const UserModel = require("../models/userModel"); // Để lấy thông tin user từ DB nếu cần

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Lấy token từ header "Bearer TOKEN"
      token = req.headers.authorization.split(" ")[1];

      // Giải mã token
      const decoded = jwt.verify(token, config.jwtSecret);

      // Lấy thông tin user từ DB (tùy chọn, nếu bạn muốn đảm bảo user vẫn tồn tại)
      req.user = await UserModel.findById(decoded.user.user_id);
      if (!req.user) {
        return res
          .status(401)
          .json({ message: "Not authorized, user not found" });
      }

      next(); // Chuyển sang middleware/controller tiếp theo
    } catch (error) {
      console.error("Auth Middleware Error:", error.message);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Middleware kiểm tra quyền (ví dụ: admin)
const authorize = (roles = []) => {
  if (typeof roles === "string") {
    roles = [roles];
  }

  return (req, res, next) => {
    if (!req.user) {
      // Đảm bảo đã chạy protect middleware trước đó
      return res.status(401).json({ message: "Authentication required" });
    }
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Forbidden: You do not have permission to perform this action",
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
