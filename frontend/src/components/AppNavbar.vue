<template>
  <nav class="navbar navbar-expand-lg navbar-dark fixed-top glass-nav">
    <div class="container">
      <router-link class="navbar-brand fw-bold" :to="{ name: 'home' }">
        <img class="navbar-brand-logo rotate-in-center" src="@/assets/imgs/universe.png" alt="CineVerse Logo">CineVerse
      </router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        
        <!-- MỚI: Thêm @submit.prevent và v-model -->
        <form class="d-flex flex-grow-1 mx-lg-5 my-2 my-lg-0" role="search" @submit.prevent="performSearch">
          <input 
            class="form-control me-2 search-bar" 
            type="search" 
            placeholder="Tìm kiếm phim, series, anime..."
            aria-label="Search"
            v-model="searchTerm"
          >
        </form>

        <ul class="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
          <!-- ... các link điều hướng khác giữ nguyên ... -->
          <li class="nav-item"><a class="nav-link" href="#">Phim Điện Ảnh</a></li>
          <li class="nav-item"><a class="nav-link" href="#">Phim Truyền Hình</a></li>
          <li class="nav-item">
            <RouterLink :to="{ name: 'user.watchlist' }" class="nav-link">Watchlists</RouterLink>
          </li>
          <li class="nav-item"><a class="nav-link" href="#">Cộng đồng</a></li>
          
          <!-- Logic điều hướng cho Profile -->
          <li class="nav-item">
            <RouterLink v-if="authStore.isAuthenticated" :to="{ name: 'user.profile' }" class="nav-link d-flex align-items-center">
              <img v-if="authStore.currentUser?.avatar_url" :src="authStore.currentUser.avatar_url" alt="User Avatar" class="user-avatar me-2">
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
              </svg>
              <span class="d-none d-lg-inline">{{ authStore.currentUser?.username }}</span>
            </RouterLink>
            <RouterLink v-else :to="{ name: 'auth' }" class="nav-link">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
              </svg>
            </RouterLink>
          </li>
          
          <!-- Nút đăng xuất -->
          <li v-if="authStore.isAuthenticated" class="nav-item">
            <a href="#" @click.prevent="handleLogout" class="nav-link" title="Đăng xuất">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-box-arrow-right" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
                <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
              </svg>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

// Khởi tạo các module cần thiết
const authStore = useAuthStore();
const router = useRouter();

// MỚI: Tạo biến để lưu từ khóa tìm kiếm
const searchTerm = ref('');

// MỚI: Hàm xử lý khi submit form tìm kiếm
const performSearch = () => {
  // Chỉ thực hiện tìm kiếm nếu có từ khóa
  if (searchTerm.value.trim()) {
    // Điều hướng đến trang search và truyền từ khóa qua query
    router.push({ name: 'search', query: { q: searchTerm.value } });
    // Xóa nội dung trong ô tìm kiếm sau khi đã chuyển trang
    searchTerm.value = '';
  }
};

// Hàm xử lý đăng xuất
const handleLogout = () => {
  authStore.logout();
  router.push({ name: 'home' });
};
</script>

<style>
/* --- Thanh điều hướng --- */
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
  font-weight: 700;
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