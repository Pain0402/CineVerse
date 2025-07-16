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

        <!--Bọc form trong div để định vị danh sách gợi ý -->
        <div class="search-container flex-grow-1 mx-lg-5 my-2 my-lg-0">
          <form role="search" @submit.prevent="performSearch">
            <input class="form-control me-2 search-bar" type="search" placeholder="Tìm kiếm phim, series, anime..."
              aria-label="Search" v-model="searchTerm" @focus="showSuggestions = true" @blur="hideSuggestions">
          </form>

          <!-- Danh sách gợi ý tìm kiếm -->
          <div v-if="showSuggestions && (suggestions.length > 0 || isLoadingSuggestions)" class="suggestions-dropdown">
            <div v-if="isLoadingSuggestions" class="text-center p-3">
              <div class="spinner-border spinner-border-sm text-light" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            <div v-else>
              <SearchSuggestionItem v-for="item in suggestions" :key="item.id" :item="item"
                @mousedown.prevent="goToSuggestion(item)" />
            </div>
          </div>
        </div>

        <ul class="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
          <!-- dropdown menu -->
          <li class="nav-item">
            <router-link :to="{ name: 'user.watchlist' }" class="nav-link" href="#">Watchlists</router-link>
          </li>
          <li class="nav-item">
            <div class="btn-group">
              <button type="button" class="btn action nav-link">Movies</button>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="#">Anime</a></li>
                <li><a class="dropdown-item" href="#">TV-Series</a></li>
              </ul>
            </div>
          </li>

          <li class="nav-item">
            <div class="btn-group">
              <button type="button" class="btn action nav-link">Community</button>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="#">Clubs</a></li>
              </ul>
            </div>
          </li>

          <!-- Dropdown Profile thông minh -->
          <li class="nav-item">
            <div class="btn-group profile">
              <button type="button" class="btn action nav-link">
                <i class="fa-solid fa-circle-user fs-4 text"></i>
              </button>
              <ul v-if="isAuthenticated" class="dropdown-menu ">
                <li v-if="isAdmin"><router-link :to="{ name: 'admin.dashboard' }"
                    class="dropdown-item">Administration</router-link>
                </li>
                <li><router-link :to="{ name: 'user.watchlist' }" class="dropdown-item">Watchlist</router-link></li>
                <!-- SỬA: Sửa link profile cho đúng -->
                <li><router-link :to="{ name: 'user.profile' }" class="dropdown-item">Profile</router-link></li>
                <li><a class="dropdown-item" href="#">Setting</a></li>
                <li><a class="dropdown-item" href="#" @click.prevent="handleLogout">Logout</a></li>
              </ul>
              <!-- Menu khi chưa đăng nhập -->
              <ul v-else class="dropdown-menu">
                <li><router-link :to="{ name: 'auth' }" class="dropdown-item">Login</router-link></li>
                <li><router-link :to="{ name: 'auth' }" class="dropdown-item">Register</router-link></li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import cineverseService from '@/services/cineverse.service';
import SearchSuggestionItem from '@/components/SearchSuggestionItem.vue';

const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.isAuthenticated);
const isAdmin = computed(() => authStore.isAdmin);
const router = useRouter();

// --- Logic Đăng xuất ---
function handleLogout() {
  // Lưu ý: confirm() sẽ chặn trình duyệt, cân nhắc dùng modal tùy chỉnh để có UX tốt hơn
  if (confirm("Bạn có chắc muốn đăng xuất?")) {
    authStore.logout();
    router.push('/');
  }
}



// --- Logic Tìm kiếm ---
const searchTerm = ref('');
const performSearch = () => {
  if (searchTerm.value.trim()) {
    showSuggestions.value = false; // Ẩn gợi ý khi nhấn enter
    router.push({ name: 'search', query: { q: searchTerm.value } });
    searchTerm.value = '';
  }
};

// --- Logic Gợi ý Tìm kiếm ---
const suggestions = ref([]);
const showSuggestions = ref(false);
const isLoadingSuggestions = ref(false);
let debounceTimer = null;

const fetchSuggestions = async () => {
  if (searchTerm.value.length < 2) {
    suggestions.value = [];
    return;
  }
  isLoadingSuggestions.value = true;
  try {
    const data = await cineverseService.getMovies({ search: searchTerm.value, limit: 7 });
    suggestions.value = data.map(movie => ({
      id: movie.movie_id,
      title: movie.title,
      year: movie.release_year,
      type: movie.type,
      posterUrl: movie.poster_url,
    }));
  } catch (error) {
    console.error("Lỗi khi lấy gợi ý:", error);
    suggestions.value = [];
  } finally {
    isLoadingSuggestions.value = false;
  }
};

watch(searchTerm, (newVal) => {
  clearTimeout(debounceTimer);
  if (newVal.trim() !== '') {
    debounceTimer = setTimeout(() => {
      fetchSuggestions();
    }, 300);
  } else {
    suggestions.value = [];
  }
});

const hideSuggestions = () => {
  setTimeout(() => { showSuggestions.value = false; }, 200);
};

const goToSuggestion = (item) => {
  router.push({ name: 'movie.detail', params: { id: item.id } });
  searchTerm.value = '';
  showSuggestions.value = false;
};
</script>

<style>
/* --- CSS của bạn được giữ nguyên --- */
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

.rotate-in-center:hover {
  animation: rotate-in-center 0.6s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
}

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
  background-color: var(--surface-glass);
}

.btn-group .dropdown-menu {
  background-color: var(--deep-space-black);
  border: 1px solid var(--border-glass);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.btn-group:hover .dropdown-menu {
  display: block;
  margin-top: 10px;
  /* Điều chỉnh khoảng cách */
}

.btn-group .dropdown-menu .dropdown-item {
  color: var(--nebula-white);
  padding: 10px 20px;
  text-decoration: none;
}

.btn-group .dropdown-menu .dropdown-item:hover {
  background-color: var(--galaxy-purple);
  font-weight: 700;
  color: var(--nebula-white);
}

/* .profile .dropdown-menu {
  right: -80px;
  width: max-content;
  text-align: center;

} */

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
  border-color: var(--galaxy-purple);
  box-shadow: 0 0 0 0.25rem rgba(145, 49, 255, 0.25);
  color: var(--nebula-white);
}

/* GỢI Ý TÌM KIẾM */
.search-container {
  position: relative;
}

.suggestions-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: #1c1c2b;
  border: 1px solid var(--border-glass);
  border-top: none;
  border-radius: 0 0 0.5rem 0.5rem;
  z-index: 1000;
  max-height: 400px;
  overflow-y: auto;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
</style>
