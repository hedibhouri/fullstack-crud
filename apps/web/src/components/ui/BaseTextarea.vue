<script setup lang="ts">
import { useId } from 'vue';

defineOptions({ inheritAttrs: false });

withDefaults(defineProps<{ label?: string; error?: string; hint?: string; rows?: number }>(), {
  label: undefined,
  error: undefined,
  hint: undefined,
  rows: 4,
});

const model = defineModel<string>({ default: '' });
const id = useId();
</script>

<template>
  <div class="field">
    <label v-if="label" :for="id" class="field__label">{{ label }}</label>
    <textarea
      :id="id"
      v-model="model"
      v-bind="$attrs"
      :rows="rows"
      class="field__control"
      :class="{ 'field__control--invalid': error }"
      :aria-invalid="!!error"
      :aria-describedby="error || hint ? `${id}-msg` : undefined"
    />
    <p v-if="error" :id="`${id}-msg`" class="field__error">{{ error }}</p>
    <p v-else-if="hint" :id="`${id}-msg`" class="field__hint">{{ hint }}</p>
  </div>
</template>
