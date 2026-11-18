import { defineStore } from 'pinia';
import { computed, reactive, ref } from 'vue';
import { ApiError } from '@/services/http';
import type { PaginationMeta } from '@/types/api.types';
import { tasksApi } from '../api/tasks.api';
import type { CreateTaskPayload, Task, TaskQuery, UpdateTaskPayload } from '../types/task.types';

const DEFAULT_LIMIT = 10;

export const useTasksStore = defineStore('tasks', () => {
  // ─── State ──────────────────────────────────────────────────
  const items = ref<Task[]>([]);
  const meta = ref<PaginationMeta>({ page: 1, limit: DEFAULT_LIMIT, total: 0, totalPages: 0 });
  const current = ref<Task | null>(null);
  const filters = reactive<TaskQuery>({
    page: 1,
    limit: DEFAULT_LIMIT,
    status: undefined,
    search: '',
  });

  const loading = ref(false);
  const saving = ref(false);
  const error = ref<ApiError | null>(null);

  // ─── Getters ────────────────────────────────────────────────
  const isEmpty = computed(() => !loading.value && items.value.length === 0);

  // ─── Helpers ────────────────────────────────────────────────
  async function run<T>(flag: typeof loading, fn: () => Promise<T>): Promise<T> {
    flag.value = true;
    error.value = null;
    try {
      return await fn();
    } catch (e) {
      error.value = ApiError.from(e);
      throw error.value;
    } finally {
      flag.value = false;
    }
  }

  // ─── Actions ────────────────────────────────────────────────
  async function fetchTasks(query: Partial<TaskQuery> = {}): Promise<void> {
    Object.assign(filters, query);
    const result = await run(loading, () => tasksApi.list(filters));
    items.value = result.data;
    meta.value = result.meta;
  }

  async function fetchTask(id: string): Promise<Task> {
    const task = await run(loading, () => tasksApi.get(id));
    current.value = task;
    return task;
  }

  async function createTask(payload: CreateTaskPayload): Promise<Task> {
    return run(saving, () => tasksApi.create(payload));
  }

  async function updateTask(id: string, payload: UpdateTaskPayload): Promise<Task> {
    const updated = await run(saving, () => tasksApi.update(id, payload));
    items.value = items.value.map((t) => (t.id === id ? updated : t));
    if (current.value?.id === id) current.value = updated;
    return updated;
  }

  async function deleteTask(id: string): Promise<void> {
    await run(saving, () => tasksApi.remove(id));
    // Step back a page if we just removed the last item of a non-first page.
    const page =
      items.value.length === 1 && (filters.page ?? 1) > 1 ? (filters.page ?? 1) - 1 : filters.page;
    await fetchTasks({ page });
  }

  function clearError(): void {
    error.value = null;
  }

  return {
    items,
    meta,
    current,
    filters,
    loading,
    saving,
    error,
    isEmpty,
    fetchTasks,
    fetchTask,
    createTask,
    updateTask,
    deleteTask,
    clearError,
  };
});
