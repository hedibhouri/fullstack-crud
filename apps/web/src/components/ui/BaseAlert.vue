<script setup lang="ts">
withDefaults(defineProps<{ variant?: 'error' | 'info' | 'success'; dismissible?: boolean }>(), {
  variant: 'info',
  dismissible: false,
});

defineEmits<{ dismiss: [] }>();
</script>

<template>
  <div class="alert" :class="`alert--${variant}`" :role="variant === 'error' ? 'alert' : 'status'">
    <div class="alert__body"><slot /></div>
    <button
      v-if="dismissible"
      type="button"
      class="alert__close"
      aria-label="Dismiss"
      @click="$emit('dismiss')"
    >
      ×
    </button>
  </div>
</template>

<style scoped>
.alert {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  border: 1px solid;
  font-size: 0.9375rem;
}
.alert__body {
  flex: 1;
}
.alert--error {
  background: var(--color-danger-soft);
  border-color: var(--color-danger);
  color: var(--color-danger-text);
}
.alert--info {
  background: var(--color-primary-soft);
  border-color: var(--color-primary);
  color: var(--color-text);
}
.alert--success {
  background: var(--color-success-soft);
  border-color: var(--color-success);
  color: var(--color-text);
}
.alert__close {
  background: none;
  border: 0;
  font-size: 1.25rem;
  line-height: 1;
  cursor: pointer;
  color: inherit;
}
</style>
