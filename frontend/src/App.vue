<template>
  <div id="app">
    <AppNavbar />

    <RouterView />

    <AppFooter />
  </div>
</template>

<script setup>
import AppFooter from '@/components/AppFooter.vue';
import AppNavbar from '@/components/AppNavbar.vue';
</script>

<style>
/* Nhập Bootstrap 5 CSS */
/* @import url('https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css'); */

/* Nhập font Inter từ Google Fonts (tùy chọn, nếu bạn muốn giữ font này) */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

:root {
  --galaxy-purple: #5A42D4;
  --cosmic-blue: #2E73E8;
  --starlight-yellow: #FFD94D;
  --deep-space-black: #0D0C1D;
  --nebula-white: #F5F5FA;
  --surface-glass: rgba(245, 245, 250, 0.05);
  --border-glass: rgba(245, 245, 250, 0.2);

  color: var(--nebula-white);
  font-family: 'Be Vietnam Pro', sans-serif;
  min-height: 100vh;
}

body {
  font-family: 'Inter', sans-serif;
}
</style>
