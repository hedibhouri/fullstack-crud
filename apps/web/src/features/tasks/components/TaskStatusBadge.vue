<script setup lang="ts">
import { TASK_STATUS_LABELS, type TaskStatus } from '../types/task.types';

defineProps<{ status: TaskStatus }>();
</script>

<template>
  <span class="badge" :class="`badge--${status}`">{{ TASK_STATUS_LABELS[status] }}</span>
</template>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.15rem 0.6rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
}
.badge--todo {
  background: var(--color-surface-muted);
  color: var(--color-text-muted);
}
.badge--in_progress {
  background: var(--color-warning-soft);
  color: var(--color-warning);
}
.badge--done {
  background: var(--color-success-soft);
  color: var(--color-success);
}
</style>
