<script setup lang="ts">
import AppHeader from '@/components/layout/AppHeader.vue';
</script>

<template>
  <div class="layout">
    <AppHeader />
    <main class="container layout__main">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.layout__main {
  flex: 1;
  width: 100%;
  padding-block: var(--space-8);
}
</style>
