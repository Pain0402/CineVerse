<template>
  <div class="cineverse-theme admin-movie-management-page min-vh-100 py-5">
    <div class="container">
      <h1 class="text-starlight-yellow-glow text-center mb-5">Quản lý Phim & Anime</h1>

      <!-- Loading and Error States -->
      <div v-if="isLoading" class="loading-container d-flex justify-content-center align-items-center py-5">
        <div class="spinner-border text-light" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <div v-else-if="error" class="alert alert-danger text-center glassmorphism-card">
        <h4 class="alert-heading">Đã xảy ra lỗi!</h4>
        <p>{{ error }}</p>
        <hr>
        <RouterLink to="/" class="btn btn-primary">Quay về trang chủ</RouterLink>
      </div>

      <!-- Main Content -->
      <div v-else>
        <!-- Add New Movie Button & Search -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <button class="btn gradient-button" @click="openMovieModal('add')">
            <i class="fa-solid fa-plus"></i>Thêm Phim Mới
          </button>
          <div class="input-group w-50">
            <input type="text" class="form-control custom-input" placeholder="Tìm kiếm phim..." v-model="searchQuery"
              @keyup.enter="fetchMovies">
            <button class="btn gradient-button-small" @click="fetchMovies">
              <i class="fa-solid fa-magnifying-glass"></i>
            </button>
          </div>
        </div>

        <!-- Movies Table -->
        <div class="table-responsive glassmorphism-card p-3">
          <table class="table table-dark table-hover table-striped mb-0">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Tiêu đề</th>
                <th scope="col">Loại</th>
                <th scope="col">Năm</th>
                <th scope="col">Đánh giá</th>
                <th scope="col">Hành động</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="movies.length === 0">
                <td colspan="6" class="text-center text-muted py-4">Không tìm thấy phim nào.</td>
              </tr>
              <tr v-for="(movie, index) in movies" :key="movie.movie_id">
                <td>{{ index + 1 }}</td>
                <td>
                  <div class="d-flex align-items-center">
                    <img :src="movie.poster_url || 'https://placehold.co/50x75/0D0C1D/F5F5FA?text=N/A'"
                      class="rounded me-2" width="50" height="75" @error="handleImageError" />
                    <span>{{ movie.title }}</span>
                  </div>
                </td>
                <td>{{ movie.type }}</td>
                <td>{{ movie.release_year }}</td>
                <td>{{ movie.average_rating ? movie.average_rating : 'N/A' }}</td>
                <td>
                  <button class="btn btn-sm btn-outline-info me-2 custom-outline-btn"
                    @click="openMovieModal('edit', movie)">
                    <i class="fa-solid fa-pen"></i> </button>
                  <button class="btn btn-sm btn-outline-danger custom-outline-btn"
                    @click="confirmDelete(movie.movie_id)">
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <nav aria-label="Page navigation" class="mt-4">
          <ul class="pagination justify-content-center custom-pagination">
            <li class="page-item" :class="{ 'disabled': currentPage === 1 }">
              <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">Trước</a>
            </li>
            <li class="page-item" v-for="page in totalPages" :key="page" :class="{ 'active': currentPage === page }">
              <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
            </li>
            <li class="page-item" :class="{ 'disabled': currentPage === totalPages }">
              <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">Sau</a>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <!-- Add/Edit Movie Modal -->
    <div class="modal fade" id="movieModal" tabindex="-1" aria-labelledby="movieModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content glassmorphism-card">
          <div class="modal-header border-bottom border-glass">
            <h5 class="modal-title text-starlight-yellow-glow" id="movieModalLabel">
              {{ isEditing ? 'Chỉnh sửa Phim' : 'Thêm Phim Mới' }}
            </h5>
            <button type="button" class="btn-close custom-close-btn" data-bs-dismiss="modal"
              aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleSubmitMovie">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="title" class="form-label text-light">Tiêu đề <span class="text-danger">*</span></label>
                  <input type="text" class="form-control custom-input" id="title" v-model="movieForm.title" required>
                </div>
                <div class="col-md-6 mb-3">
                  <label for="original_title" class="form-label text-light">Tiêu đề gốc</label>
                  <input type="text" class="form-control custom-input" id="original_title"
                    v-model="movieForm.original_title">
                </div>
                <div class="col-md-4 mb-3">
                  <label for="type" class="form-label text-light primary">Loại <span
                      class="text-danger">*</span></label>
                  <select class="form-select custom-input" id="type" v-model="movieForm.type" required>
                    <option value="movie">Chọn loại</option>
                    <option value="movie">Phim Điện Ảnh</option>
                    <option value="tv_series">Phim Truyền Hình</option>
                    <!-- <option value="anime_tv">Anime TV</option>
                    <option value="anime_movie">Anime Điện Ảnh</option> -->
                  </select>
                </div>
                <div class="col-md-4 mb-3">
                  <label for="release_year" class="form-label text-light">Năm phát hành</label>
                  <input type="number" class="form-control custom-input" id="release_year"
                    v-model.number="movieForm.release_year" min="1800" max="2100">
                </div>
                <div class="col-md-4 mb-3">
                  <label for="status" class="form-label text-light">Trạng thái</label>
                  <select class="form-select custom-input" id="status" v-model="movieForm.status">
                    <option value="">Chọn trạng thái</option>
                    <option value="released">Đã phát hành</option>
                    <option value="airing">Đang chiếu</option>
                    <option value="upcoming">Sắp ra mắt</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>
                </div>
                <div class="col-md-6 mb-3">
                  <label for="runtime_minutes" class="form-label text-light">Thời lượng (phút)</label>
                  <input type="number" class="form-control custom-input" id="runtime_minutes"
                    v-model.number="movieForm.runtime_minutes" min="0">
                </div>
                <div class="col-md-6 mb-3">
                  <label for="episode_count" class="form-label text-light">Số tập (nếu có)</label>
                  <input type="number" class="form-control custom-input" id="episode_count"
                    v-model.number="movieForm.episode_count" min="1">
                </div>
                <div class="col-12 mb-3">
                  <label for="poster_url" class="form-label text-light">URL Poster</label>
                  <input type="url" class="form-control custom-input" id="poster_url" v-model="movieForm.poster_url">
                </div>
                <div class="col-12 mb-3">
                  <label for="trailer_url" class="form-label text-light">URL Trailer</label>
                  <input type="url" class="form-control custom-input" id="trailer_url" v-model="movieForm.trailer_url">
                </div>
                <div class="col-12 mb-3">
                  <label for="synopsis" class="form-label text-light">Tóm tắt nội dung</label>
                  <textarea class="form-control custom-input" id="synopsis" v-model="movieForm.synopsis"
                    rows="3"></textarea>
                </div>
                <div class="col-12 mb-3">
                  <label for="genres" class="form-label text-light">Thể loại (chọn nhiều)</label>
                  <select class="form-select custom-input" id="genres" v-model="movieForm.genres" multiple>
                    <option v-for="genre in availableGenres" :key="genre.genre_id" :value="genre.genre_id">{{ genre.name
                      }}
                    </option>
                  </select>
                  <small class="form-text text-light">Giữ Ctrl/Cmd để chọn nhiều.</small>
                </div>
              </div>
              <div class="modal-footer border-top border-glass mt-4">
                <button type="button" class="btn btn-secondary custom-outline-btn" data-bs-dismiss="modal">Hủy</button>
                <button type="submit" class="btn gradient-button" :disabled="isSubmitting">
                  <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2" role="status"
                    aria-hidden="true"></span>
                  {{ isSubmitting ? 'Đang lưu...' : 'Lưu' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div class="modal fade" id="deleteConfirmModal" tabindex="-1" aria-labelledby="deleteConfirmModalLabel"
      aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content glassmorphism-card">
          <div class="modal-header border-bottom border-glass">
            <h5 class="modal-title text-starlight-yellow-glow" id="deleteConfirmModalLabel">Xác nhận xóa</h5>
            <button type="button" class="btn-close custom-close-btn" data-bs-dismiss="modal"
              aria-label="Close"></button>
          </div>
          <div class="modal-body text-light">
            Bạn có chắc chắn muốn xóa phim này không? Hành động này không thể hoàn tác.
          </div>
          <div class="modal-footer border-top border-glass">
            <button type="button" class="btn btn-secondary custom-outline-btn" data-bs-dismiss="modal">Hủy</button>
            <button type="button" class="btn btn-danger gradient-button-danger" @click="deleteMovie"
              :disabled="isSubmitting">
              <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2" role="status"
                aria-hidden="true"></span>
              {{ isSubmitting ? 'Đang xóa...' : 'Xóa' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
// import { useRouter, RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import cineverseService from '@/services/cineverse.service';
import { Modal } from 'bootstrap'; // Import Bootstrap's Modal JS

// const router = useRouter();
const authStore = useAuthStore();

const movies = ref([]);
const pagination = ref({});
const isLoading = ref(true);
const error = ref(null);
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;
const totalPages = ref(1);

const isEditing = ref(false);
const movieForm = ref({
  movie_id: null, // For editing
  title: '',
  original_title: '',
  release_year: null,
  synopsis: '',
  poster_url: '',
  trailer_url: '',
  runtime_minutes: null,
  episode_count: 1,
  status: '',
  type: '',
  genres: [],
});
const movieModalInstance = ref(null); // To control Bootstrap modal manually
const deleteConfirmModalInstance = ref(null); // To control Bootstrap delete modal
const movieIdToDelete = ref(null); // Store ID of movie to be deleted
const isSubmitting = ref(false); // For form submission loading state

// Mock available genres (in a real app, you'd fetch these from an API like /genres)
const availableGenres = ref([

]);

const fetchGenres = async () => {
  try {
    const response = await cineverseService.getAllGenres();
    availableGenres.value = response;
  } catch (err) {
    console.error("Error fetching genres:", err);
    error.value = 'Không thể tải danh sách thể loại.';
  }
};


// --- Utility Functions ---
const handleImageError = (event) => {
  event.target.src = 'https://placehold.co/50x75/0D0C1D/F5F5FA?text=N/A'; // Placeholder for missing poster
};

// --- API Calls ---
const fetchMovies = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    // Check if user is admin
    if (!authStore.isAdmin) {
      error.value = 'Bạn không có quyền truy cập trang này.';
      isLoading.value = false;
      return;
    }

    const queryParams = {
      search: searchQuery.value,
      page: currentPage.value,
      limit: itemsPerPage,
    };
    const response = await cineverseService.getMoviesAdvanced(queryParams);
    movies.value = response.movies || [];
    pagination.value = response.pagination || {};
    totalPages.value = pagination.value.totalPages;

  } catch (err) {
    console.error("Error fetching movies:", err);
    error.value = err.message || 'Không thể tải danh sách phim.';
  } finally {
    isLoading.value = false;
  }
};

const handleSubmitMovie = async () => {
  isSubmitting.value = true;
  error.value = null;

  try {
    const payload = { ...movieForm.value };
    // Remove movie_id from payload for create, as it's not part of MovieInput
    if (!isEditing.value) {
      delete payload.movie_id;
    }

    // Ensure numeric fields are numbers, not empty strings
    payload.release_year = payload.release_year ? Number(payload.release_year) : null;
    payload.runtime_minutes = payload.runtime_minutes ? Number(payload.runtime_minutes) : null;
    payload.episode_count = payload.episode_count ? Number(payload.episode_count) : 1; // Default to 1 if null

    // Convert genres from array of IDs to array of strings if API expects names for display,
    // but MovieInput expects IDs. The OpenAPI spec says genres is array of integers for input.
    // So, we send genre IDs directly.

    if (isEditing.value && payload.movie_id) {
      await cineverseService.updateMovie(payload.movie_id, payload);
      alert('Phim đã được cập nhật thành công!');
    } else {
      await cineverseService.createMovie(payload);
      alert('Phim mới đã được thêm thành công!');
    }
    movieModalInstance.value.hide(); // Close modal
    await fetchMovies(); // Refresh movie list
  } catch (err) {
    console.error("Error saving movie:", err);
    error.value = err.message || 'Lỗi khi lưu phim.';
    alert(`Lỗi: ${error.value}`);
  } finally {
    isSubmitting.value = false;
  }
};

const confirmDelete = (id) => {
  movieIdToDelete.value = id;
  deleteConfirmModalInstance.value.show(); // Show confirmation modal
};

const deleteMovie = async () => {
  if (!movieIdToDelete.value || isSubmitting.value) return;

  isSubmitting.value = true;
  error.value = null;
  try {
    await cineverseService.deleteMovie(movieIdToDelete.value);
    alert('Phim đã được xóa thành công!');
    deleteConfirmModalInstance.value.hide(); // Hide confirmation modal
    await fetchMovies(); // Refresh movie list
  } catch (err) {
    console.error("Error deleting movie:", err);
    error.value = err.message || 'Lỗi khi xóa phim.';
    alert(`Lỗi: ${error.value}`);
  } finally {
    isSubmitting.value = false;
    movieIdToDelete.value = null;
  }
};

// --- Modal Control Functions ---
const openMovieModal = (mode, movie = null) => {
  isEditing.value = mode === 'edit';
  if (isEditing.value && movie) {
    // Populate form for editing
    movieForm.value = {
      movie_id: movie.movie_id,
      title: movie.title,
      original_title: movie.original_title,
      release_year: movie.release_year,
      synopsis: movie.synopsis,
      poster_url: movie.poster_url,
      trailer_url: movie.trailer_url,
      runtime_minutes: movie.runtime_minutes,
      episode_count: movie.episode_count,
      status: movie.status,
      type: movie.type,
      // When editing, genres from API are names (strings).
      // We need to convert them back to IDs for the form's v-model.
      // This assumes availableGenres has all possible genres.
      genres: movie.genres ? movie.genres.map(genreName => {
        const foundGenre = availableGenres.value.find(g => g.name === genreName);
        return foundGenre ? foundGenre.id : null;
      }).filter(id => id !== null) : [],
    };
  } else {
    // Reset form for adding
    movieForm.value = {
      movie_id: null,
      title: '',
      original_title: '',
      release_year: null,
      synopsis: '',
      poster_url: '',
      trailer_url: '',
      runtime_minutes: null,
      episode_count: 1,
      status: '',
      type: '',
      genres: [],
    };
  }
  movieModalInstance.value.show();
};

// --- Pagination Functions ---
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    fetchMovies();
  }
};

// --- Lifecycle Hooks ---
onMounted(async () => {
  // Initialize Bootstrap Modals
  movieModalInstance.value = new Modal(document.getElementById('movieModal'));
  deleteConfirmModalInstance.value = new Modal(document.getElementById('deleteConfirmModal'));

  // Fetch genres for dropdown
  fetchGenres();

  // Redirect if not admin
  if (!authStore.isAdmin) {
    error.value = 'Bạn không có quyền truy cập trang này. Vui lòng đăng nhập với tài khoản Admin.';
    isLoading.value = false;
    // Optionally redirect to home or login
    // router.push({ name: 'auth' });
    return;
  }
  await fetchMovies();
});

// Watch for search query changes (optional: debounce this for performance)
watch(searchQuery, () => {
  // Reset to first page when search query changes
  currentPage.value = 1;
  // You might want to debounce this call for better performance on large datasets
  // For now, it will fetch on every keyup (if not debounced) or on enter key
  // Fetch genres for dropdown  
});

// Watch for auth state changes (e.g., user logs out)
watch(() => authStore.isAdmin, (newVal) => {
  if (!newVal) {
    error.value = 'Phiên đăng nhập Admin đã hết hạn hoặc bạn không còn quyền truy cập.';
    movies.value = []; // Clear data
    // router.push({ name: 'auth' }); // Redirect to login
  }
});
</script>

<style>
/* Import Google Font */
/* @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;700&display=swap'); */

/* Theme và biến màu */
.admin-movie-management-page {
  background-color: var(--deep-space-black);
}

.loading-container {
  min-height: 100vh;
}

.text-starlight-yellow-glow {
  margin-top: 50px;
  color: var(--starlight-yellow);
  text-shadow: 0 0 5px rgba(255, 217, 77, 0.7), 0 0 10px rgba(255, 217, 77, 0.5);
}

/* Glassmorphism base style */
.glassmorphism-card {
  background: var(--surface-glass);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid var(--border-glass);
  border-radius: 1rem;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}

/* Custom Buttons */
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

.gradient-button-small {
  background: linear-gradient(90deg, var(--galaxy-purple), var(--cosmic-blue));
  border: none;
  color: var(--nebula-white);
  font-weight: bold;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  font-size: 0.9em;
}

.gradient-button-small:hover {
  background: linear-gradient(90deg, var(--cosmic-blue), var(--galaxy-purple));
  box-shadow: 0 4px 15px rgba(46, 115, 232, 0.4);
  transform: translateY(-1px);
}

.gradient-button-danger {
  background: linear-gradient(90deg, #dc3545, #ff6b6b);
  /* Red gradient */
  border: none;
  color: var(--nebula-white);
  font-weight: bold;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.gradient-button-danger:hover {
  background: linear-gradient(90deg, #ff6b6b, #dc3545);
  box-shadow: 0 6px 20px rgba(220, 53, 69, 0.4);
  transform: translateY(-2px);
}

.custom-outline-btn {
  border-color: var(--border-glass) !important;
  color: var(--nebula-white) !important;
  transition: all 0.3s ease;
}

.custom-outline-btn:hover {
  background-color: var(--cosmic-blue) !important;
  border-color: var(--cosmic-blue) !important;
  color: var(--nebula-white) !important;
  transform: scale(1.05);
}

/* Custom Input/Select */
.custom-input,
.custom-select {
  background-color: rgba(245, 245, 250, 0.08);
  /* Nền input hơi trong suốt */
  border: 1px solid var(--border-glass);
  color: var(--nebula-white);
  padding: 0.75rem 1.25rem;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.custom-input:focus,
.custom-select:focus {
  background-color: rgba(245, 245, 250, 0.15);
  border-color: var(--cosmic-blue);
  box-shadow: 0 0 0 0.25rem rgba(46, 115, 232, 0.25);
  /* Glow nhẹ khi focus */
  color: var(--nebula-white);
  /* Đảm bảo màu chữ vẫn trắng khi focus */
}

.custom-input::placeholder {
  color: rgba(245, 245, 250, 0.6);
  /* Màu placeholder nhạt hơn */
}

.custom-select option {
  background-color: var(--deep-space-black);
  /* Màu nền cho option */
  color: var(--nebula-white);
  /* Màu chữ cho option */
}

.custom-close-btn {
  background-color: transparent;
  border: none;
  font-size: 1.5rem;
  color: var(--nebula-white);
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.custom-close-btn:hover {
  opacity: 1;
  color: var(--starlight-yellow);
}

/* Table Styles */
.table-dark {
  --bs-table-bg: transparent;
  /* Make table background transparent */
  --bs-table-striped-bg: rgba(245, 245, 250, 0.02);
  /* Very light stripe */
  --bs-table-hover-bg: rgba(245, 245, 250, 0.08);
  /* Light hover effect */
  --bs-table-color: var(--nebula-white);
  --bs-table-border-color: var(--border-glass);
}

.table thead th {
  border-bottom: 2px solid var(--border-glass);
  color: var(--starlight-yellow);
  font-weight: bold;
  vertical-align: middle;
}

.table tbody td {
  vertical-align: middle;
  border-top: 1px solid var(--border-glass);
  color: var(--nebula-white);
}

/* Pagination Styles */
.custom-pagination .page-item .page-link {
  background-color: var(--surface-glass);
  border: 1px solid var(--border-glass);
  color: var(--nebula-white);
  transition: all 0.3s ease;
  margin: 0 0.25rem;
  border-radius: 0.5rem;
}

.custom-pagination .page-item .page-link:hover {
  background-color: rgba(245, 245, 250, 0.15);
  color: var(--starlight-yellow);
  border-color: var(--starlight-yellow);
}

.custom-pagination .page-item.active .page-link {
  background: linear-gradient(90deg, var(--galaxy-purple), var(--cosmic-blue));
  border-color: var(--cosmic-blue);
  color: var(--nebula-white);
  box-shadow: 0 0 10px rgba(46, 115, 232, 0.5);
}

.custom-pagination .page-item.disabled .page-link {
  background-color: rgba(245, 245, 250, 0.02);
  color: rgba(245, 245, 250, 0.4);
  border-color: rgba(245, 245, 250, 0.1);
}

select option {
  /* background-color: var(--deep-space-black); */
  color: var(--nebula-white);
}

select option {
  background-color: rgba(0, 0, 0, 0.37);
}
</style>
