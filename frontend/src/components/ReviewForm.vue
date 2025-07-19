<template>
  <div class="review-form-container glass-surface p-4 rounded-3 mb-4">
    <form @submit.prevent="submitReview">
      <!-- Text Area -->
      <div class="mb-3">
        <label for="reviewText" class="form-label section-title mb-2">Nội dung đánh giá</label>
        <textarea 
          class="form-control custom-input" 
          id="reviewText" 
          rows="5" 
          placeholder="Chia sẻ cảm nhận của bạn về bộ phim..."
          v-model="comment"
          required
        ></textarea>
      </div>

      <!-- Rating Section -->
      <div class="mb-4">
        <label class="form-label section-title mb-2">Chấm điểm</label>
        <div class="rating-buttons d-flex flex-wrap gap-2">
          <button 
            v-for="score in [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]" 
            :key="score" 
            type="button" 
            class="btn btn-rating"
            :class="{ active: rating === score }"
            @click="rating = score"
          >
            {{ score }}
          </button>
        </div>
        <div v-if="rating" class="rating-feedback mt-2">
          <i class="fa-solid fa-check-circle me-1"></i> Bạn đã chọn: <strong>{{ rating }} - {{ getRatingText(rating) }}</strong>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="d-flex justify-content-end gap-2">
        <button type="button" class="btn btn-outline-light" @click="$emit('cancel')">Hủy</button>
        <button type="submit" class="btn gradient-button" :disabled="isSubmitting">
          <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2" role="status"></span>
          {{ isSubmitting ? 'Đang lưu...' : 'Lưu' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// SỬA ĐỔI: Thêm props để nhận dữ liệu ban đầu cho việc chỉnh sửa
const props = defineProps({
  isSubmitting: {
    type: Boolean,
    default: false,
  },
  initialComment: {
    type: String,
    default: ''
  },
  initialRating: {
    type: Number,
    default: null
  }
});

const emit = defineEmits(['submit-review', 'cancel']);

const rating = ref(null);
const comment = ref('');

// SỬA ĐỔI: Sử dụng onMounted để điền dữ liệu vào form nếu có
onMounted(() => {
  comment.value = props.initialComment;
  rating.value = props.initialRating;
});

const ratingDescriptions = {
  10: 'Tuyệt tác!', 9: 'Rất hay', 8: 'Hay', 7: 'Khá', 6: 'Ổn',
  5: 'Trung bình', 4: 'Dưới trung bình', 3: 'Tệ', 2: 'Rất tệ', 1: 'Thảm họa'
};

const getRatingText = (score) => {
  return ratingDescriptions[score] || '';
};

const submitReview = () => {
  if (!comment.value.trim() || !rating.value) {
    alert('Vui lòng nhập nội dung và chấm điểm.');
    return;
  }
  emit('submit-review', { rating: rating.value, comment: comment.value });
};
</script>

<style scoped>
/* CSS giữ nguyên */
.section-title {
  font-weight: 600;
  color: var(--nebula-white);
}
.custom-input {
  background-color: rgba(13, 12, 29, 0.7);
  border: 1px solid var(--border-glass);
  color: var(--nebula-white);
}
.custom-input:focus {
  background-color: rgba(13, 12, 29, 0.9);
  border-color: var(--cosmic-blue);
  box-shadow: 0 0 0 0.25rem rgba(46, 115, 232, 0.25);
  color: var(--nebula-white);
}
.btn-rating {
  background-color: var(--surface-glass);
  border: 1px solid var(--border-glass);
  color: var(--nebula-white);
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  transition: all 0.2s ease;
}
.btn-rating:hover {
  border-color: var(--starlight-yellow);
  color: var(--starlight-yellow);
}
.btn-rating.active {
  background: linear-gradient(90deg, var(--galaxy-purple), var(--cosmic-blue));
  color: white;
  border-color: var(--cosmic-blue);
  transform: scale(1.1);
}
.rating-feedback {
  color: var(--starlight-yellow);
  font-weight: 500;
}
.gradient-button {
  background: linear-gradient(90deg, var(--galaxy-purple), var(--cosmic-blue));
  border: none;
  color: var(--nebula-white);
  font-weight: bold;
}
</style>
