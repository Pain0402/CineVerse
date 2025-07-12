<template>
  <RouterLink :to="{ name: 'movie.detail', params: { id: movie.id } }" class="movie-card text-decoration-none">
    <img :src="movie.posterUrl" class="card-img-top" :alt="movie.title" @error="handleImageError">
    <div class="card-body">
      <h5 class="card-title">{{ movie.title }}</h5>
    </div>
  </RouterLink>
</template>

<script setup>
import { RouterLink } from 'vue-router';

// Nhận dữ liệu phim từ component cha qua props
defineProps({
  movie: {
    type: Object,
    required: true
  }
});

// Hàm xử lý lỗi hình ảnh
const handleImageError = (event) => {
  event.target.src = 'https://placehold.co/300x450/0D0C1D/F5F5FA?text=Not+Found';
};
</script>

<style scoped>
/* Sao chép toàn bộ CSS của .movie-card từ HomeView.vue vào đây */
.movie-card {
  flex: 0 0 auto;
  width: 220px;
  margin-right: 1.5rem;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background: rgba(245, 245, 250, 0.05);
  /* --surface-glass */
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(245, 245, 250, 0.2);
  /* --border-glass */
}

.movie-card:hover {
  transform: translateY(-10px) scale(1.03);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 217, 77, 0.5);
}

.movie-card .card-img-top {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-bottom: 1px solid rgba(245, 245, 250, 0.2);
  /* --border-glass */
}

.movie-card .card-body {
  padding: 1rem;
}

.movie-card .card-title {
  font-size: 1rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #F5F5FA;
  /* --nebula-white */
}
</style>