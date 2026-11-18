<script setup lang="ts">
import BaseButton from '@/components/ui/BaseButton.vue';
</script>

<template>
  <section class="not-found">
    <p class="not-found__code">404</p>
    <h1>Page not found</h1>
    <p class="muted">The page you are looking for doesn’t exist or has been moved.</p>
    <BaseButton :to="{ name: 'tasks.list' }">Back to tasks</BaseButton>
  </section>
</template>

<style scoped>
.not-found {
  display: grid;
  justify-items: center;
  gap: var(--space-3);
  padding-block: var(--space-12);
  text-align: center;
}
.not-found__code {
  font-size: 4rem;
  font-weight: 800;
  color: var(--color-primary);
  margin: 0;
}
</style>
