<template>
  <div class="watchlists-view-container min-vh-100 py-5">
    <div class="container">
      <!-- User Profile Header -->
      <div class="profile-header glassmorphism-card p-4 mb-5 text-center text-md-start">
        <div class="d-flex flex-column flex-md-row align-items-center">
          <img :src="userProfile.avatar_url || 'https://placehold.co/100x100/5A42D4/F5F5FA?text=AVT'" alt="User Avatar"
            class="profile-avatar rounded-circle mb-3 mb-md-0 me-md-4" />
          <div>
            <h1 class="text-starlight-yellow-glow mb-1">{{ userProfile.username }}</h1>
            <p class="text-nebula-white-light mb-2">{{ userProfile.email }}</p>
            <div class="d-flex flex-wrap justify-content-center justify-content-md-start gap-3">
              <!-- These stats are not directly from API, keep as placeholders or fetch separately if API supports -->
              <span class="badge bg-purple-gradient p-2">
                <i class="bi bi-film me-1"></i> Đã xem: {{ userProfile.stats?.moviesWatched || 0 }}
              </span>
              <span class="badge bg-blue-gradient p-2">
                <i class="bi bi-clock me-1"></i> Giờ xem: {{ userProfile.stats?.hoursWatched || 0 }}h
              </span>
              <span class="badge bg-yellow-gradient p-2">
                <i class="bi bi-star me-1"></i> Đánh giá: {{ userProfile.stats?.reviewsCount || 0 }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Watchlist Tabs -->
      <ul class="nav nav-pills nav-fill mb-4" id="watchlist-tabs" role="tablist">
        <li class="nav-item" role="presentation" v-for="tab in tabs" :key="tab.id">
          <button class="nav-link custom-tab-link" :class="{ 'active': activeTab === tab.id }"
            @click="activeTab = tab.id" :id="`${tab.id}-tab`" type="button" role="tab" :aria-controls="tab.id"
            :aria-selected="activeTab === tab.id">
            {{ tab.name }}
          </button>
        </li>
      </ul>

      <!-- Tab Content -->
      <div class="tab-content" id="watchlist-tab-content">
        <div class="tab-pane fade" :class="{ 'show active': activeTab === tab.id }" v-for="tab in tabs" :key="tab.id"
          :id="tab.id" role="tabpanel" :aria-labelledby="`${tab.id}-tab`">
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-starlight-yellow" role="status">
              <span class="visually-hidden">Đang tải...</span>
            </div>
            <p class="mt-3 text-nebula-white-light">Đang tải danh sách...</p>
          </div>
          <div v-else-if="filteredWatchlist.length === 0" class="text-center py-5 glassmorphism-card p-4">
            <p class="lead text-nebula-white-light">
              Bạn chưa có phim nào trong danh sách "{{ tab.name }}".
            </p>
            <button class="btn gradient-button-small mt-3">
              <i class="bi bi-plus-circle me-2"></i>Thêm phim ngay
            </button>
          </div>
          <div v-else class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            <div class="col" v-for="item in filteredWatchlist" :key="item.watchlist_id">
              <div class="watchlist-item glassmorphism-card d-flex p-3 rounded">
                <img :src="item.poster_url || 'https://placehold.co/100x150/5A42D4/F5F5FA?text=No+Poster'"
                  :alt="item.title" class="watchlist-item-poster rounded me-3" />
                <div class="flex-grow-1">
                  <h5 class="text-starlight-yellow-glow mb-1">{{ item.title }}</h5>
                  <p class="text-nebula-white-light small mb-2">{{ item.release_year }} | {{ item.type }}</p>
                  <div class="progress custom-progress mb-2"
                    v-if="item.current_episode !== undefined && item.type !== 'movie'">
                    <!-- Assuming total episodes can be fetched or is part of movie object -->
                    <div class="progress-bar bg-purple-gradient" role="progressbar"
                      :style="{ width: calculateProgress(item) + '%' }" :aria-valuenow="calculateProgress(item)"
                      aria-valuemin="0" aria-valuemax="100">
                      {{ calculateProgress(item) }}%
                    </div>
                  </div>
                  <p class="text-nebula-white-light small mb-2" v-if="item.notes">
                    <!-- Notes are not in OpenAPI spec for WatchlistItem, this would need custom handling or backend update -->
                    <i class="bi bi-journal-text me-1"></i> Ghi chú: {{ item.notes }}
                  </p>
                  <div class="d-flex flex-wrap gap-2 mt-3">
                    <button class="btn btn-sm btn-outline-light custom-outline-btn">
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-light custom-outline-btn">
                      <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger custom-outline-btn">
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import cineverseService from '@/services/cineverse.service'; // Import the service

const authStore = useAuthStore();
const userProfile = ref({
  username: 'Người dùng CineVerse',
  email: 'user@example.com',
  avatar_url: '',
  stats: { // These stats are not directly from user profile API, keep as mock or fetch separately
    moviesWatched: 0,
    hoursWatched: 0,
    reviewsCount: 0,
  },
});

const activeTab = ref('watching');
const loading = ref(true);

const tabs = [
  { id: 'watching', name: 'Đang xem', apiStatus: 'watching' },
  { id: 'watched', name: 'Đã xem', apiStatus: 'completed' },
  { id: 'wantToWatch', name: 'Muốn xem', apiStatus: 'plan_to_watch' },
  { id: 'dropped', name: 'Bỏ dở', apiStatus: 'dropped' },
];

const watchlistsData = ref({
  watching: [],
  watched: [],
  wantToWatch: [],
  dropped: [],
});

// Computed property to filter watchlist based on active tab
const filteredWatchlist = computed(() => {
  return watchlistsData.value[activeTab.value] || [];
});

// Function to calculate progress for TV series/anime
const calculateProgress = (item) => {
  // This assumes 'episode_count' is available in the movie object,
  // which might need to be joined from the movie details if not directly in watchlist item.
  // For now, let's assume a dummy total if not available.
  const totalEpisodes = item.episode_count || 10; // Placeholder if not provided by API
  if (item.current_episode && totalEpisodes > 0) {
    return Math.min(100, Math.round((item.current_episode / totalEpisodes) * 100));
  }
  return 0;
};


// Function to fetch user profile
const fetchUserProfile = async () => {
  try {
    const response = await cineverseService.getUserProfile();
    userProfile.value.username = response.username;
    userProfile.value.email = response.email;
    userProfile.value.avatar_url = response.avatar_url;
    // If your backend provides stats, update them here
    // userProfile.value.stats.moviesWatched = response.stats.moviesWatched;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    // Handle error, e.g., show a message or redirect to login if 401
  }
};

// Function to fetch watchlist based on status
const fetchWatchlist = async (status) => {
  loading.value = true;
  try {
    // Map internal tab ID to API status string
    const apiStatusMap = tabs.find(tab => tab.id === status)?.apiStatus;
    if (!apiStatusMap) {
      console.warn(`No API status mapping found for tab: ${status}`);
      return;
    }

    const response = await cineverseService.getWatchlist({ status: apiStatusMap });
    // The API returns 'data' as an array of WatchlistItem
    // We need to map this to our local watchlistsData structure
    watchlistsData.value[status] = response;
  } catch (error) {
    console.error(`Error fetching ${status} watchlist:`, error);
    watchlistsData.value[status] = []; // Clear data on error
    // Handle error, e.g., show a message
  } finally {
    loading.value = false;
  }
};

// Fetch initial data when component mounts
onMounted(async () => {
  if (authStore.isAuthenticated) {
    await fetchUserProfile();
    // Fetch initial watchlist for the active tab
    await fetchWatchlist(activeTab.value);
  } else {
    loading.value = false; // Stop loading if not authenticated
    // Optionally redirect to login or show a message
  }
});

// Watch for changes in activeTab and fetch new watchlist data
watch(activeTab, (newTab) => {
  if (authStore.isAuthenticated) {
    fetchWatchlist(newTab);
  }
});
</script>

<style scoped>
.watchlists-view-container {
  background-color: var(--deep-space-black);
  background-image: linear-gradient(175deg,
      rgba(46, 115, 232, 0.1) -10%,
      rgba(90, 66, 212, 0.15) 40%,
      var(--deep-space-black) 80%);
  /* font-family: 'Be Vietnam Pro', sans-serif; */
  color: var(--nebula-white);
  min-height: 100vh;
  width: 100%;
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

/* Profile Header */
.profile-header {
  position: relative;
  overflow: hidden;
  /* Thêm hiệu ứng glow nhẹ cho viền */
  box-shadow: 0 0 20px rgba(46, 115, 232, 0.3), 0 0 30px rgba(90, 66, 212, 0.3);
  top: 40px;
}

.profile-avatar {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border: 3px solid var(--starlight-yellow);
  /* Viền vàng nổi bật */
  box-shadow: 0 0 10px rgba(255, 217, 77, 0.5);
}

.text-starlight-yellow-glow {
  color: var(--starlight-yellow);
  text-shadow: 0 0 5px rgba(255, 217, 77, 0.7), 0 0 10px rgba(255, 217, 77, 0.5);
}

.text-nebula-white-light {
  color: var(--nebula-white-light);
}

/* Badges for stats */
.badge {
  font-size: 0.9em;
  font-weight: 500;
  padding: 0.5em 0.8em;
  border-radius: 0.5rem;
}

.bg-purple-gradient {
  background: linear-gradient(45deg, var(--galaxy-purple), var(--cosmic-blue)) !important;
}

.bg-blue-gradient {
  background: linear-gradient(45deg, var(--cosmic-blue), var(--galaxy-purple)) !important;
}

.bg-yellow-gradient {
  background: linear-gradient(45deg, var(--starlight-yellow), rgba(255, 217, 77, 0.7)) !important;
  color: var(--deep-space-black) !important;
  /* Đảm bảo chữ rõ trên nền vàng */
}

/* Custom tabs */
.custom-tab-link {
  color: var(--nebula-white);
  border: 1px solid var(--border-glass);
  background-color: transparent;
  transition: all 0.3s ease;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  margin: 0 0.25rem;
  /* Khoảng cách giữa các tab */
  border-radius: 0.75rem;
  /* Bo góc nhẹ nhàng */
}

.custom-tab-link:hover {
  background-color: rgba(245, 245, 250, 0.1);
  color: var(--starlight-yellow);
  border-color: var(--starlight-yellow);
}

.custom-tab-link.active {
  background: linear-gradient(90deg, var(--galaxy-purple), var(--cosmic-blue));
  border-color: var(--cosmic-blue);
  color: var(--nebula-white);
  box-shadow: 0 0 10px rgba(46, 115, 232, 0.5);
}

/* Watchlist Item Card */
.watchlist-item {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
  /* Ensure content doesn't overflow rounded corners */
}

.watchlist-item:hover {
  transform: translateY(-5px);
  /* Lift effect */
  box-shadow: 0 12px 40px 0 rgba(0, 0, 0, 0.5);
  /* Stronger shadow */
}

.watchlist-item-poster {
  width: 100px;
  height: 150px;
  object-fit: cover;
  flex-shrink: 0;
  /* Prevent shrinking */
  border: 1px solid var(--border-glass);
}

/* Custom Progress Bar */
.custom-progress {
  height: 8px;
  /* Chiều cao thanh tiến độ */
  background-color: rgba(245, 245, 250, 0.1);
  /* Nền thanh tiến độ mờ */
  border-radius: 5px;
}

.custom-progress .progress-bar {
  border-radius: 5px;
  font-size: 0.7em;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--nebula-white);
  background: linear-gradient(90deg, var(--galaxy-purple), var(--cosmic-blue));
}

/* Small gradient button for "Add movie" */
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

/* Custom outline buttons for actions */
.custom-outline-btn {
  border-color: var(--border-glass) !important;
  color: var(--nebula-white-light) !important;
  transition: all 0.3s ease;
}

.custom-outline-btn:hover {
  background-color: var(--cosmic-blue) !important;
  border-color: var(--cosmic-blue) !important;
  color: var(--nebula-white) !important;
  transform: scale(1.05);
}
</style>
