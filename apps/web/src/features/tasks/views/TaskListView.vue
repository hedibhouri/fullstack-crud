<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { onMounted, ref, watch } from 'vue';
import BaseAlert from '@/components/ui/BaseAlert.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import BasePagination from '@/components/ui/BasePagination.vue';
import BaseSpinner from '@/components/ui/BaseSpinner.vue';
import { useDebouncedRef } from '@/composables/useDebouncedRef';
import TaskFilters from '../components/TaskFilters.vue';
import TaskList from '../components/TaskList.vue';
import { useTasksStore } from '../stores/tasks.store';
import type { Task, TaskStatus } from '../types/task.types';

const store = useTasksStore();
const { items, meta, loading, saving, error, isEmpty, filters } = storeToRefs(store);

const search = useDebouncedRef(filters.value.search ?? '', 300);
const searchInput = ref(search.value);
const status = ref<TaskStatus | ''>(filters.value.status ?? '');

// Errors are surfaced via `store.error`; swallow the rejection here.
const load = (query: Parameters<typeof store.fetchTasks>[0] = {}) =>
  store.fetchTasks(query).catch(() => undefined);

watch(searchInput, (value) => (search.value = value));
watch(search, (value) => load({ search: value, page: 1 }));
watch(status, (value) => load({ status: value || undefined, page: 1 }));

onMounted(() => load());

async function onDelete(task: Task): Promise<void> {
  if (!window.confirm(`Delete “${task.title}”? This cannot be undone.`)) return;
  await store.deleteTask(task.id).catch(() => undefined);
}

async function onToggle(task: Task): Promise<void> {
  const next: TaskStatus = task.status === 'done' ? 'todo' : 'done';
  await store.updateTask(task.id, { status: next }).catch(() => undefined);
}
</script>

<template>
  <section>
    <header class="page-header">
      <div>
        <h1>Tasks</h1>
        <p class="muted">Keep track of what needs to get done.</p>
      </div>
      <BaseButton :to="{ name: 'tasks.create' }">+ New task</BaseButton>
    </header>

    <TaskFilters v-model:search="searchInput" v-model:status="status" />

    <BaseAlert v-if="error" variant="error" dismissible class="mb" @dismiss="store.clearError()">
      {{ error.message }}
    </BaseAlert>

    <div v-if="loading && items.length === 0" class="state">
      <BaseSpinner size="lg" />
    </div>

    <div v-else-if="isEmpty" class="state card">
      <h2>No tasks found</h2>
      <p class="muted">
        {{
          filters.search || filters.status
            ? 'Try changing your filters.'
            : 'Create your first task to get started.'
        }}
      </p>
    </div>

    <template v-else>
      <TaskList :tasks="items" :busy="saving" @delete="onDelete" @toggle="onToggle" />
      <BasePagination
        :page="meta.page"
        :total-pages="meta.totalPages"
        :total="meta.total"
        @change="(page) => load({ page })"
      />
    </template>
  </section>
</template>

<style scoped>
.state {
  display: grid;
  justify-items: center;
  gap: var(--space-2);
  padding: var(--space-12) var(--space-4);
  text-align: center;
}
.mb {
  margin-bottom: var(--space-4);
}
</style>
