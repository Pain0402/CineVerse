const AuthService = require("../services/authService");

const AuthController = {
  register: async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
      if (!username || !email || !password) {
        return res.status(400).json({ message: "Please enter all fields" });
      }
      const { user, token } = await AuthService.register(
        username,
        email,
        password
      );
      res.status(201).json({
        message: "User registered successfully",
        user: {
          user_id: user.user_id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        token,
      });
    } catch (error) {
      next(error); 
    }
  },

  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "Please enter all fields" });
      }
      const { user, token } = await AuthService.login(email, password);
      res.status(200).json({
        message: "Logged in successfully",
        user: {
          user_id: user.user_id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        token,
      });
    } catch (error) {
      // console.error(error);
      // res.status(401).json({ message: error.message });
      next(error); // Chuyển lỗi cho middleware xử lý lỗi
    }
  },
};

module.exports = AuthController;
