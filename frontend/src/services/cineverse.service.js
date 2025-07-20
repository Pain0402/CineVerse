import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
const API_BASE_URL = import.meta.env.PROD ? import.meta.env.VITE_APP_API_URL : '/api'

// Cấu hình Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
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

// Interceptor để xử lý response
apiClient.interceptors.response.use(
  (response) => {
    // Bất kỳ status code nào trong khoảng 2xx đều được coi là thành công và sẽ vào đây.
    // Chúng ta chỉ cần trả về phần dữ liệu mà component cần.
    if (response.data) {
      // Ưu tiên trả về response.data.data nếu nó tồn tại (theo chuẩn JSend)
      if (typeof response.data.data !== 'undefined') {
        return response.data.data
      }
    }
    // Nếu không có cấu trúc data lồng nhau, trả về toàn bộ response.data
    return response.data
  },
  (error) => {
    // Bất kỳ status code nào ngoài 2xx sẽ vào đây.
    let errorMessage = 'Đã có lỗi xảy ra. Vui lòng thử lại.'

    // Lấy thông báo lỗi cụ thể từ response của backend nếu có
    if (error.response && error.response.data) {
      errorMessage =
        error.response.data.message ||
        error.response.data.error ||
        JSON.stringify(error.response.data)
    } else if (error.request) {
      errorMessage = 'Không nhận được phản hồi từ máy chủ.'
    } else {
      errorMessage = error.message
    }

    // Tự động logout nếu gặp lỗi 401 Unauthorized
    if (error.response && error.response.status === 401) {
      const authStore = useAuthStore()
      authStore.logout()
      // Có thể thêm logic chuyển hướng về trang đăng nhập ở đây
    }

    // Ném ra một Error mới với thông báo đã được chuẩn hóa
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
    console.log('Login response:', response)

    const authStore = useAuthStore()
    authStore.setAuth(response.user, response.token) // Lưu thông tin auth vào Pinia store
    return response
  },

  // --- Movies ---
  async getMovies(queryParams = {}) {
    // Endpoint: GET /movies
    return await apiClient.get('/movies', { params: queryParams })
  },
  async getMoviesAdvanced(queryParams = {}) {
    // Endpoint: GET /movies
    return await apiClient.get('/movies/advanced', { params: queryParams })
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

  // --- Genres ---
  async getAllGenres() {
    // Endpoint: GET /genres
    return await apiClient.get('/genres')
  },

  // --- Upload avatar ---
  uploadAvatar(formData) {
    return apiClient.post('/profile/avatar', formData, {
      headers: {
        'Content-Type': formData instanceof FormData ? 'multipart/form-data' : 'application/json',
      },
    })
  },
}

export default cineverseService
