import type { PaginationParams } from '@/types/api.types';

export const TASK_STATUSES = ['todo', 'in_progress', 'done'] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  todo: 'To do',
  in_progress: 'In progress',
  done: 'Done',
};

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  /** ISO date (YYYY-MM-DD) */
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskPayload {
  title: string;
  description?: string | null;
  status?: TaskStatus;
  dueDate?: string | null;
}

export type UpdateTaskPayload = Partial<CreateTaskPayload>;

export interface TaskQuery extends PaginationParams {
  status?: TaskStatus;
  search?: string;
}

export const TASK_TITLE_MAX = 120;
export const TASK_DESCRIPTION_MAX = 1000;
