<template>
  <div class="auth-view-container d-flex justify-content-center align-items-center min-vh-100">
    <div class="auth-card p-4 rounded shadow-lg text-nebula-white">
      <h2 class="text-center mb-4 display-5 fw-bold text-starlight-yellow-glow">
        Chào mừng đến với CineVerse
      </h2>

      <ul class="nav nav-pills nav-fill mb-4" id="pills-tab" role="tablist">
        <li class="nav-item" role="presentation">
          <button class="nav-link custom-tab-link" :class="{ 'active': activeTab === 'login' }"
            @click="activeTab = 'login'" id="pills-login-tab" type="button" role="tab" aria-controls="pills-login"
            aria-selected="true">
            Đăng nhập
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link custom-tab-link" :class="{ 'active': activeTab === 'register' }"
            @click="activeTab = 'register'" id="pills-register-tab" type="button" role="tab"
            aria-controls="pills-register" aria-selected="false">
            Đăng ký
          </button>
        </li>
      </ul>

      <div class="tab-content" id="pills-tabContent">
        <div class="tab-pane fade" :class="{ 'show active': activeTab === 'login' }" id="pills-login" role="tabpanel"
          aria-labelledby="pills-login-tab">
          <form @submit.prevent="handleLogin">
            <div class="mb-3">
              <label for="loginEmail" class="form-label text-nebula-white">Email</label>
              <input type="email" class="form-control custom-input" id="loginEmail" v-model="loginForm.email"
                required />
            </div>
            <div class="mb-3">
              <label for="loginPassword" class="form-label text-nebula-white">Mật khẩu</label>
              <input type="password" class="form-control custom-input" id="loginPassword" v-model="loginForm.password"
                required />
            </div>
            <div class="d-flex justify-content-between align-items-center mb-4">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" id="rememberMe" />
                <label class="form-check-label text-nebula-white" for="rememberMe">
                  Ghi nhớ tôi
                </label>
              </div>
              <a href="#" class="text-cosmic-blue-light text-decoration-none small">Quên mật khẩu?</a>
            </div>
            <button type="submit" class="btn w-100 gradient-button btn-lg">Đăng nhập</button>
          </form>
        </div>

        <div class="tab-pane fade" :class="{ 'show active': activeTab === 'register' }" id="pills-register"
          role="tabpanel" aria-labelledby="pills-register-tab">
          <form @submit.prevent="handleRegister">
            <div class="mb-3">
              <label for="registerUsername" class="form-label text-nebula-white">Tên người dùng</label>
              <input type="text" class="form-control custom-input" id="registerUsername" v-model="registerForm.username"
                required />
            </div>
            <div class="mb-3">
              <label for="registerEmail" class="form-label text-nebula-white">Email</label>
              <input type="email" class="form-control custom-input" id="registerEmail" v-model="registerForm.email"
                required />
            </div>
            <div class="mb-3">
              <label for="registerPassword" class="form-label text-nebula-white">Mật khẩu</label>
              <input type="password" class="form-control custom-input" id="registerPassword"
                v-model="registerForm.password" required />
            </div>
            <div class="mb-4">
              <label for="confirmPassword" class="form-label text-nebula-white">Xác nhận mật khẩu</label>
              <input type="password" class="form-control custom-input" id="confirmPassword"
                v-model="registerForm.confirmPassword" required />
            </div>
            <button type="submit" class="btn w-100 gradient-button btn-lg">Đăng ký</button>
          </form>
        </div>
      </div>

      <p class="text-center mt-4 small text-nebula-white">
        Hoặc tiếp tục với
        <a href="#" class="text-cosmic-blue-light text-decoration-none ms-1 me-1"><i class="bi bi-google"></i>
          Google</a>
        <a href="#" class="text-cosmic-blue-light text-decoration-none"><i class="bi bi-facebook"></i> Facebook</a>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import cinerverseService from '@/services/cineverse.service' // Điều chỉnh đường dẫn đến service của bạn

const router = useRouter()

const activeTab = ref('login') // Mặc định hiển thị tab đăng nhập

const loginForm = ref({
  email: '',
  password: '',
})

const registerForm = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const handleLogin = async () => {
  try {
    // Gọi hàm login từ authStore của Pinia
    const response = await cinerverseService.login({
      email: loginForm.value.email,
      password: loginForm.value.password,
    })
    console.log('Đăng nhập thành công:', response)
    // Chuyển hướng người dùng sau khi đăng nhập thành công
    router.push({ name: 'home' }) // Thay 'home' bằng tên route trang chủ của bạn
  } catch (error) {
    console.error('Lỗi đăng nhập:', error)
    // Xử lý lỗi: hiển thị thông báo cho người dùng
    alert('Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.')
  }
}

const handleRegister = async () => {
  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    alert('Mật khẩu và xác nhận mật khẩu không khớp.')
    return
  }
  try {
    const response = await cinerverseService.register({
      username: registerForm.value.username,
      email: registerForm.value.email,
      password: registerForm.value.password,
    })
    console.log('Thông tin đăng ký:', registerForm.value);
    alert(response.message);
    activeTab.value = 'login';
  } catch (error) {
    console.error('Lỗi đăng ký:', error);
    alert('Đăng ký thất bại. Vui lòng thử lại.');
  }
}
</script>

<style scoped>
.auth-view-container {
  background-color: var(--deep-space-black);
  /* Nền gradient mờ ảo toàn trang */
  background-image: linear-gradient(175deg,
      rgba(46, 115, 232, 0.1) -10%,
      /* Cosmic Blue rất nhạt */
      rgba(90, 66, 212, 0.15) 40%,
      /* Galaxy Purple nhạt hơn */
      var(--deep-space-black) 80%);
  /* Đảm bảo toàn màn hình */
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Be Vietnam Pro', sans-serif;
  color: var(--nebula-white);
  /* Màu chữ mặc định */
}

/* Hiệu ứng Glassmorphism cho thẻ đăng nhập/đăng ký */
.auth-card {
  background: var(--surface-glass);
  /* Nền bán trong suốt */
  backdrop-filter: blur(15px);
  /* Hiệu ứng mờ nền */
  -webkit-backdrop-filter: blur(15px);
  /* Hỗ trợ Safari */
  border: 1px solid var(--border-glass);
  /* Viền mỏng như kính */
  border-radius: 1rem;
  /* Bo góc nhẹ */
  padding: 3rem;
  max-width: 450px;
  /* Chiều rộng tối đa của thẻ */
  width: 90%;
  /* Chiều rộng linh hoạt */
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  /* Đổ bóng nhẹ */
  position: relative;
  /* Cho các hiệu ứng glow */
  overflow: hidden;
  /* Đảm bảo không tràn ra ngoài */
}

/* Hiệu ứng glow cho tiêu đề */
.text-starlight-yellow-glow {
  color: var(--starlight-yellow);
  text-shadow: 0 0 5px rgba(255, 217, 77, 0.7), 0 0 10px rgba(255, 217, 77, 0.5);
}

/* Custom styles for Bootstrap nav-pills (tabs) */
.custom-tab-link {
  color: var(--nebula-white);
  border: 1px solid var(--border-glass);
  background-color: transparent;
  transition: all 0.3s ease;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
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

/* Custom input field styles */
.custom-input {
  background-color: rgba(245, 245, 250, 0.08);
  /* Nền input hơi trong suốt */
  border: 1px solid var(--border-glass);
  color: var(--nebula-white);
  padding: 0.75rem 1.25rem;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.custom-input:focus {
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

/* Gradient button style */
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
  /* Đổi chiều gradient */
  box-shadow: 0 6px 20px rgba(46, 115, 232, 0.4);
  /* Shadow mạnh hơn khi hover */
  transform: translateY(-2px);
  /* Hiệu ứng nổi nhẹ */
}

/* Màu cho các link phụ */
.text-cosmic-blue-light {
  color: var(--cosmic-blue) !important;
}

.text-cosmic-blue-light:hover {
  color: var(--starlight-yellow) !important;
  /* Thay đổi màu khi hover */
}

/* Font Be Vietnam Pro */
body {
  font-family: 'Be Vietnam Pro', sans-serif;
}
</style>