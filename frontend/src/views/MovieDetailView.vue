<template>
  <div class="cineverse-theme movie-detail-page">
    <!-- Trạng thái đang tải -->
    <div v-if="isLoading" class="loading-container d-flex justify-content-center align-items-center">
      <div class="spinner-border text-light" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Trạng thái lỗi -->
    <div v-else-if="error" class="container py-5 text-center">
      <div class="alert alert-danger">
        <h4 class="alert-heading">Đã xảy ra lỗi!</h4>
        <p>{{ error }}</p>
        <hr>
        <RouterLink to="/" class="btn btn-primary">Quay về trang chủ</RouterLink>
      </div>
    </div>

    <!-- Nội dung chính khi đã có dữ liệu -->
    <div v-else-if="movie">
      <!-- Banner Phim -->
      <!-- :style="{ backgroundImage: `url(${movie.backdrop_url || movie.poster_url})` }" -->
      <header class="movie-banner" :style="{ backgroundImage: bannerImage }">
        <div class="banner-overlay">
          <div class="container">
            <div class="row align-items-center">
              <div class="col-md-4 text-center text-md-start">
                <img :src="movie.poster_url" :alt="`Poster of ${movie.title}`"
                  class="img-fluid rounded-3 shadow-lg movie-poster" @error="handleImageError">
              </div>
              <div class="col-md-8 mt-4 mt-md-0">
                <h1 class="display-4 fw-bold">{{ movie.title }}</h1>
                <p class="text-light fst-italic">{{ movie.original_title }}</p>
                <div class="d-flex align-items-center gap-3 my-3">
                  <div v-if="movie.average_rating > 0" class="rating-badge">
                    <i class="fa-solid fa-star"></i>
                    {{ movie.average_rating }}
                  </div>
                  <span class="meta-info">{{ movie.release_year }}</span>
                  <span class="meta-info" v-if="movie.runtime_minutes">{{ formatDuration(movie.runtime_minutes)
                    }}</span>
                  <span class="meta-info" v-if="movie.episode_count && movie.type !== 'movie'">{{ movie.episode_count
                    }}
                    tập</span>
                </div>
                <div class="genres my-3">
                  <span v-for="genre in movie.genres" :key="genre" class="badge genre-badge me-2">{{ genre }}</span>
                </div>
                <p class="lead synopsis">{{ movie.synopsis }}</p>

                <!-- Action Buttons / Watchlist Edit Form -->
                <div class="action-buttons mt-4">
                  <div v-if="!authStore.isAuthenticated">
                    <button class="btn btn-accent btn-lg me-3" disabled>
                      <i class="fa-solid fa-plus"></i> Đăng nhập để thêm vào danh sách
                    </button>
                  </div>
                  <div v-else>
                    <!-- If movie is NOT in watchlist -->
                    <button v-if="!currentWatchlistItem" class="btn btn-accent btn-lg me-3"
                      @click="handleAddToWatchlist" :disabled="isUpdatingWatchlist">
                      <i class="fa-solid fa-plus"></i>
                      {{ isUpdatingWatchlist ? 'Đang thêm...' : 'Thêm vào danh sách' }}
                    </button>

                    <!-- If movie IS in watchlist -->
                    <div v-else class="watchlist-edit-form p-3 rounded-3 glass-surface">
                      <h5 class="mb-3">Chỉnh sửa danh sách xem</h5>
                      <div class="row g-3 align-items-end">
                        <div class="col-md-6">
                          <label for="watchlistStatus" class="form-label small text-muted">Trạng thái:</label>
                          <select class="form-select custom-select" id="watchlistStatus" v-model="watchlistForm.status">
                            <option value="watching">Đang xem</option>
                            <option value="completed">Đã xem</option>
                            <option value="plan_to_watch">Muốn xem</option>
                            <option value="dropped">Bỏ dở</option>
                          </select>
                        </div>
                        <div class="col-md-3" v-if="movie.type === 'tv_series' || movie.type === 'anime_tv'">
                          <label for="currentEpisode" class="form-label small text-muted">Tập hiện tại:</label>
                          <input type="number" class="form-control custom-input" id="currentEpisode"
                            v-model.number="watchlistForm.currentEpisode" min="0" :max="movie.episode_count || 9999" />
                        </div>
                        <div class="col-md-3">
                          <button class="btn gradient-button w-100" @click="handleUpdateWatchlist"
                            :disabled="isUpdatingWatchlist">
                            <i class="bi bi-arrow-clockwise me-1"></i>
                            {{ isUpdatingWatchlist ? 'Đang cập nhật...' : 'Cập nhật' }}
                          </button>
                        </div>
                      </div>
                      <div class="mt-3 text-end">
                        <button class="btn btn-sm btn-outline-danger" @click="handleRemoveFromWatchlist"
                          :disabled="isUpdatingWatchlist">
                          <i class="bi bi-trash me-1"></i>Xóa khỏi danh sách
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Nội dung chính -->
      <main class="container py-5">
        <div class="row">
          <!-- Cột chính (bên trái) -->
          <div class="col-lg-8">
            <!-- Trailer & Media -->
            <section v-if="movie.trailer_url" class="mb-5">
              <h3 class="section-title">Trailer</h3>
              <div class="ratio ratio-16x9 rounded-3 overflow-hidden">
                <iframe :src="getEmbedUrl(movie.trailer_url)" title="YouTube video player" frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen></iframe>
              </div>
            </section>

            <!-- Bình luận -->
            <section>
              <div class="d-flex justify-content-between align-items-center mb-4">
                <h3 class="section-title mb-0">Bình luận & Đánh giá ({{ reviews.length }})</h3>
                <!-- Sửa nút để toggle form -->
                <button v-if="authStore.isAuthenticated && !isWritingReview" @click="isWritingReview = true"
                  class="btn btn-accent">
                  <i class="fa-solid fa-pen-to-square me-2"></i>
                  Viết đánh giá
                </button>
              </div>

              <!-- Hiển thị form viết đánh giá -->
              <ReviewForm v-if="isWritingReview" :is-submitting="isSubmittingReview" @submit-review="handleReviewSubmit"
                @cancel="isWritingReview = false" />

              <div class="review-box glass-surface p-4 rounded-3">
                <div v-if="reviews.length === 0 && !isWritingReview" class="text-center text-muted p-3">Chưa có đánh giá
                  nào. Hãy là người
                  đầu tiên!</div>
                <div v-for="review in reviews" :key="review.review_id" class="review-item mb-4">
                  <div class="d-flex align-items-start">
                    <img :src="review.avatar_url || 'https://placehold.co/100x100/2E73E8/FFFFFF?text=U'"
                      class="rounded-circle me-3" width="50" height="50" @error="handleImageError">
                    <div>
                      <h6 class="mb-0">{{ review.username }}</h6>
                      <p class="text-muted small">{{ formatDate(review.created_at) }}</p>
                    </div>
                  </div>
                  <p class="mt-2">{{ review.comment }}</p>
                </div>
              </div>
            </section>
          </div>

          <!-- Cột phụ (bên phải) -->
          <aside class="col-lg-4 mt-5 mt-lg-0">
            <div class="glass-sidebar p-4 rounded-3 sticky-top">
              <h4 class="sidebar-title">Thông tin</h4>
              <ul class="list-unstyled info-list">
                <li><strong>Trạng thái:</strong> <span>{{ movie.status }}</span></li>
                <li><strong>Ngôn ngữ gốc:</strong> <span>{{ movie.original_language || 'N/A' }}</span></li>
                <li><strong>Kinh phí:</strong> <span>{{ movie.budget ? `$${new
                  Intl.NumberFormat().format(movie.budget)}` : 'N/A' }}</span></li>
                <li><strong>Doanh thu:</strong> <span>{{ movie.revenue ? `$${new
                  Intl.NumberFormat().format(movie.revenue)}` : 'N/A' }}</span></li>
              </ul>
            </div>
          </aside>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import cineverseService from '@/services/cineverse.service';
import { useAuthStore } from '@/stores/auth';
import ReviewForm from '@/components/ReviewForm.vue'; // Import form

const route = useRoute();
const authStore = useAuthStore();

const movie = ref(null);
const reviews = ref([]);
const isLoading = ref(true);
const error = ref(null);

// State cho form đánh giá
const isWritingReview = ref(false);
const isSubmittingReview = ref(false);

const currentWatchlistItem = ref(null);
const isUpdatingWatchlist = ref(false);
const watchlistForm = ref({
  status: 'plan_to_watch',
  currentEpisode: 0,
});

// 1. Tạo một mảng chứa 5 URL ảnh của bạn
const imageUrls = [
  'https://wallpapers.com/images/high/earth-in-the-universe-a879b6hwwtbywot0.webp',
  'https://wallpapers.com/images/high/massive-glowing-black-hole-in-outer-space-qngqcv0ctzmhbqin.webp',
  'https://wallpapers.com/images/high/glimmering-view-of-jupiter-s-swirling-storms-from-orbit-dhl1zqfocnm26ot8.webp',
  'https://wallpapers.com/images/high/mysterious-exoplanet-orbiting-in-a-vibrant-cosmic-galaxy-with-glowing-nebulae-and-distant-stars-zfrdrrubov679nsw.webp',
  'https://wallpapers.com/images/high/void-5sm9tokk2youui90.webp',
  'https://wallpapers.com/images/hd/tree-and-vast-universe-hk1a2py5d3x1tpgf.webp'
];

// 2. Lấy một URL ngẫu nhiên
const randomIndex = Math.floor(Math.random() * imageUrls.length);
const selectedUrl = imageUrls[randomIndex];

// 3. Tạo một biến reactive 'ref' để lưu trữ URL và cung cấp cho template.
//    Logic này sẽ chạy một lần khi component được thiết lập.
const bannerImage = ref(`url(${selectedUrl})`);

// Hàm xử lý khi submit form đánh giá
const handleReviewSubmit = async (reviewData) => {
  isSubmittingReview.value = true;
  try {
    const newReview = await cineverseService.createReview(movie.value.movie_id, reviewData);

    // Thêm thông tin user hiện tại vào review mới để hiển thị ngay lập tức
    const displayReview = {
      ...newReview,
      username: authStore.currentUser.username,
      avatar_url: authStore.currentUser.avatar_url
    };

    reviews.value.unshift(displayReview); // Thêm review mới vào đầu danh sách
    isWritingReview.value = false; // Ẩn form đi

  } catch (err) {
    console.error("Lỗi khi gửi đánh giá:", err);
    alert('Không thể gửi đánh giá. Vui lòng thử lại.');
  } finally {
    isSubmittingReview.value = false;
  }
};

// ... các hàm tiện ích và watchlist giữ nguyên ...
const formatDuration = (minutes) => {
  if (!minutes) return '';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
};
const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
};
const getEmbedUrl = (url) => {
  if (!url) return '';
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
      let videoId = urlObj.hostname.includes('youtube.com') ? urlObj.searchParams.get('v') : urlObj.pathname.slice(1);
      return `https://www.youtube.com/embed/${videoId}`;
    }
  } catch (e) { console.error("Invalid trailer URL", e); }
  return url;
};
const handleImageError = (event) => {
  event.target.src = 'https://placehold.co/300x450/0D0C1D/F5F5FA?text=Not+Found';
};
const fetchWatchlistItemStatus = async (movieId) => {
  if (!authStore.isAuthenticated) { currentWatchlistItem.value = null; return; }
  try {
    const item = await cineverseService.getWatchlistItem(movieId);
    currentWatchlistItem.value = item;
    watchlistForm.value.status = item.status;
    watchlistForm.value.currentEpisode = item.current_episode || 0;
  } catch (err) {
    if (err.message && err.message.includes('Movie not in watchlist')) {
      currentWatchlistItem.value = null;
    } else { console.error("Error fetching watchlist item status:", err); }
  }
};
const handleAddToWatchlist = async () => {
  if (!movie.value || isUpdatingWatchlist.value) return;
  isUpdatingWatchlist.value = true;
  try {
    await cineverseService.addOrUpdateWatchlistItem({ movieId: movie.value.movie_id, status: 'plan_to_watch', currentEpisode: 0 });
    await fetchWatchlistItemStatus(movie.value.movie_id);
    alert('Phim đã được thêm vào danh sách xem của bạn!');
  } catch (err) {
    console.error("Error adding to watchlist:", err);
    alert('Không thể thêm phim vào danh sách. Vui lòng thử lại.');
  } finally { isUpdatingWatchlist.value = false; }
};
const handleUpdateWatchlist = async () => {
  if (!movie.value || !currentWatchlistItem.value || isUpdatingWatchlist.value) return;
  isUpdatingWatchlist.value = true;
  try {
    await cineverseService.addOrUpdateWatchlistItem({ movieId: movie.value.movie_id, status: watchlistForm.value.status, currentEpisode: watchlistForm.value.currentEpisode });
    await fetchWatchlistItemStatus(movie.value.movie_id);
    alert('Danh sách xem đã được cập nhật!');
  } catch (err) {
    console.error("Error updating watchlist:", err);
    alert('Không thể cập nhật danh sách. Vui lòng thử lại.');
  } finally { isUpdatingWatchlist.value = false; }
};
const handleRemoveFromWatchlist = async () => {
  if (!movie.value || !currentWatchlistItem.value || isUpdatingWatchlist.value) return;
  if (!confirm('Bạn có chắc chắn muốn xóa phim này khỏi danh sách xem?')) { return; }
  isUpdatingWatchlist.value = true;
  try {
    await cineverseService.deleteWatchlistItem(movie.value.movie_id);
    currentWatchlistItem.value = null;
    alert('Phim đã được xóa khỏi danh sách xem.');
  } catch (err) {
    console.error("Error removing from watchlist:", err);
    alert('Không thể xóa phim khỏi danh sách. Vui lòng thử lại.');
  } finally { isUpdatingWatchlist.value = false; }
};
const fetchMovieData = async (id) => {
  isLoading.value = true;
  error.value = null;
  movie.value = null;
  reviews.value = [];
  currentWatchlistItem.value = null;
  try {
    const [movieResponse, reviewsResponse] = await Promise.all([
      cineverseService.getMovieById(id),
      cineverseService.getReviewsForMovie(id)
    ]);
    movie.value = movieResponse;
    if (!movie.value.backdrop_url) {
      movie.value.backdrop_url = movie.value.poster_url;
    }
    reviews.value = reviewsResponse.map(review => ({
      review_id: review.review_id,
      username: review.username,
      avatar_url: review.avatar_url || 'https://placehold.co/100x100/2E73E8/FFFFFF?text=U',
      created_at: review.created_at,
      comment: review.comment,
      rating: review.rating,
    }));
    if (authStore.isAuthenticated) {
      await fetchWatchlistItemStatus(id);
    }
  } catch (err) {
    console.error("Lỗi khi tải chi tiết phim:", err);
    error.value = err.message || 'Không tìm thấy phim bạn yêu cầu hoặc đã có lỗi xảy ra.';
  } finally {
    isLoading.value = false;
  }
};
watch(() => route.params.id, (newId) => {
  if (newId) { fetchMovieData(newId); }
}, { immediate: true });
watch(() => authStore.isAuthenticated, () => {
  if (movie.value && movie.value.movie_id) {
    fetchWatchlistItemStatus(movie.value.movie_id);
  }
});
</script>

<style scoped>
/* (Giữ nguyên toàn bộ CSS từ file MovieDetailView trước đó) */
/* Import Google Font */
@import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;700&display=swap');

/* Theme và biến màu */
.cineverse-theme {
  background-color: var(--deep-space-black);
  color: var(--nebula-white);
  font-family: 'Be Vietnam Pro', sans-serif;
  min-height: 100vh;
}

.loading-container {
  min-height: 100vh;
}

/* --- Banner Phim --- */
.movie-banner {
  position: relative;
  padding: 6rem 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

}

.banner-overlay {
  position: relative;
  z-index: 1;
  /* background: linear-gradient(to top, var(--deep-space-black) 10%, rgba(13, 12, 29, 0.7) 50%, rgba(13, 12, 29, 0.4) 100%); */
  background-color: var(--surface-glass);
  border: 1px solid var(--border-glass);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border-radius: 10px;
  padding: 2rem;
  /* margin: 0 18%; */
}

.movie-poster {
  max-width: 300px;
  margin: 0 auto;
  border: 3px solid var(--border-glass);
}

.rating-badge {
  background-color: var(--starlight-yellow);
  color: var(--deep-space-black);
  font-weight: bold;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  display: inline-flex;
  align-items: center;
}

.meta-info {
  font-size: 1.1rem;
  color: var(--nebula-white);
}

.genre-badge {
  background-color: var(--surface-glass);
  border: 1px solid var(--border-glass);
  color: var(--nebula-white);
  padding: 0.4em 0.8em;
  font-size: 0.9rem;
}

.synopsis {
  max-width: 600px;
  color: rgba(245, 245, 250, 0.8);
}

.btn-accent {
  background-color: var(--starlight-yellow);
  color: var(--deep-space-black);
  font-weight: bold;
  border: none;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.btn-accent:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(255, 217, 77, 0.2);
}

/* --- Nội dung chính --- */
.section-title {
  font-weight: 700;
  color: var(--nebula-white);
  border-left: 4px solid var(--galaxy-purple);
  padding-left: 1rem;
  margin-bottom: 1.5rem;
}

/* Cột phụ (Glassmorphism) */
.glass-sidebar {
  position: sticky;
  top: 100px;
  background: var(--surface-glass);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid var(--border-glass);
}

.sidebar-title {
  font-weight: 700;
  color: var(--nebula-white);
}

.info-list li {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--border-glass);
}

.info-list li:last-child {
  border-bottom: none;
}

.info-list li span {
  color: rgba(245, 245, 250, 0.7);
}

/* Khu vực bình luận */
.glass-surface {
  background: var(--surface-glass);
  border: 1px solid var(--border-glass);
}

.review-box {
  background: var(--surface-glass);
  border: 1px solid var(--border-glass);
  border-radius: 1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.review-item:not(:last-child) {
  border-bottom: 1px solid var(--border-glass);
  padding-bottom: 1rem;
}


/* Watchlist Edit Form Styles */
.watchlist-edit-form {
  background: var(--surface-glass);
  border: 1px solid var(--border-glass);
  padding: 1.5rem;
}

.watchlist-edit-form h5 {
  color: var(--starlight-yellow);
  font-weight: bold;
}

.custom-select,
.custom-input {
  background-color: rgba(245, 245, 250, 0.08);
  border: 1px solid var(--border-glass);
  color: var(--nebula-white);
  padding: 0.75rem 1.25rem;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.custom-select:focus,
.custom-input:focus {
  background-color: rgba(245, 245, 250, 0.15);
  border-color: var(--cosmic-blue);
  box-shadow: 0 0 0 0.25rem rgba(46, 115, 232, 0.25);
  color: var(--nebula-white);
}

.custom-select option {
  background-color: var(--deep-space-black);
  /* Màu nền cho option */
  color: var(--nebula-white);
  /* Màu chữ cho option */
}

.gradient-button {
  background: linear-gradient(90deg, var(--galaxy-purple), var(--cosmic-blue));
  border: none;
  color: var(--nebula-white);
  font-weight: bold;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.gradient-button:hover {
  background: linear-gradient(90deg, var(--cosmic-blue), var(--galaxy-purple));
  box-shadow: 0 6px 20px rgba(46, 115, 232, 0.4);
  transform: translateY(-2px);
}
</style>
