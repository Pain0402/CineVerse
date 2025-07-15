<template>
  <div class="profile-view-container">
    <div class="container py-5">

      <!-- Phần Header của Profile -->
      <header v-if="user" class="profile-header d-flex flex-column flex-md-row align-items-center mb-5">
        <!-- Avatar -->
        <div class="avatar-container mb-3 mb-md-0 me-md-4">
          <img v-if="user.avatar_url" :src="user.avatar_url" alt="User Avatar" class="user-avatar">
          <div v-else class="default-avatar">
            <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="currentColor" class="bi bi-person-fill" viewBox="0 0 16 16">
              <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
            </svg>
          </div>
        </div>

        <!-- Thông tin User -->
        <div class="user-info text-center text-md-start">
          <h1 class="username display-4 fw-bold">{{ user.username }}</h1>
          <p class="join-date text-white-50">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-calendar3 me-2" viewBox="0 0 16 16">
              <path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857V3.857z"/>
              <path d="M6.5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
            </svg>
            Thành viên từ {{ formattedJoinDate }}
          </p>
          <button class="btn btn-edit-profile mt-2">Chỉnh sửa hồ sơ</button>
        </div>
      </header>
      
      <!-- Trạng thái Loading -->
       <div v-else class="text-center">
          <div class="spinner-border text-warning" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>

      <!-- Phần nội dung chính (ví dụ: các tab watchlist) -->
      <main class="profile-content">
        <div class="glass-pane p-4 text-center">
          <h3 class="text-nebula-white">Khu vực Watchlist</h3>
          <p class="text-white-50">Nội dung các danh sách phim của bạn sẽ được hiển thị ở đây.</p>
        </div>
      </main>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

// Lấy thông tin người dùng từ store
const user = ref(authStore.currentUser);

// Định dạng lại ngày tham gia
const formattedJoinDate = computed(() => {
  if (!user.value?.created_at) return '';
  const date = new Date(user.value.created_at);
  return `tháng ${date.getMonth() + 1}, ${date.getFullYear()}`;
});

// Nếu dữ liệu user trong store chưa đầy đủ, có thể gọi lại API để chắc chắn
onMounted(() => {
    if (!user.value) {
        // Giả sử store có một action để fetch profile
        // authStore.fetchUserProfile().then(() => {
        //     user.value = authStore.currentUser;
        // });
    }
});
</script>

<style scoped>
.profile-view-container {
  padding-top: 120px; /* Khoảng trống cho navbar */
  background-color: var(--deep-space-black);
  min-height: 100vh;
}

.profile-header {
  border-bottom: 1px solid var(--border-glass);
  padding-bottom: 2rem;
}

.avatar-container {
  width: 150px;
  height: 150px;
  flex-shrink: 0;
}

.user-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid var(--galaxy-purple);
  box-shadow: 0 0 20px rgba(90, 66, 212, 0.5);
}

.default-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: var(--surface-glass);
  border: 2px solid var(--border-glass);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(245, 245, 250, 0.5);
}

.username {
  color: var(--nebula-white);
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
}

.join-date {
  font-size: 1rem;
}

.btn-edit-profile {
  background-color: rgba(245, 245, 250, 0.1);
  border: 1px solid var(--border-glass);
  color: var(--nebula-white);
  transition: all 0.3s ease;
}

.btn-edit-profile:hover {
  background-color: var(--starlight-yellow);
  border-color: var(--starlight-yellow);
  color: var(--deep-space-black);
  font-weight: bold;
}

.glass-pane {
  background: var(--surface-glass);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid var(--border-glass);
  border-radius: 0.75rem;
}
</style>
