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

<style></style>
