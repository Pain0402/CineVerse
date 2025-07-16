<template>
  <div class="home-main">
    <div class="cineverse-theme">
      <!-- Vùng Hero Section (Giữ nguyên) -->
      <header class="hero-section d-flex align-items-center justify-content-center text-center">
        <div class="container">
          <h1 class="display-3 fw-bold">Khám Phá Vũ Trụ Điện Ảnh</h1>
          <p class="lead">Nơi mọi câu chuyện được kể và mọi cảm xúc được chia sẻ.</p>
          <a href="#content" class="btn btn-accent btn-lg mt-3">Bắt đầu khám phá</a>
        </div>
      </header>

      <!-- Nội dung chính - Các danh sách phim -->
      <main id="content" class="py-5">
        <div class="container">
          <div v-if="isLoading">
            Đang tải...
          </div>
          <div v-else-if="error" class="alert alert-danger">{{ error }}</div>

          <div v-else>
            <MovieList title="Thịnh hành trong tuần" :movies="trendingMovies" />
            <MovieList title="Đánh giá cao nhất" :movies="topRatedMovies" />
            <MovieList title="Anime Mới Cập Nhật" :movies="animeMovies" />
          </div>

        </div>
      </main>
    </div>
  </div>

</template>

<script setup>
import { ref, onMounted } from 'vue';
// 1. Import cineverseService và RouterLink
import cineverseService from '@/services/cineverse.service'; // <-- Đảm bảo đường dẫn này đúng
// import { RouterLink } from 'vue-router';
import MovieList from '@/components/MovieList.vue';

// 2. Tạo các biến trạng thái cho dữ liệu, loading và lỗi
const trendingMovies = ref([]);
const topRatedMovies = ref([]);
const animeMovies = ref([]);
const isLoading = ref(true);
const error = ref(null);

// 3. Hàm để gọi API và xử lý dữ liệu
const fetchAllMovies = async () => {
  try {
    isLoading.value = true;
    error.value = null;

    // Sử dụng Promise.all để gọi các API song song, tăng hiệu suất
    const [trendingData, topRatedData, animeData] = await Promise.all([
      cineverseService.getMovies({ limit: 10, sortBy: 'rating_count' }),
      cineverseService.getMovies({ limit: 10, sortBy: 'average_rating' }),
      cineverseService.getMovies({ type: 'anime_tv', limit: 10 }),
    ]);

    // 4. Ánh xạ dữ liệu từ API sang định dạng mà template đang sử dụng
    const mapApiData = (movie) => ({
      id: movie.movie_id,
      title: movie.title,
      posterUrl: movie.poster_url,
      averageRating: movie.average_rating,
    });

    trendingMovies.value = trendingData.map(mapApiData);
    topRatedMovies.value = topRatedData.map(mapApiData);
    animeMovies.value = animeData.map(mapApiData);

  } catch (err) {
    // Bắt lỗi và hiển thị thông báo
    error.value = err.message || 'Không thể tải dữ liệu từ máy chủ. Vui lòng thử lại sau.';
    console.error("Lỗi khi tải dữ liệu phim:", err);
  } finally {
    // Dù thành công hay thất bại, cũng kết thúc trạng thái loading
    isLoading.value = false;
  }
};

// 5. Gọi hàm fetch khi component được mounted
onMounted(() => {
  fetchAllMovies();
});
</script>

<style scoped>
/* Import Google Font */
@import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;700&display=swap');

.home-main {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-image: url(https://cdn.pixabay.com/photo/2018/08/15/13/10/new-year-background-3608029_1280.jpg);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-color: inherit;
  padding: 0;
  margin: 0;
}

.cineverse-theme {
  color: var(--nebula-white);
  font-family: 'Be Vietnam Pro', sans-serif;
  min-height: 100vh;
}

/* --- Vùng Hero --- */
.hero-section {
  padding-top: 150px;
  padding-bottom: 100px;
  min-height: 60vh;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48Y2lyY2xlIGN4PSI4MCIgY3k9IjIwIiByPSIxLjUiIGZpbGw9IiNmZmZmZmYiLz48Y2lyY2xlIGN4PSIyMCIgY3k9IjgwIiByPSIxIiBmaWxsPSIjZmZmZmZmIi8+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iMC41IiBmaWxsPSIjZmZmZmZmIi8+PC9zdmc+');
  opacity: 0.5;
  animation: sparkle 20s linear infinite;
}

@keyframes sparkle {
  from {
    transform: translateY(0);
  }

  to {
    transform: translateY(-100px);
  }
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
</style>
