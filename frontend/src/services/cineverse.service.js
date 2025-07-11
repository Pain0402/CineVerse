import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

// Cấu hình Axios instance
const apiClient = axios.create({
  baseURL: '/api', // Sử dụng proxy đã cấu hình trong vite.config.js
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor để thêm token vào mỗi request nếu có
apiClient.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Interceptor để xử lý lỗi response
apiClient.interceptors.response.use(
  (response) => {
    // Axios tự động parse JSON, bạn có thể kiểm tra logic 'success' của API nếu cần
    if (response.data && response.data.status === 'success') {
      return response.data.data // Trả về phần 'data' của response nếu thành công
    }
    // Nếu API có cấu trúc response riêng cho lỗi nhưng vẫn trả về 2xx, xử lý ở đây
    return Promise.reject(new Error(response.data.message || 'Unknown success response format'))
  },
  (error) => {
    let errorMessage = 'Lỗi không xác định.'
    if (error.response) {
      // Server đã trả về response với status code ngoài 2xx
      errorMessage = error.response.data.message || error.message
      // Xử lý lỗi 401 Unauthorized (ví dụ: logout người dùng)
      if (error.response.status === 401) {
        const authStore = useAuthStore()
        authStore.logout() // Gọi hàm logout của Pinia store
        // Có thể redirect về trang login ở đây hoặc trong Pinia store
        // router.push({ name: 'auth.login' });
      }
    } else if (error.request) {
      // Request đã được gửi nhưng không nhận được response
      errorMessage = 'Không nhận được phản hồi từ máy chủ.'
    } else {
      // Lỗi trong quá trình thiết lập request
      errorMessage = error.message
    }
    return Promise.reject(new Error(errorMessage))
  },
)

// Định nghĩa các hàm service cho CineVerse
const cineverseService = {
  // --- Authentication ---
  async register(userData) {
    // Endpoint: POST /auth/register
    return await apiClient.post('/auth/register', userData)
  },

  async login(credentials) {
    // Endpoint: POST /auth/login
    const response = await apiClient.post('/auth/login', credentials)
    const authStore = useAuthStore()
    authStore.setAuth(response.user, response.token) // Lưu thông tin auth vào Pinia store
    return response
  },

  // --- Movies ---
  async getMovies(queryParams = {}) {
    // Endpoint: GET /movies
    return await apiClient.get('/movies', { params: queryParams })
  },

  async getMovieById(id) {
    // Endpoint: GET /movies/{id}
    return await apiClient.get(`/movies/${id}`)
  },

  async createMovie(movieData) {
    // Endpoint: POST /movies (Admin only)
    // Lưu ý: Nếu movieData chứa file (ví dụ: poster), bạn cần gửi FormData
    // Nếu không, gửi JSON bình thường
    return await apiClient.post('/movies', movieData, {
      headers: {
        'Content-Type': movieData instanceof FormData ? 'multipart/form-data' : 'application/json',
      },
    })
  },

  async updateMovie(id, movieData) {
    // Endpoint: PUT /movies/{id} (Admin only)
    return await apiClient.put(`/movies/${id}`, movieData, {
      headers: {
        'Content-Type': movieData instanceof FormData ? 'multipart/form-data' : 'application/json',
      },
    })
  },

  async deleteMovie(id) {
    // Endpoint: DELETE /movies/{id} (Admin only)
    return await apiClient.delete(`/movies/${id}`)
  },

  // --- Users ---
  async getUserProfile() {
    // Endpoint: GET /users/me
    return await apiClient.get('/users/me')
  },

  async updateUserProfile(userData) {
    // Endpoint: PUT /users/me
    return await apiClient.put('/users/me', userData)
  },

  async deleteUserAccount() {
    // Endpoint: DELETE /users/me
    return await apiClient.delete('/users/me')
  },

  async getUserProfileById(id) {
    // Endpoint: GET /users/{id} (Admin only)
    return await apiClient.get(`/users/${id}`)
  },

  async updateUserById(id, userData) {
    // Endpoint: PUT /users/{id} (Admin only)
    return await apiClient.put(`/users/${id}`, userData)
  },

  async deleteUserById(id) {
    // Endpoint: DELETE /users/{id} (Admin only)
    return await apiClient.delete(`/users/${id}`)
  },

  // --- Reviews ---
  async getReviewsForMovie(movieId) {
    // Endpoint: GET /reviews/movies/{movieId}
    return await apiClient.get(`/reviews/movies/${movieId}`)
  },

  async createReview(movieId, reviewData) {
    // Endpoint: POST /reviews/movies/{movieId}
    return await apiClient.post(`/reviews/movies/${movieId}`, reviewData)
  },

  async updateReview(reviewId, reviewData) {
    // Endpoint: PUT /reviews/{reviewId}
    return await apiClient.put(`/reviews/${reviewId}`, reviewData)
  },

  async deleteReview(reviewId) {
    // Endpoint: DELETE /reviews/{reviewId}
    return await apiClient.delete(`/reviews/${reviewId}`)
  },

  // --- Watchlists ---
  async getWatchlist(queryParams = {}) {
    // Endpoint: GET /watchlists
    return await apiClient.get('/watchlists', { params: queryParams })
  },

  async addOrUpdateWatchlistItem(itemData) {
    // Endpoint: POST /watchlists
    return await apiClient.post('/watchlists', itemData)
  },

  async getWatchlistItem(movieId) {
    // Endpoint: GET /watchlists/{movieId}
    return await apiClient.get(`/watchlists/${movieId}`)
  },

  async deleteWatchlistItem(movieId) {
    // Endpoint: DELETE /watchlists/{movieId}
    return await apiClient.delete(`/watchlists/${movieId}`)
  },
}

export default cineverseService
