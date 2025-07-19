// Giả định bạn đang dùng Knex.js và đã có file kết nối DB
const db = require("../db");

const ReviewService = {
  /**
   * Lấy tất cả review của một phim, kèm thông tin người dùng.
   */
  getReviewsByMovie: async (movieId) => {
    return db("reviews")
      .join("users", "reviews.user_id", "=", "users.user_id")
      .where("reviews.movie_id", movieId)
      .select("reviews.*", "users.username", "users.avatar_url");
  },

  /**
   * Tạo một review mới và cập nhật lại điểm trung bình của phim.
   */
  createReview: async (userId, movieId, rating, comment) => {
    // Sử dụng transaction để đảm bảo toàn vẹn dữ liệu
    return db.transaction(async (trx) => {
      // BƯỚC 1: Kiểm tra xem người dùng đã review phim này chưa
      const existingReview = await trx("reviews")
        .where({ user_id: userId, movie_id: movieId })
        .first();

      if (existingReview) {
        throw new ApiError(409, "Bạn đã đánh giá phim này rồi."); // 409 Conflict
      }

      // BƯỚC 2: Thêm review mới vào bảng 'reviews'
      const [newReview] = await trx("reviews")
        .insert({
          user_id: userId,
          movie_id: movieId,
          rating,
          comment,
        })
        .returning("*");

      // BƯỚC 3: Cập nhật lại điểm của phim
      await ReviewService._updateMovieRating(movieId, trx);

      return newReview;
    });
  },

  /**
   * Cập nhật một review đã có.
   */
  updateReview: async (reviewId, userId, updateData) => {
    return db.transaction(async (trx) => {
      const review = await trx("reviews")
        .where({ review_id: reviewId })
        .first();
      if (!review) {
        throw new ApiError(404, "Không tìm thấy đánh giá.");
      }
      if (review.user_id !== userId) {
        throw new ApiError(
          403,
          "Bạn chỉ có thể cập nhật đánh giá của chính mình."
        );
      }

      const [updatedReview] = await trx("reviews")
        .where({ review_id: reviewId })
        .update(updateData)
        .returning("*");

      await ReviewService._updateMovieRating(review.movie_id, trx);

      return updatedReview;
    });
  },

  /**
   * Xóa một review.
   */
  deleteReview: async (reviewId, user) => {
    return db.transaction(async (trx) => {
      const review = await trx("reviews")
        .where({ review_id: reviewId })
        .first();
      if (!review) {
        throw new ApiError(404, "Không tìm thấy đánh giá.");
      }
      // Cho phép chủ sở hữu hoặc admin xóa
      if (review.user_id !== user.user_id && user.role !== "admin") {
        throw new ApiError(403, "Bạn không có quyền xóa đánh giá này.");
      }

      await trx("reviews").where({ review_id: reviewId }).del();
      await ReviewService._updateMovieRating(review.movie_id, trx);

      return { message: "Đã xóa đánh giá thành công." };
    });
  },

  /**
   * (Hàm nội bộ) Tính toán và cập nhật điểm trung bình cho một phim.
   * @param {string} movieId - ID của phim cần cập nhật.
   * @param {object} trx - Đối tượng transaction của Knex.
   */
  _updateMovieRating: async (movieId, trx) => {
    // Hàm này phải được gọi bên trong một transaction
    const stats = await trx("reviews").where("movie_id", movieId).first(
      // Yêu cầu DB trả về kết quả dưới dạng số để đảm bảo an toàn
      db.raw("CAST(COUNT(*) AS INTEGER) as count"),
      db.raw("CAST(SUM(rating) AS REAL) as sum")
    );

    const ratingCount = stats.count || 0;
    const ratingSum = stats.sum || 0;

    // Đảm bảo không chia cho 0 và làm tròn đến 1 chữ số thập phân
    const averageRating =
      ratingCount > 0 ? (ratingSum / ratingCount).toFixed(1) : 0.0;

    return trx("movies")
      .where("movie_id", movieId)
      .update({
        average_rating: parseFloat(averageRating),
        rating_count: ratingCount,
      });
  },
};

module.exports = ReviewService;
