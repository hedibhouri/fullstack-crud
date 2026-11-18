<script setup lang="ts">
import { env } from '@/config/env';
</script>

<template>
  <header class="header">
    <div class="container header__inner">
      <RouterLink :to="{ name: 'tasks.list' }" class="header__brand">
        <img src="/favicon.svg" alt="" width="28" height="28" />
        <span>{{ env.appName }}</span>
      </RouterLink>
      <nav class="header__nav" aria-label="Main">
        <RouterLink :to="{ name: 'tasks.list' }" class="header__link">All tasks</RouterLink>
        <RouterLink :to="{ name: 'tasks.create' }" class="header__link">New task</RouterLink>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.header {
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 10;
}
.header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 60px;
  gap: var(--space-4);
}
.header__brand {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-weight: 700;
  font-size: 1.125rem;
  color: var(--color-text);
  text-decoration: none;
}
.header__nav {
  display: flex;
  gap: var(--space-1);
}
.header__link {
  padding: 0.4rem 0.75rem;
  border-radius: var(--radius-md);
  color: var(--color-text-muted);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9375rem;
}
.header__link:hover {
  background: var(--color-surface-muted);
  color: var(--color-text);
}
.header__link.router-link-exact-active {
  color: var(--color-primary);
  background: var(--color-primary-soft);
}
</style>
