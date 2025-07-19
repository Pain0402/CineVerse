const express = require("express");
const multer = require("multer");
const path = require("path");
const { protect } = require("../middlewares/authMiddleware"); // Middleware xác thực người dùng
const User = require("../models/userModel"); // Model User của bạn

const router = express.Router();

// Cấu hình Multer để lưu file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/avatars/"); // Thư mục lưu avatar
  },
  filename: function (req, file, cb) {
    // Tạo tên file duy nhất: userId-timestamp.extension
    const uniqueSuffix =
      req.user.user_id + "-" + Date.now() + path.extname(file.originalname);
    cb(null, uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

// Route: POST /api/profile/avatar
// Middleware `authMiddleware` để đảm bảo người dùng đã đăng nhập
// Middleware `upload.single('avatar')` để xử lý file có key là 'avatar'
router.post(
  "/profile/avatar",
  protect,
  upload.single("avatar"),
  async (req, res) => {
    try {
      if (!req.file) {
        console.log("req.user:", req.user);
        console.log("req.file:", req);
        return res.status(400).send({ message: "Vui lòng chọn một file." });
      }

      // Lấy URL của file đã upload
      // Ví dụ: http://yourdomain.com/uploads/avatars/filename.jpg
      const avatarUrl = `${req.protocol}://${req.get("host")}/uploads/avatars/${
        req.file.filename
      }`;

      // Cập nhật URL avatar cho user trong database
      await User.update(req.user.user_id, { avatar_url: avatarUrl });

      // Trả về URL mới cho frontend
      res.status(200).send({
        message: "Upload avatar thành công!",
        avatar_url: avatarUrl,
      });
    } catch (error) {
      res.status(500).send({ message: "Lỗi máy chủ." });
    }
  }
);

module.exports = router;
