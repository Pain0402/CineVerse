<template>
  <div class="cineverse-theme movie-detail-page">
    <nav class="navbar navbar-expand-lg navbar-dark fixed-top glass-nav">
      <div class="container">
        <a class="navbar-brand fw-bold" href="/">
          <img class="navbar-brand-logo rotate-in-center" src="@/assets/imgs/universe.png" alt="">CineVerse</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <form class="d-flex flex-grow-1 mx-lg-5 my-2 my-lg-0" role="search">
            <input class="form-control me-2 search-bar" type="search" placeholder="Tìm kiếm phim, series, anime..."
              aria-label="Search">
          </form>
          <ul class="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
            <li class="nav-item"><a class="nav-link" href="#">Phim Điện Ảnh</a></li>
            <li class="nav-item"><a class="nav-link" href="#">Phim Truyền Hình</a></li>
            <li class="nav-item"><a class="nav-link" href="#">Anime</a></li>
            <li class="nav-item"><a class="nav-link" href="#">Cộng đồng</a></li>
            <li class="nav-item">
              <a class="nav-link" href="#">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                  class="bi bi-person-circle" viewBox="0 0 16 16">
                  <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                  <path fill-rule="evenodd"
                    d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
                </svg>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
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
      <header class="movie-banner" :style="{ backgroundImage: `url(${movie.backdropUrl})` }">
        <div class="banner-overlay">
          <div class="container">
            <div class="row align-items-center">
              <div class="col-md-4 text-center text-md-start">
                <img :src="movie.posterUrl" :alt="`Poster of ${movie.title}`"
                  class="img-fluid rounded-3 shadow-lg movie-poster" @error="handleImageError">
              </div>
              <div class="col-md-8 mt-4 mt-md-0">
                <h1 class="display-4 fw-bold">{{ movie.title }}</h1>
                <p class="text-muted fst-italic">{{ movie.tagline || movie.original_title }}</p>
                <div class="d-flex align-items-center gap-3 my-3">
                  <div v-if="movie.rating > 0" class="rating-badge">
                    <i class="fa-solid fa-star"></i>
                    {{ movie.rating }}
                  </div>
                  <span class="meta-info">{{ movie.year }}</span>
                  <span class="meta-info">{{ movie.duration }}</span>
                </div>
                <div class="genres my-3">
                  <span v-for="genre in movie.genres" :key="genre" class="badge genre-badge me-2">{{ genre }}</span>
                </div>
                <p class="lead synopsis">{{ movie.synopsis }}</p>
                <div class="action-buttons mt-4">
                  <button class="btn btn-accent btn-lg me-3">
                    <i class="fa-solid fa-plus"></i>
                    Thêm vào danh sách
                  </button>
                  <button class="btn btn-outline-light btn-lg">
                    <i class="fa-solid fa-pen-to-square"></i>
                    Viết đánh giá
                  </button>
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
            <section v-if="movie.trailerUrl" class="mb-5">
              <h3 class="section-title">Trailer</h3>
              <div class="ratio ratio-16x9 rounded-3 overflow-hidden">
                <iframe :src="movie.trailerUrl" title="YouTube video player" frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen></iframe>
              </div>
            </section>

            <!-- Bình luận -->
            <section>
              <h3 class="section-title">Bình luận & Đánh giá ({{ reviews.length }})</h3>
              <div class="review-box glass-surface p-4 rounded-3">
                <div v-if="reviews.length === 0" class="text-center text-muted p-3">Chưa có đánh giá nào. Hãy là người
                  đầu tiên!</div>
                <div v-for="review in reviews" :key="review.id" class="review-item mb-4">
                  <div class="d-flex align-items-start">
                    <img :src="review.author.avatarUrl" class="rounded-circle me-3" width="50" height="50"
                      @error="handleImageError">
                    <div>
                      <h6 class="mb-0">{{ review.author.name }}</h6>
                      <p class="text-muted small">{{ formatDate(review.date) }}</p>
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
                <li><strong>Trạng thái:</strong> <span>{{ movie.details.status }}</span></li>
                <li><strong>Ngôn ngữ gốc:</strong> <span>{{ movie.details.originalLanguage }}</span></li>
                <li><strong>Kinh phí:</strong> <span>{{ movie.details.budget }}</span></li>
                <li><strong>Doanh thu:</strong> <span>{{ movie.details.revenue }}</span></li>
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
import cineverseService from '@/services/cineverse.service'; // <-- Đảm bảo đường dẫn này đúng

const route = useRoute();
const movie = ref(null);
const reviews = ref([]);
const isLoading = ref(true);
const error = ref(null);

// Hàm tiện ích để chuyển đổi phút thành định dạng giờ và phút
const formatDuration = (minutes) => {
  if (!minutes) return '';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
};

// Hàm tiện ích để định dạng ngày tháng
const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Hàm tiện ích để nhúng link trailer Youtube
const getEmbedUrl = (url) => {
  if (!url) return '';
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname === 'www.youtube.com' || urlObj.hostname === 'youtube.com') {
      const videoId = urlObj.searchParams.get('v');
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (urlObj.hostname === 'youtu.be') {
      const videoId = urlObj.pathname.slice(1);
      return `https://www.youtube.com/embed/${videoId}`;
    }
  } catch (e) {
    console.error("Invalid trailer URL", e);
  }
  return url; // Trả về url gốc nếu không xử lý được
};


// Hàm xử lý lỗi hình ảnh
const handleImageError = (event) => {
  event.target.src = 'https://placehold.co/300x450/0D0C1D/F5F5FA?text=Not+Found';
};

// Hàm chính để tải dữ liệu
const fetchMovieData = async (id) => {
  isLoading.value = true;
  error.value = null;
  movie.value = null; // Reset dữ liệu cũ

  try {
    // Gọi API song song để tăng tốc độ
    const [movieData, reviewsData] = await Promise.all([
      cineverseService.getMovieById(id),
      cineverseService.getReviewsForMovie(id)
    ]);

    // Ánh xạ dữ liệu phim từ API
    movie.value = {
      id: movieData.movie_id,
      title: movieData.title,
      original_title: movieData.original_title,
      posterUrl: movieData.poster_url,
      backdropUrl: movieData.backdrop_url || movieData.poster_url, // Dùng poster nếu không có backdrop
      rating: movieData.average_rating,
      year: movieData.release_year,
      duration: formatDuration(movieData.runtime_minutes),
      genres: movieData.genres || [],
      synopsis: movieData.synopsis,
      trailerUrl: getEmbedUrl(movieData.trailer_url),
      details: {
        status: movieData.status,
        originalLanguage: 'English', // API hiện không có trường này
        budget: movieData.budget ? `$${new Intl.NumberFormat().format(movieData.budget)}` : 'N/A', // API hiện không có
        revenue: movieData.revenue ? `$${new Intl.NumberFormat().format(movieData.revenue)}` : 'N/A', // API hiện không có
      }
    };

    // Ánh xạ dữ liệu bình luận từ API
    reviews.value = reviewsData.map(review => ({
      id: review.review_id,
      author: {
        name: review.username,
        avatarUrl: review.avatar_url || 'https://placehold.co/100x100/2E73E8/FFFFFF?text=U'
      },
      date: review.created_at,
      comment: review.comment
    }));

  } catch (err) {
    console.error("Lỗi khi tải chi tiết phim:", err);
    error.value = err.message || 'Không tìm thấy phim bạn yêu cầu hoặc đã có lỗi xảy ra.';
  } finally {
    isLoading.value = false;
  }
};

// Theo dõi sự thay đổi của ID trên URL và gọi lại API
watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      fetchMovieData(newId);
    }
  },
  { immediate: true } // 'immediate: true' sẽ chạy watch ngay lần đầu tiên component được tạo
);

</script>

<style scoped>
/* (Giữ nguyên toàn bộ CSS từ file MovieDetailView trước đó) */
/* Import Google Font */
@import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;700&display=swap');

/* Theme và biến màu */
.cineverse-theme {
  --galaxy-purple: #5A42D4;
  --cosmic-blue: #2E73E8;
  --starlight-yellow: #FFD94D;
  --deep-space-black: #0D0C1D;
  --nebula-white: #F5F5FA;
  --surface-glass: rgba(245, 245, 250, 0.05);
  --border-glass: rgba(245, 245, 250, 0.2);

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
  background: linear-gradient(to top, var(--deep-space-black) 10%, rgba(13, 12, 29, 0.7) 50%, rgba(13, 12, 29, 0.4) 100%);
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

.review-item:not(:last-child) {
  border-bottom: 1px solid var(--border-glass);
  padding-bottom: 1rem;
}

.glass-nav {
  background: var(--surface-glass);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border-bottom: 1px solid var(--border-glass);
}

.navbar-brand .navbar-brand-logo {
  width: 40px;
  height: 40px;
  margin-right: 10px;
}

.navbar-brand:hover {
  color: var(--starlight-yellow);
}

.navbar-brand .navbar-brand-logo:hover {
  transform: rotate(10deg) scale(1.05);
  /* Xoay 10 độ và phóng to 5% */
}

/* Animation */
.rotate-in-center {
  animation: rotate-in-center 0.6s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
}

/* ----------------------------------------------
 * Generated by Animista on 2025-7-12 10:44:59
 * Licensed under FreeBSD License.
 * See http://animista.net/license for more info. 
 * w: http://animista.net, t: @cssanimista
 * ---------------------------------------------- */

/**
 * ----------------------------------------
 * animation rotate-in-center
 * ----------------------------------------
 */
@keyframes rotate-in-center {
  0% {
    transform: rotate(-360deg);
    opacity: 0;
  }

  100% {
    transform: rotate(0);
    opacity: 1;
  }
}

.nav-link:hover,
.nav-link:focus {
  color: var(--starlight-yellow);
}

.search-bar {
  background-color: rgba(0, 0, 0, 0.2);
  border: 1px solid var(--border-glass);
  color: var(--nebula-white);
}

.search-bar::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.search-bar:focus {
  background-color: rgba(0, 0, 0, 0.4);
  border-color: var(--starlight-yellow);
  box-shadow: 0 0 0 0.25rem rgba(255, 217, 77, 0.25);
  color: var(--nebula-white);
}
</style>
