import { http } from '@/services/http';
import type { Paginated } from '@/types/api.types';
import type { CreateTaskPayload, Task, TaskQuery, UpdateTaskPayload } from '../types/task.types';

const RESOURCE = '/tasks';

/** Strip empty values so they are not sent as query params. */
const cleanParams = (query: TaskQuery): Record<string, string | number> =>
  Object.fromEntries(
    Object.entries(query).filter(([, value]) => value !== undefined && value !== ''),
  ) as Record<string, string | number>;

export const tasksApi = {
  async list(query: TaskQuery = {}): Promise<Paginated<Task>> {
    const { data } = await http.get<Paginated<Task>>(RESOURCE, { params: cleanParams(query) });
    return data;
  },

  async get(id: string): Promise<Task> {
    const { data } = await http.get<Task>(`${RESOURCE}/${id}`);
    return data;
  },

  async create(payload: CreateTaskPayload): Promise<Task> {
    const { data } = await http.post<Task>(RESOURCE, payload);
    return data;
  },

  async update(id: string, payload: UpdateTaskPayload): Promise<Task> {
    const { data } = await http.patch<Task>(`${RESOURCE}/${id}`, payload);
    return data;
  },

  async remove(id: string): Promise<void> {
    await http.delete(`${RESOURCE}/${id}`);
  },
};
