<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// Dữ liệu cho các slide
const slides = ref([
  {
    title: 'Khám Phá Vũ Trụ Điện Ảnh',
    subtitle: 'Nơi mọi câu chuyện được kể và mọi cảm xúc được chia sẻ.',
    buttonText: 'Bắt đầu khám phá',
    // backgroundUrl: 'https://placehold.co/1920x1080/2c3e50/ffffff?text=Slide+1'
  },
  {
    title: 'Những Bom Tấn Mới Nhất',
    subtitle: 'Cập nhật liên tục các bộ phim hot nhất tại rạp.',
    buttonText: 'Xem ngay',
    // backgroundUrl: 'https://placehold.co/1920x1080/8e44ad/ffffff?text=Slide+2'
  },
  {
    title: 'Thư Viện Phim Kinh Điển',
    subtitle: 'Sống lại những khoảnh khắc điện ảnh bất hủ.',
    buttonText: 'Tìm hiểu thêm',
    // backgroundUrl: 'https://placehold.co/1920x1080/3498db/ffffff?text=Slide+3'
  }
]);

// State quản lý slide hiện tại và tự động chạy
const currentSlide = ref(0);
let autoplayInterval = null;

// --- Functions ---
const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.value.length;
};

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + slides.value.length) % slides.value.length;
};

const goToSlide = (index) => {
  currentSlide.value = index;
};

const startAutoplay = () => {
  stopAutoplay(); // Đảm bảo không có interval nào đang chạy
  autoplayInterval = setInterval(() => {
    nextSlide();
  }, 5000); // Tự động chuyển slide mỗi 5 giây
};

const stopAutoplay = () => {
  clearInterval(autoplayInterval);
};

// --- Lifecycle Hooks ---
onMounted(() => {
  startAutoplay();
});

onUnmounted(() => {
  stopAutoplay(); // Dọn dẹp interval khi component bị hủy
});
</script>

<template>
  <header class="hero-slider hero-section " @mouseenter="stopAutoplay" @mouseleave="startAutoplay">
    <div class="slider-inner">
      <div v-for="(slide, index) in slides" :key="index" class="slide" :class="{ active: index === currentSlide }"
        :style="{ backgroundImage: `url(${slide.backgroundUrl})` }">
        <div class="slide-overlay"></div>
        <div class="container slide-content">
          <h1 class="display-3 fw-bold">{{ slide.title }}</h1>
          <p class="lead">{{ slide.subtitle }}</p>
          <a href="#content" class="btn btn-accent btn-lg mt-3">{{ slide.buttonText }}</a>
        </div>
      </div>
    </div>

    <!-- Nút điều hướng -->
    <button @click="prevSlide" class="slider-nav prev" aria-label="Previous slide">&#10094;</button>
    <button @click="nextSlide" class="slider-nav next" aria-label="Next slide">&#10095;</button>

    <!-- Dấu chấm điều hướng (Pagination) -->
    <div class="slider-pagination">
      <button v-for="(slide, index) in slides" :key="`dot-${index}`" class="dot"
        :class="{ active: index === currentSlide }" @click="goToSlide(index)"
        :aria-label="`Go to slide ${index + 1}`"></button>
    </div>
  </header>
</template>

<style scoped>
.hero-slider {
  position: relative;
  width: 100%;
  height: 60vh;
  overflow: hidden;
  color: var(--text-color-light);
}

/* --- Vùng Hero --- */
.hero-section {
  padding-top: 150px;
  padding-bottom: 100px;
  position: relative;
  overflow: hidden;
  background-color: var(--surface-glass);
  border: 1px solid var(--border-glass);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border-radius: 10px;
  margin-top: 100px;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48Y2lyY2xlIGN4PSI4MCIgY3k9IjIwIiByPSIxLjUiIGZpbGw9IiNmZmZmZmYiLz48Y2lyY2xlIGN4PSIyMCIgY3k9IjgwIiByPSIxIiBmaWxsPSIjZmZmZmZmIi8+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iMC41IiBmaWxsPSIjZmZmZmZmIi8+PC9zdmc+');
  opacity: 0.5;
  animation: sparkle 20s linear infinite;
}

@keyframes sparkle {
  from {
    transform: translateY(0);
  }

  to {
    transform: translateY(-100px);
  }
}

.slider-inner {
  width: 100%;
  height: 100%;
}

.slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  opacity: 0;
  visibility: hidden;
  transition: opacity 1s ease-in-out, visibility 1s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.slide.active {
  opacity: 1;
  visibility: visible;
  z-index: 1;
}

.slide-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--overlay-color);
  z-index: 1;
}

.slide-content {
  position: relative;
  z-index: 2;
  animation: fadeInDown 1.5s ease-out;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.btn-accent {
  background-color: var(--accent-color);
  border-color: var(--accent-color);
  color: var(--text-color-light);
  padding: 0.75rem 2rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-accent:hover {
  background-color: var(--galaxy-purple);
  border-color: var(--galaxy-purple);
  transform: translateY(-3px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

/* Nút điều hướng */
.slider-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.3);
  color: white;
  border: none;
  padding: 1rem;
  cursor: pointer;
  font-size: 1.5rem;
  transition: background-color 0.3s ease;
}

.slider-nav:hover {
  background-color: rgba(0, 0, 0, 0.6);
}

.slider-nav.prev {
  left: 1rem;
  border-radius: 5px 5px;
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
}

.slider-nav.next {
  right: 1rem;
  border-radius: 5px 5px;
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
}

/* Dấu chấm điều hướng */
.slider-pagination {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  display: flex;
  gap: 0.75rem;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5);
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.4s ease;
}

.dot:hover {
  background-color: rgba(255, 255, 255, 0.8);
}

.dot.active {
  background-color: var(--text-color-light);
  transform: scale(1.2);
}

/* Responsive */
@media (max-width: 768px) {
  .hero-slider {
    height: 70vh;
  }

  .display-3 {
    font-size: 2.5rem;
  }

  .lead {
    font-size: 1rem;
  }

  .slider-nav {
    padding: 0.75rem;
    font-size: 1.25rem;
  }
}
</style>
