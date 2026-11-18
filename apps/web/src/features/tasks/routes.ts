import type { RouteRecordRaw } from 'vue-router';

export const tasksRoutes: RouteRecordRaw[] = [
  {
    path: '/tasks',
    name: 'tasks.list',
    component: () => import('./views/TaskListView.vue'),
    meta: { title: 'Tasks' },
  },
  {
    path: '/tasks/new',
    name: 'tasks.create',
    component: () => import('./views/TaskCreateView.vue'),
    meta: { title: 'New task' },
  },
  {
    path: '/tasks/:id/edit',
    name: 'tasks.edit',
    component: () => import('./views/TaskEditView.vue'),
    props: true,
    meta: { title: 'Edit task' },
  },
];
