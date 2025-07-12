<template>
  <section class="movie-list-section mb-5">
    <h2 class="mb-3">{{ title }}</h2>
    <div v-if="movies.length > 0" class="horizontal-scroll-container">
      <MovieCard v-for="movie in movies" :key="movie.id" :movie="movie" />
    </div>
    <div v-else class="text-muted">
      Không có phim nào trong danh sách này.
    </div>
  </section>
</template>

<script setup>
import MovieCard from './MovieCard.vue';

defineProps({
  title: {
    type: String,
    required: true
  },
  movies: {
    type: Array,
    required: true
  }
});
</script>

<style scoped>
.movie-list-section h2 {
  font-weight: 700;
  color: #F5F5FA;
  /* --nebula-white */
  border-left: 4px solid #5A42D4;
  /* --galaxy-purple */
  padding-left: 1rem;
}

.horizontal-scroll-container {
  display: flex;
  overflow-x: auto;
  padding-bottom: 1rem;
  scrollbar-width: thin;
  scrollbar-color: #5A42D4 #0D0C1D;
  /* --galaxy-purple --deep-space-black */
}

.horizontal-scroll-container::-webkit-scrollbar {
  height: 8px;
}

.horizontal-scroll-container::-webkit-scrollbar-track {
  background: #0D0C1D;
}

.horizontal-scroll-container::-webkit-scrollbar-thumb {
  background-color: #5A42D4;
  border-radius: 10px;
  border: 2px solid #0D0C1D;
}
</style>