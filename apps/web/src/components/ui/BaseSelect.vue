<script setup lang="ts" generic="T extends string">
import { useId } from 'vue';
import type { SelectOption } from '@/types/ui.types';

defineOptions({ inheritAttrs: false });

withDefaults(
  defineProps<{
    options: SelectOption<T>[];
    label?: string;
    error?: string;
    placeholder?: string;
  }>(),
  { label: undefined, error: undefined, placeholder: undefined },
);

const model = defineModel<T | ''>({ default: '' });
const id = useId();
</script>

<template>
  <div class="field">
    <label v-if="label" :for="id" class="field__label">{{ label }}</label>
    <select
      :id="id"
      v-model="model"
      v-bind="$attrs"
      class="field__control"
      :class="{ 'field__control--invalid': error }"
      :aria-invalid="!!error"
    >
      <option v-if="placeholder !== undefined" value="">{{ placeholder }}</option>
      <option v-for="opt in options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
    </select>
    <p v-if="error" class="field__error">{{ error }}</p>
  </div>
</template>
