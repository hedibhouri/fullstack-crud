import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { env } from '@/config/env';
import { tasksRoutes } from '@/features/tasks/routes';

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: { name: 'tasks.list' } },
  ...tasksRoutes,
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: 'Page not found' },
  },
];

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: (_to, _from, saved) => saved ?? { top: 0 },
});

router.afterEach((to) => {
  const title = to.meta.title;
  document.title = title ? `${title} · ${env.appName}` : env.appName;
});
