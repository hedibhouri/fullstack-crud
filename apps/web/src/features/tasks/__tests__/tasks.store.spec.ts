import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '@/services/http';
import { tasksApi } from '../api/tasks.api';
import { useTasksStore } from '../stores/tasks.store';
import type { Task } from '../types/task.types';

vi.mock('../api/tasks.api', () => ({
  tasksApi: {
    list: vi.fn(),
    get: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
}));

const api = vi.mocked(tasksApi);

const task = (overrides: Partial<Task> = {}): Task => ({
  id: '1',
  title: 'Task',
  description: null,
  status: 'todo',
  dueDate: null,
  createdAt: '',
  updatedAt: '',
  ...overrides,
});

describe('useTasksStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.resetAllMocks();
  });

  it('fetchTasks stores items and meta, merging filters', async () => {
    api.list.mockResolvedValue({
      data: [task()],
      meta: { page: 2, limit: 10, total: 11, totalPages: 2 },
    });
    const store = useTasksStore();

    await store.fetchTasks({ page: 2, status: 'done' });

    expect(api.list).toHaveBeenCalledWith(expect.objectContaining({ page: 2, status: 'done' }));
    expect(store.items).toHaveLength(1);
    expect(store.meta.total).toBe(11);
    expect(store.loading).toBe(false);
  });

  it('exposes a normalised error when a request fails', async () => {
    api.list.mockRejectedValue(new ApiError('Boom', 500));
    const store = useTasksStore();

    await expect(store.fetchTasks()).rejects.toBeInstanceOf(ApiError);
    expect(store.error?.message).toBe('Boom');
    expect(store.loading).toBe(false);
  });

  it('updateTask replaces the item in the list', async () => {
    const store = useTasksStore();
    store.items = [task({ id: 'a' }), task({ id: 'b' })];
    api.update.mockResolvedValue(task({ id: 'b', status: 'done' }));

    await store.updateTask('b', { status: 'done' });

    expect(store.items.find((t) => t.id === 'b')?.status).toBe('done');
  });

  it('deleteTask removes then refetches the list', async () => {
    const store = useTasksStore();
    api.remove.mockResolvedValue();
    api.list.mockResolvedValue({ data: [], meta: { page: 1, limit: 10, total: 0, totalPages: 0 } });

    await store.deleteTask('1');

    expect(api.remove).toHaveBeenCalledWith('1');
    expect(api.list).toHaveBeenCalled();
  });
});
