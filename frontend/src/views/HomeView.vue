<template>
  <div class="home-main" :style="{ backgroundImage: bannerImage }">
    <div class="cineverse-theme">
      <HeroSlider />
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
import HeroSlider from '@/components/HeroSlider.vue';

const imageUrls = [
  'https://wallpapers.com/images/high/earth-in-the-universe-a879b6hwwtbywot0.webp',
  'https://wallpapers.com/images/high/massive-glowing-black-hole-in-outer-space-qngqcv0ctzmhbqin.webp',
  'https://wallpapers.com/images/high/glimmering-view-of-jupiter-s-swirling-storms-from-orbit-dhl1zqfocnm26ot8.webp',
  'https://wallpapers.com/images/high/mysterious-exoplanet-orbiting-in-a-vibrant-cosmic-galaxy-with-glowing-nebulae-and-distant-stars-zfrdrrubov679nsw.webp',
  'https://wallpapers.com/images/high/void-5sm9tokk2youui90.webp',
  'https://wallpapers.com/images/hd/tree-and-vast-universe-hk1a2py5d3x1tpgf.webp',
  'https://cdn.pixabay.com/photo/2018/08/15/13/10/new-year-background-3608029_1280.jpg'
];

// 2. Lấy một URL ngẫu nhiên
const randomIndex = Math.floor(Math.random() * imageUrls.length);
const selectedUrl = imageUrls[randomIndex];

// 3. Tạo một biến reactive 'ref' để lưu trữ URL và cung cấp cho template.
//    Logic này sẽ chạy một lần khi component được thiết lập.
const bannerImage = ref(`url(${selectedUrl})`);


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
      cineverseService.getMovies({ genre: 'anime', limit: 10 }),
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
  /* background-image: url(https://cdn.pixabay.com/photo/2018/08/15/13/10/new-year-background-3608029_1280.jpg); */
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
</style>
