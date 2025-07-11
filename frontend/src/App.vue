<template>
  <div id="app">
    <HomeView />
  </div>
</template>

<script setup>
import HomeView from '@/views/HomeView.vue';
</script>

<style>
/* Nhập Bootstrap 5 CSS */
@import url('https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css');

/* Nhập font Inter từ Google Fonts (tùy chọn, nếu bạn muốn giữ font này) */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

body {
  font-family: 'Inter', sans-serif;
  /* Áp dụng font Inter cho toàn bộ body */
}
</style>
