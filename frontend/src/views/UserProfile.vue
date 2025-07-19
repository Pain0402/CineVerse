<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import cineverseService from '@/services/cineverse.service';

const fileInput = ref(null);
const isUploading = ref(false);


// --- State Management ---
const authStore = useAuthStore();
const user = ref();
const activeTab = ref('watchlist');

// --- Computed Properties ---
const formattedJoinDate = computed(() => {
  if (!user.value?.created_at) return '';
  const date = new Date(user.value.created_at);
  return `Tháng ${date.getMonth() + 1}, ${date.getFullYear()}`;
});

// --- Functions ---
const setActiveTab = (tabName) => {
  activeTab.value = tabName;
};

// Hàm này được gọi khi người dùng click vào nút đổi avatar
const triggerFileInput = () => {
  fileInput.value.click();
};

// Hàm này được gọi khi người dùng đã chọn một file
const handleAvatarUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Kiểm tra định dạng và kích thước file (tùy chọn nhưng nên có)
  if (!file.type.startsWith('image/')) {
    alert('Vui lòng chỉ chọn file hình ảnh.');
    return;
  }
  if (file.size > 2 * 1024 * 1024) { // Giới hạn 2MB
    alert('Kích thước file không được vượt quá 2MB.');
    return;
  }

  isUploading.value = true;
  const formData = new FormData();
  formData.append('avatar', file);

  try {

    // Gọi hàm mới trong api.service (sẽ tạo ở bước 2)

    const response = await cineverseService.uploadAvatar(formData);

    // Lấy URL avatar mới từ response của backend
    const newAvatarUrl = response.avatar_url;

    // Cập nhật avatar trong store (sẽ tạo ở bước 3)
    authStore.updateUserAvatar(newAvatarUrl);

    // Cập nhật avatar trong component hiện tại để thấy ngay lập tức
    user.value.avatar_url = newAvatarUrl;

  } catch (error) {
    alert('Upload avatar thất bại! ' + (error.response?.data?.message || ''));
  } finally {
    isUploading.value = false;
    fileInput.value.value = '';
  }
};

const isLoadingProfile = ref(false);

const fetchUserProfile = async () => {
  isLoadingProfile.value = true;

  try {
    const response = await cineverseService.getUserProfile();
    user.value = response;
  }
  catch (error) {
    console.log("Error: " + error);
  }
  finally {
    isLoadingProfile.value = false;
  }
}

// Dữ liệu giả cho watchlist để minh họa
const watchlist = ref([
]);

const isLoadingWatchList = ref(false);

const fetchWatchList = async () => {
  isLoadingWatchList.value = true;
  try {
    const response = await cineverseService.getWatchlist();
    watchlist.value = response;
  }
  catch (error) {
    console.log("An error occur: " + error);

  }
  finally {
    isLoadingProfile.value = false;
  }
}

// --- Lifecycle Hooks ---
onMounted(() => {
  fetchUserProfile();
  fetchWatchList();
});



</script>

<template>
  <div class="profile-page">
    <div class="container">
      <!-- Trạng thái Loading -->
      <div v-if="!user" class="loading-state">
        <div class="spinner-border" role="status"></div>
        <p>Đang tải hồ sơ...</p>
      </div>

      <!-- Bố cục chính của trang Profile -->
      <div v-else class="profile-layout">
        <!-- Cột trái: Thẻ thông tin người dùng -->
        <aside class="profile-sidebar">
          <div class="profile-card">
            <div class="avatar-section">
              <!-- Thêm input file ẩn -->
              <input type="file" ref="fileInput" @change="handleAvatarUpload" accept="image/*" hidden />

              <!-- Thêm overlay khi đang tải -->
              <div v-if="isUploading" class="uploading-overlay">
                <div class="spinner-border text-light" role="status"></div>
              </div>

              <img v-if="user.avatar_url" :src="user.avatar_url" alt="User Avatar" class="user-avatar">
              <div v-else class="default-avatar">
                <i class="bi bi-person-fill"></i>
              </div>

              <!-- Sửa lại button để gọi hàm triggerFileInput -->
              <button @click="triggerFileInput" class="change-avatar-btn" title="Thay đổi ảnh đại diện"
                :disabled="isUploading">
                <i class="bi bi-camera-fill"></i>
              </button>
            </div>
            <div class="info-section">
              <h1 class="username">{{ user.username }}</h1>
              <p class="email text-secondary">{{ user.email }}</p>
              <p class="join-date text-secondary">
                <i class="bi bi-calendar3"></i>
                Thành viên từ {{ formattedJoinDate }}
              </p>
            </div>
            <div class="stats-section">
              <div class="stat-item">
                <span class="stat-value">128</span>
                <span class="stat-label">Phim đã xem</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">{{ watchlist.length }}</span>
                <span class="stat-label">Đang theo dõi</span>
              </div>
            </div>
            <div class="actions-section">
              <button class="btn-edit-profile">Chỉnh sửa hồ sơ</button>
            </div>
          </div>
        </aside>

        <!-- Cột phải: Nội dung chính với các tab -->
        <main class="profile-main-content">
          <nav class="content-tabs">
            <button :class="['tab-btn', { active: activeTab === 'watchlist' }]" @click="setActiveTab('watchlist')">
              <i class="bi bi-bookmark-fill"></i> Watchlist
            </button>
            <button :class="['tab-btn', { active: activeTab === 'favorites' }]" @click="setActiveTab('favorites')">
              <i class="bi bi-heart-fill"></i> Yêu thích
            </button>
            <button :class="['tab-btn', { active: activeTab === 'settings' }]" @click="setActiveTab('settings')">
              <i class="bi bi-gear-fill"></i> Cài đặt
            </button>
          </nav>

          <div class="tab-content">
            <!-- Nội dung tab Watchlist -->
            <div v-if="activeTab === 'watchlist'" class="watchlist-grid">
              <div v-for="movie in watchlist" :key="movie.id" class="movie-card">
                <img :src="movie.poster_url" :alt="movie.title" class="movie-poster">
                <div class="movie-info">
                  <h5 class="movie-title">{{ movie.title }}</h5>
                  <p class="movie-year">{{ movie.year }}</p>
                </div>
              </div>
            </div>
            <!-- Nội dung các tab khác (minh họa) -->
            <div v-if="activeTab === 'favorites'" class="placeholder-content">
              <i class="bi bi-heart-fill"></i>
              <h3>Danh sách yêu thích</h3>
              <p>Các bộ phim bạn yêu thích sẽ xuất hiện ở đây.</p>
            </div>
            <div v-if="activeTab === 'settings'" class="placeholder-content">
              <i class="bi bi-gear-fill"></i>
              <h3>Cài đặt tài khoản</h3>
              <p>Các tùy chọn cài đặt sẽ được cập nhật trong tương lai.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Import Bootstrap Icons */
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css");

.profile-page {
  background-color: var(--deep-space-black);
  background-image: linear-gradient(175deg,
      rgba(46, 115, 232, 0.1) -10%,
      rgba(90, 66, 212, 0.15) 40%,
      var(--deep-space-black) 80%);
  color: var(--nebula-white);
  padding: 4rem 0;
  min-height: 100vh;
  padding-top: 80px;
}

.loading-state {
  text-align: center;
  padding: 5rem;
  color: var(--text-secondary);
}

.loading-state .spinner-border {
  width: 3rem;
  height: 3rem;
  color: var(--starlight-yellow);
}

.profile-layout {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
}

/* Cột trái - Sidebar */
.profile-sidebar {
  position: sticky;
  top: 2rem;
}

.profile-card {
  background: var(--surface-glass);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 10px;
  border: 1px solid var(--border-glass);
  padding: 2rem;
  text-align: center;
}

.avatar-section {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto 1.5rem auto;
}

.user-avatar,
.default-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid var(--deep-space-black);
  box-shadow: 0 0 0 4px var(--galaxy-purple);
}

.default-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--surface-glass);
  color: var(--text-secondary);
}

.default-avatar .bi {
  font-size: 4rem;
}

.change-avatar-btn {
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: var(--galaxy-purple);
  color: var(--nebula-white);
  border: 2px solid var(--deep-space-black);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: 0;
}

.uploading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.avatar-section:hover .change-avatar-btn {
  opacity: 1;
  transform: scale(1.1);
}

.info-section .username {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--nebula-white);
  margin-bottom: 0.25rem;
}

.info-section .email,
.info-section .join-date {
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.info-section .join-date {
  font-size: 0.9rem;
}

.info-section .bi {
  margin-right: 0.25rem;
}

.stats-section {
  display: flex;
  justify-content: space-around;
  margin: 2rem 0;
  padding: 1rem 0;
  border-top: 1px solid var(--border-glass);
  border-bottom: 1px solid var(--border-glass);
}

.stat-item {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--nebula-white);
}

.stat-label {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.btn-edit-profile {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-glass);
  background: transparent;
  color: var(--nebula-white);
  border-radius: var(--radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-edit-profile:hover {
  background: var(--starlight-yellow);
  border-color: var(--starlight-yellow);
  color: var(--deep-space-black);
}

/* Cột phải - Nội dung chính */
.profile-main-content {
  background: var(--surface-glass);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 10px;
  border: 1px solid var(--border-glass);
  overflow: hidden;
}

.content-tabs {
  display: flex;
  border-bottom: 1px solid var(--border-glass);
  padding: 0.5rem 1.5rem;
}

.tab-btn {
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-secondary);
  position: relative;
  transition: color 0.3s ease;
}

.tab-btn .bi {
  margin-right: 0.5rem;
}

.tab-btn::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 3px;
  background-color: var(--starlight-yellow);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.tab-btn.active {
  color: var(--starlight-yellow);
}

.tab-btn.active::after {
  transform: scaleX(1);
}

.tab-content {
  padding: 2rem;
}

.watchlist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1.5rem;
}

.movie-card {
  background-color: var(--surface-glass);
  border-radius: var(--radius-md);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid transparent;
}

.movie-card:hover {
  transform: translateY(-5px);
  border-color: var(--border-glass);
}

.movie-poster {
  width: 100%;
  aspect-ratio: 2 / 3;
  object-fit: cover;
}

.movie-info {
  padding: 0.75rem;
}

.movie-title {
  font-size: 1rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 0.25rem;
  color: var(--nebula-white);
}

.movie-year {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.placeholder-content {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--text-secondary);
}

.placeholder-content .bi {
  font-size: 4rem;
  color: var(--border-glass);
  margin-bottom: 1.5rem;
}

.placeholder-content h3 {
  font-size: 1.5rem;
  color: var(--nebula-white);
}

/* Responsive */
@media (max-width: 992px) {
  .profile-layout {
    grid-template-columns: 1fr;
  }

  .profile-sidebar {
    position: static;
  }
}
</style>
