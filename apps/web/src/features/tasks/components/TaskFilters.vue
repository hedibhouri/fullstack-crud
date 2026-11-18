<script setup lang="ts">
import BaseInput from '@/components/ui/BaseInput.vue';
import BaseSelect from '@/components/ui/BaseSelect.vue';
import type { SelectOption } from '@/types/ui.types';
import { TASK_STATUS_LABELS, TASK_STATUSES, type TaskStatus } from '../types/task.types';

const search = defineModel<string>('search', { default: '' });
const status = defineModel<TaskStatus | ''>('status', { default: '' });

const statusOptions: SelectOption<TaskStatus>[] = TASK_STATUSES.map((value) => ({
  value,
  label: TASK_STATUS_LABELS[value],
}));
</script>

<template>
  <div class="filters">
    <BaseInput
      v-model="search"
      type="search"
      placeholder="Search tasks…"
      aria-label="Search tasks"
      class="filters__search"
    />
    <BaseSelect
      v-model="status"
      :options="statusOptions"
      placeholder="All statuses"
      aria-label="Filter by status"
    />
  </div>
</template>

<style scoped>
.filters {
  display: grid;
  grid-template-columns: 1fr 200px;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
}
@media (max-width: 560px) {
  .filters {
    grid-template-columns: 1fr;
  }
}
</style>
