<template>
  <div class="container-fluid bg-dark text-white min-vh-100 py-4 px-md-5">
    <!-- Tiêu đề chính của trang -->
    <h1 class="display-4 fw-bold text-center my-4 text-warning">
      IMDB Clone
    </h1>

    <!-- Phần Phim Nổi Bật và Up Next -->
    <section class="mb-5">
      <div class="row g-4">
        <!-- Phần Phim Nổi Bật (Main Featured Movie) -->
        <div class="col-md-8">
          <div v-if="featuredMovie"
            class="position-relative rounded-3 overflow-hidden shadow-lg featured-movie-container"
            style="height: 450px;">
            <img :src="featuredMovie.poster" :alt="featuredMovie.title" class="w-100 h-100 object-fit-cover"
              onerror="this.onerror=null;this.src='https://placehold.co/800x450/343a40/ffc107?text=Không+có+ảnh';" />
            <!-- Áp dụng hiệu ứng liquid glass cho lớp phủ này -->
            <div
              class="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-end p-4 liquid-glass-overlay">
              <h2 class="display-5 fw-bold mb-2 text-white">{{ featuredMovie.title }}</h2>
              <p class="lead text-white-50 mb-3">{{ featuredMovie.description }}</p>
              <div class="d-flex align-items-center mb-3">
                <svg class="me-2 text-warning" width="24" height="24" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.929 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z">
                  </path>
                </svg>
                <span class="text-white fw-bold">{{ featuredMovie.rating }} / 10</span>
              </div>
              <button class="btn btn-warning btn-lg fw-bold d-flex align-items-center justify-content-center"
                style="max-width: 250px;">
                <svg class="me-2" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                  <path
                    d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z" />
                </svg>
                Xem Trailer Mới
              </button>
            </div>
          </div>
        </div>

        <!-- Phần Up Next (Sidebar) -->
        <div class="col-md-4">
          <div class="bg-secondary p-3 rounded-3 shadow-lg h-100">
            <h3 class="h4 fw-semibold mb-3 text-warning">Up Next</h3>
            <ul class="list-unstyled">
              <li v-for="upNextMovie in upNextMovies" :key="upNextMovie.id" class="mb-3 pb-3 border-bottom border-dark">
                <div class="d-flex align-items-center">
                  <img :src="upNextMovie.thumbnail" :alt="upNextMovie.title" class="rounded me-3"
                    style="width: 80px; height: 60px; object-fit: cover;"
                    onerror="this.onerror=null;this.src='https://placehold.co/80x60/343a40/ffc107?text=Ảnh';" />
                  <div>
                    <h5 class="mb-1 fw-bold text-white text-truncate" style="max-width: 200px;">{{ upNextMovie.title }}
                    </h5>
                    <small class="text-muted">{{ upNextMovie.duration }}</small>
                  </div>
                </div>
              </li>
            </ul>
            <button class="btn btn-outline-warning w-100 mt-3 fw-bold">
              Duyệt Trailer
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Phần Đang Chiếu -->
    <section class="mb-5">
      <h2 class="h3 fw-semibold mb-4 border-start border-warning border-4 ps-3">
        Đang Chiếu
      </h2>
      <div class="row g-4">
        <div v-for="movie in nowPlayingMovies" :key="movie.id" class="col-6 col-sm-4 col-md-3 col-lg-2">
          <div class="card bg-secondary text-white shadow-lg rounded-3 h-100 transform-on-hover">
            <img :src="movie.poster" :alt="movie.title" class="card-img-top rounded-top"
              style="height: 192px; object-fit: cover;"
              onerror="this.onerror=null;this.src='https://placehold.co/300x450/343a40/ffc107?text=Không+có+ảnh';" />
            <div class="card-body p-3">
              <h3 class="card-title h5 fw-bold text-truncate mb-2">{{ movie.title }}</h3>
              <div class="d-flex align-items-center text-muted small">
                <svg class="me-1 text-warning" width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.929 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z">
                  </path>
                </svg>
                <span>{{ movie.rating }} / 10</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Phần Phổ Biến -->
    <section class="mb-5">
      <h2 class="h3 fw-semibold mb-4 border-start border-warning border-4 ps-3">
        Phổ Biến
      </h2>
      <div class="row g-4">
        <div v-for="movie in popularMovies" :key="movie.id" class="col-6 col-sm-4 col-md-3 col-lg-2">
          <div class="card bg-secondary text-white shadow-lg rounded-3 h-100 transform-on-hover">
            <img :src="movie.poster" :alt="movie.title" class="card-img-top rounded-top"
              style="height: 192px; object-fit: cover;"
              onerror="this.onerror=null;this.src='https://placehold.co/300x450/343a40/ffc107?text=Không+có+ảnh';" />
            <div class="card-body p-3">
              <h3 class="card-title h5 fw-bold text-truncate mb-2">{{ movie.title }}</h3>
              <div class="d-flex align-items-center text-muted small">
                <svg class="me-1 text-warning" width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.929 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z">
                  </path>
                </svg>
                <span>{{ movie.rating }} / 10</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Phần Được Đánh Giá Cao Nhất -->
    <section class="mb-5">
      <h2 class="h3 fw-semibold mb-4 border-start border-warning border-4 ps-3">
        Được Đánh Giá Cao Nhất
      </h2>
      <div class="row g-4">
        <div v-for="movie in topRatedMovies" :key="movie.id" class="col-6 col-sm-4 col-md-3 col-lg-2">
          <div class="card bg-secondary text-white shadow-lg rounded-3 h-100 transform-on-hover">
            <img :src="movie.poster" :alt="movie.title" class="card-img-top rounded-top"
              style="height: 192px; object-fit: cover;"
              onerror="this.onerror=null;this.src='https://placehold.co/300x450/343a40/ffc107?text=Không+có+ảnh';" />
            <div class="card-body p-3">
              <h3 class="card-title h5 fw-bold text-truncate mb-2">{{ movie.title }}</h3>
              <div class="d-flex align-items-center text-muted small">
                <svg class="me-1 text-warning" width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.929 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z">
                  </path>
                </svg>
                <span>{{ movie.rating }} / 10</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Phần Sắp Ra Mắt -->
    <section>
      <h2 class="h3 fw-semibold mb-4 border-start border-warning border-4 ps-3">
        Sắp Ra Mắt
      </h2>
      <div class="row g-4">
        <div v-for="movie in upcomingMovies" :key="movie.id" class="col-6 col-sm-4 col-md-3 col-lg-2">
          <div class="card bg-secondary text-white shadow-lg rounded-3 h-100 transform-on-hover">
            <img :src="movie.poster" :alt="movie.title" class="card-img-top rounded-top"
              style="height: 192px; object-fit: cover;"
              onerror="this.onerror=null;this.src='https://placehold.co/300x450/343a40/ffc107?text=Không+có+ảnh';" />
            <div class="card-body p-3">
              <h3 class="card-title h5 fw-bold text-truncate mb-2">{{ movie.title }}</h3>
              <div class="d-flex align-items-center text-muted small">
                <svg class="me-1 text-warning" width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.929 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z">
                  </path>
                </svg>
                <span>{{ movie.rating }} / 10</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// Dữ liệu giả định cho các bộ phim
// Trong một ứng dụng thực tế, bạn sẽ tìm nạp dữ liệu này từ một API
const featuredMovie = ref(null); // Phim nổi bật
const upNextMovies = ref([]); // Phim sắp tới trong sidebar
const nowPlayingMovies = ref([]);
const popularMovies = ref([]);
const topRatedMovies = ref([]);
const upcomingMovies = ref([]);

// Hàm để tạo dữ liệu phim giả định
const generateMockMovies = (count, category, isUpNext = false) => {
  const movies = [];
  for (let i = 1; i <= count; i++) {
    movies.push({
      id: `${category}-${i}`,
      title: `${category} Phim ${i}`,
      poster: `https://placehold.co/300x450/343a40/ffc107?text=${category}+Movie+${i}`, // Placeholder image
      thumbnail: `https://placehold.co/80x60/343a40/ffc107?text=Thumb+${i}`, // Thumbnail for up next
      rating: (Math.random() * (10 - 6) + 6).toFixed(1), // Random rating between 6.0 and 10.0
      duration: `${Math.floor(Math.random() * 5) + 1}:0${Math.floor(Math.random() * 9)}`, // Random duration for up next
      description: `Đây là mô tả ngắn gọn cho ${category} Phim ${i}. Một bộ phim hấp dẫn đáng xem!`,
    });
  }
  return movies;
};

// Sử dụng onMounted để mô phỏng việc tìm nạp dữ liệu khi component được gắn kết
onMounted(() => {
  // Mô phỏng độ trễ tìm nạp dữ liệu
  setTimeout(() => {
    featuredMovie.value = {
      id: 'featured-1',
      title: "'The SpongeBob Movie: Search for SquarePants'",
      poster: 'https://placehold.co/800x450/343a40/ffc107?text=Phim+Nổi+Bật', // Larger placeholder for featured
      rating: '8.5',
      description: 'Watch the New Trailer',
    };
    upNextMovies.value = generateMockMovies(3, 'Up Next', true);
    nowPlayingMovies.value = generateMockMovies(6, 'Đang Chiếu');
    popularMovies.value = generateMockMovies(12, 'Phổ Biến');
    topRatedMovies.value = generateMockMovies(12, 'Được Đánh Giá Cao Nhất');
    upcomingMovies.value = generateMockMovies(6, 'Sắp Ra Mắt');
  }, 500); // Giả lập độ trễ 0.5 giây
});
</script>

<style scoped>
/* Các kiểu tùy chỉnh cho hiệu ứng hover của thẻ phim */
.transform-on-hover {
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
}

.transform-on-hover:hover {
  transform: scale(1.05);
  box-shadow: 0 0.5rem 1rem rgba(255, 193, 7, 0.2) !important;
  /* Yellow shadow on hover */
}

/* Kiểu cho hiệu ứng liquid glass */
.liquid-glass-overlay {
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.6) 50%, rgba(0, 0, 0, 0.3) 100%);
  /* Điều chỉnh gradient để hiển thị tốt hơn với hiệu ứng blur */
  backdrop-filter: blur(8px);
  /* Áp dụng hiệu ứng làm mờ nền */
  -webkit-backdrop-filter: blur(8px);
  /* Hỗ trợ Safari */
  border-radius: 0.3rem;
  /* Làm tròn góc khớp với container */
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
  /* Đổ bóng mềm cho chiều sâu */
  transition: all 0.3s ease;
  /* Chuyển động mượt mà */
}

.liquid-glass-overlay:hover {
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.7) 50%, rgba(0, 0, 0, 0.4) 100%);
  box-shadow: 0 8px 60px rgba(0, 0, 0, 0.3);
}

/* Đảm bảo container phim nổi bật có z-index nếu cần cho việc xếp lớp */
.featured-movie-container {
  z-index: 1;
}
</style>
