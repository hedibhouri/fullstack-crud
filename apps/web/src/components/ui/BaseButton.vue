<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink, type RouteLocationRaw } from 'vue-router';
import BaseSpinner from './BaseSpinner.vue';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';
type Size = 'sm' | 'md';

const props = withDefaults(
  defineProps<{
    variant?: Variant;
    size?: Size;
    type?: 'button' | 'submit' | 'reset';
    loading?: boolean;
    disabled?: boolean;
    /** When set, renders a RouterLink styled as a button */
    to?: RouteLocationRaw;
  }>(),
  {
    variant: 'primary',
    size: 'md',
    type: 'button',
    loading: false,
    disabled: false,
    to: undefined,
  },
);

const isLink = computed(() => props.to !== undefined);
</script>

<template>
  <RouterLink v-if="isLink && to" :to="to" class="btn" :class="[`btn--${variant}`, `btn--${size}`]">
    <slot />
  </RouterLink>
  <button
    v-else
    :type="type"
    class="btn"
    :class="[`btn--${variant}`, `btn--${size}`]"
    :disabled="disabled || loading"
    :aria-busy="loading"
  >
    <BaseSpinner v-if="loading" size="sm" />
    <slot />
  </button>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  font: inherit;
  font-weight: 600;
  line-height: 1;
  text-decoration: none;
  cursor: pointer;
  transition:
    background-color 0.15s,
    border-color 0.15s,
    color 0.15s;
  white-space: nowrap;
}
.btn:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.btn--md {
  padding: 0.625rem 1rem;
  font-size: 0.9375rem;
}
.btn--sm {
  padding: 0.4rem 0.7rem;
  font-size: 0.8125rem;
}
.btn--primary {
  background: var(--color-primary);
  color: var(--color-on-primary);
}
.btn--primary:hover:not(:disabled) {
  background: var(--color-primary-hover);
}
.btn--secondary {
  background: var(--color-surface);
  border-color: var(--color-border);
  color: var(--color-text);
}
.btn--secondary:hover:not(:disabled) {
  background: var(--color-surface-muted);
}
.btn--danger {
  background: var(--color-danger);
  color: #fff;
}
.btn--danger:hover:not(:disabled) {
  filter: brightness(0.92);
}
.btn--ghost {
  background: transparent;
  color: var(--color-text-muted);
}
.btn--ghost:hover:not(:disabled) {
  background: var(--color-surface-muted);
  color: var(--color-text);
}
</style>
