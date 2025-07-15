<template>
  <div class="search-view-container">
    <div class="container py-5">
      <!-- Tiêu đề trang, hiển thị từ khóa tìm kiếm -->
      <h1 class="page-title mb-4">
        Kết quả tìm kiếm cho: <span class="text-starlight-yellow">"{{ searchQuery }}"</span>
      </h1>

      <div class="row g-4">
        <!-- Cột chính: Danh sách kết quả -->
        <div class="col-lg-8">
          <div class="results-list">
            <!-- Trạng thái Loading -->
            <div v-if="isLoading" class="loading-container">
              <div v-for="n in 5" :key="n" class="result-item-placeholder placeholder-glow mb-3">
                <div class="placeholder col-2 me-3" style="width: 80px; height: 120px;"></div>
                <div class="flex-grow-1">
                  <div class="placeholder col-6 mb-2"></div>
                  <div class="placeholder col-4"></div>
                </div>
              </div>
            </div>

            <!-- Trạng thái có kết quả -->
            <div v-else-if="results.length > 0">
              <RouterLink v-for="item in results" :key="item.id" :to="{ name: 'movie.detail', params: { id: item.id } }" class="result-item text-decoration-none">
                <img :src="item.posterUrl" class="item-poster" :alt="item.title" @error="handleImageError">
                <div class="item-details">
                  <h3 class="item-title">{{ item.title }}</h3>
                  <p class="item-meta">{{ item.year }} • {{ item.type }}</p>
                  <p class="item-cast">Diễn viên: {{ item.cast }}</p>
                </div>
              </RouterLink>
            </div>

            <!-- Trạng thái không có kết quả -->
            <div v-else class="text-center p-5 glass-pane">
              <h4 class="text-nebula-white">Không tìm thấy kết quả nào</h4>
              <p class="text-white-50">Vui lòng thử với một từ khóa khác.</p>
            </div>
          </div>
        </div>

        <!-- Cột phụ: Bộ lọc -->
        <div class="col-lg-4">
          <aside class="sidebar-filters glass-pane p-4">
            <!-- Lọc theo loại -->
            <div class="filter-group mb-4">
              <h5 class="filter-title">Lọc theo loại</h5>
              <div class="d-flex flex-wrap gap-2">
                <button class="btn btn-filter" :class="{active: activeFilter === 'all'}" @click="applyFilter('all')">Tất cả</button>
                <button class="btn btn-filter" :class="{active: activeFilter === 'movie'}" @click="applyFilter('movie')">Phim Điện Ảnh</button>
                <button class="btn btn-filter" :class="{active: activeFilter === 'tv_series'}" @click="applyFilter('tv_series')">Phim Truyền Hình</button>
                <button class="btn btn-filter" :class="{active: activeFilter === 'anime'}" @click="applyFilter('anime')">Anime</button>
              </div>
            </div>

            <!-- MỚI: Lọc theo thể loại -->
            <div class="filter-group">
              <h5 class="filter-title">Lọc theo thể loại</h5>
              <div class="d-flex flex-wrap gap-2">
                <button v-for="genre in genres" :key="genre" class="btn btn-filter" :class="{ active: activeGenre === genre }" @click="applyGenreFilter(genre)">
                  {{ genre }}
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import cineverseService from '@/services/cineverse.service';

const route = useRoute();

const searchQuery = ref('');
const results = ref([]);
const isLoading = ref(true);
const error = ref(null);
const activeFilter = ref('all');

// MỚI: Thêm state cho bộ lọc thể loại
const activeGenre = ref(null);
const genres = ref([
  "Action", "Adventure", "Comedy", "Drama", "Fantasy", "Science Fiction", "Thriller",
  "Horror", "Romance", "Mystery", "Animation", "Documentary", "Family", "Crime",
  "Historical", "Anime"
]);

// --- HÀM GỌI API ĐÃ ĐƯỢC CẬP NHẬT để nhận thêm bộ lọc genre ---
const fetchSearchResults = async (query, type, genre) => {
  if (!query) {
    results.value = [];
    isLoading.value = false;
    return;
  };

  isLoading.value = true;
  error.value = null;

  try {
    const params = { search: query };
    if (type && type !== 'all') {
      params.type = type;
    }
    // MỚI: Thêm genre vào tham số nếu có
    if (genre) {
      params.genre = genre;
    }

    const dataFromApi = await cineverseService.getMovies(params);

    results.value = dataFromApi.map(movie => ({
      id: movie.movie_id,
      title: movie.title,
      year: movie.release_year,
      type: movie.type === 'movie' ? 'Phim Điện Ảnh' : 'Phim Truyền Hình',
      cast: 'Đang cập nhật...',
      posterUrl: movie.poster_url,
    }));

  } catch (err) {
    error.value = 'Không thể tải kết quả tìm kiếm. Vui lòng thử lại.';
    results.value = [];
    console.error("Lỗi khi tìm kiếm:", err);
  } finally {
    isLoading.value = false;
  }
};

const handleImageError = (event) => {
  event.target.src = 'https://placehold.co/80x120/0D0C1D/F5F5FA?text=Cine';
};

const applyFilter = (filterType) => {
    activeFilter.value = filterType;
    fetchSearchResults(searchQuery.value, filterType, activeGenre.value);
}

// MỚI: Hàm áp dụng bộ lọc thể loại
const applyGenreFilter = (genre) => {
    // Nếu nhấn vào thể loại đang active, bỏ chọn nó
    if (activeGenre.value === genre) {
        activeGenre.value = null;
    } else {
        activeGenre.value = genre;
    }
    fetchSearchResults(searchQuery.value, activeFilter.value, activeGenre.value);
}

// Theo dõi sự thay đổi của query trên URL và gọi lại API
watch(
  () => route.query.q,
  (newQuery) => {
    searchQuery.value = newQuery || '';
    fetchSearchResults(newQuery, activeFilter.value, activeGenre.value);
  },
  { immediate: true }
);
</script>

<style scoped>
.search-view-container {
  padding-top: 100px; /* Khoảng trống cho navbar fixed-top */
  background-color: var(--deep-space-black);
  min-height: 100vh;
  color: var(--nebula-white);
}

.page-title {
  font-weight: 700;
  border-left: 4px solid var(--galaxy-purple);
  padding-left: 1rem;
}

.text-starlight-yellow {
  color: var(--starlight-yellow);
}

.glass-pane {
  background: var(--surface-glass);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid var(--border-glass);
  border-radius: 0.75rem;
}

/* --- Danh sách kết quả --- */
.result-item {
  display: flex;
  align-items: flex-start;
  padding: 1rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid var(--border-glass);
  transition: background-color 0.3s ease;
  color: inherit; /* Kế thừa màu chữ mặc định */
}
.result-item:hover {
  background-color: var(--surface-glass);
  border-radius: 0.5rem;
}
.result-item:last-child {
  border-bottom: none;
}

.item-poster {
  width: 80px;
  height: 120px;
  object-fit: cover;
  border-radius: 0.5rem;
  margin-right: 1.5rem;
  flex-shrink: 0;
}

.item-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--nebula-white);
  margin-bottom: 0.25rem;
}

.item-meta {
  color: #adb5bd;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.item-cast {
  font-size: 0.9rem;
  color: #6c757d;
}

/* --- Sidebar --- */
.sidebar-filters {
  position: sticky;
  top: 100px; /* Giữ sidebar cố định khi cuộn, cách top 100px (chiều cao navbar) */
}

.filter-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--starlight-yellow);
  margin-bottom: 1rem;
}

.btn-filter {
  background-color: rgba(245, 245, 250, 0.1);
  border: 1px solid var(--border-glass);
  color: var(--nebula-white);
  transition: all 0.3s ease;
}
.btn-filter:hover {
  background-color: var(--galaxy-purple);
  border-color: var(--galaxy-purple);
  color: white;
}
.btn-filter.active {
  background: linear-gradient(90deg, var(--galaxy-purple), var(--cosmic-blue));
  border-color: var(--cosmic-blue);
  color: white;
  font-weight: bold;
}

/* --- Loading Placeholder --- */
.result-item-placeholder {
  display: flex;
  align-items: center;
}
</style>
