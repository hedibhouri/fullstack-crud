<script setup lang="ts">
import { computed } from 'vue';
import BaseButton from './BaseButton.vue';

const props = defineProps<{ page: number; totalPages: number; total: number }>();
const emit = defineEmits<{ change: [page: number] }>();

const hasPrev = computed(() => props.page > 1);
const hasNext = computed(() => props.page < props.totalPages);
</script>

<template>
  <nav v-if="totalPages > 1" class="pagination" aria-label="Pagination">
    <BaseButton
      variant="secondary"
      size="sm"
      :disabled="!hasPrev"
      @click="emit('change', page - 1)"
    >
      ← Previous
    </BaseButton>
    <span class="pagination__info">
      Page <strong>{{ page }}</strong> of {{ totalPages }} · {{ total }} items
    </span>
    <BaseButton
      variant="secondary"
      size="sm"
      :disabled="!hasNext"
      @click="emit('change', page + 1)"
    >
      Next →
    </BaseButton>
  </nav>
</template>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  margin-top: var(--space-6);
}
.pagination__info {
  color: var(--color-text-muted);
  font-size: 0.875rem;
}
</style>
