<template>
  <RouterLink :to="{ name: 'movie.detail', params: { id: item.id } }" class="suggestion-item text-decoration-none">
    <img :src="item.posterUrl" class="suggestion-poster" :alt="item.title" @error="handleImageError">
    <div class="suggestion-details">
      <p class="suggestion-title mb-0">{{ item.title }}</p>
      <small class="suggestion-meta">{{ item.year }} • {{ item.type }}</small>
    </div>
  </RouterLink>
</template>

<script setup>
import { RouterLink } from 'vue-router';

defineProps({
  item: {
    type: Object,
    required: true
  }
});

const handleImageError = (event) => {
  event.target.src = 'https://placehold.co/50x75/0D0C1D/F5F5FA?text=Cine';
};
</script>

<style scoped>
.suggestion-item {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  color: var(--nebula-white);
}

.suggestion-item:hover {
  background-color: var(--galaxy-purple);
}

.suggestion-poster {
  width: 40px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 1rem;
  flex-shrink: 0;
}

.suggestion-title {
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.suggestion-meta {
  color: #adb5bd;
  font-size: 0.8rem;
}
</style>
