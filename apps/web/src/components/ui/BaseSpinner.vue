<script setup lang="ts">
withDefaults(defineProps<{ size?: 'sm' | 'md' | 'lg'; label?: string }>(), {
  size: 'md',
  label: 'Loading',
});
</script>

<template>
  <span class="spinner" :class="`spinner--${size}`" role="status" :aria-label="label" />
</template>

<style scoped>
.spinner {
  display: inline-block;
  border-radius: 50%;
  border: 2px solid currentColor;
  border-right-color: transparent;
  animation: spin 0.7s linear infinite;
}
.spinner--sm {
  width: 0.9rem;
  height: 0.9rem;
}
.spinner--md {
  width: 1.5rem;
  height: 1.5rem;
}
.spinner--lg {
  width: 2.5rem;
  height: 2.5rem;
  border-width: 3px;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
