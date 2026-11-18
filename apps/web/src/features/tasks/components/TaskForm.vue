<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import BaseInput from '@/components/ui/BaseInput.vue';
import BaseSelect from '@/components/ui/BaseSelect.vue';
import BaseTextarea from '@/components/ui/BaseTextarea.vue';
import type { SelectOption } from '@/types/ui.types';
import {
  TASK_DESCRIPTION_MAX,
  TASK_STATUS_LABELS,
  TASK_STATUSES,
  TASK_TITLE_MAX,
  type CreateTaskPayload,
  type Task,
  type TaskStatus,
} from '../types/task.types';

const props = withDefaults(
  defineProps<{ initial?: Task | null; submitting?: boolean; submitLabel?: string }>(),
  { initial: null, submitting: false, submitLabel: 'Save' },
);

const emit = defineEmits<{ submit: [payload: CreateTaskPayload]; cancel: [] }>();

const form = reactive({
  title: props.initial?.title ?? '',
  description: props.initial?.description ?? '',
  status: (props.initial?.status ?? 'todo') as TaskStatus | '',
  dueDate: props.initial?.dueDate ?? '',
});

const touched = ref(false);

const statusOptions: SelectOption<TaskStatus>[] = TASK_STATUSES.map((value) => ({
  value,
  label: TASK_STATUS_LABELS[value],
}));

const errors = computed(() => {
  const result: Partial<Record<keyof typeof form, string>> = {};
  const title = form.title.trim();
  if (!title) result.title = 'Title is required';
  else if (title.length > TASK_TITLE_MAX) result.title = `Max ${TASK_TITLE_MAX} characters`;
  if (form.description.length > TASK_DESCRIPTION_MAX)
    result.description = `Max ${TASK_DESCRIPTION_MAX} characters`;
  return result;
});

const isValid = computed(() => Object.keys(errors.value).length === 0);

function onSubmit(): void {
  touched.value = true;
  if (!isValid.value) return;

  emit('submit', {
    title: form.title.trim(),
    description: form.description.trim() || null,
    status: form.status || 'todo',
    dueDate: form.dueDate || null,
  });
}
</script>

<template>
  <form class="form card" novalidate @submit.prevent="onSubmit">
    <BaseInput
      v-model="form.title"
      label="Title"
      required
      :maxlength="TASK_TITLE_MAX"
      placeholder="What needs to be done?"
      :error="touched ? errors.title : undefined"
      autofocus
    />
    <BaseTextarea
      v-model="form.description"
      label="Description"
      placeholder="Add some details (optional)"
      :hint="`${form.description.length}/${TASK_DESCRIPTION_MAX}`"
      :error="touched ? errors.description : undefined"
    />
    <div class="form__row">
      <BaseSelect v-model="form.status" label="Status" :options="statusOptions" />
      <BaseInput v-model="form.dueDate" type="date" label="Due date" />
    </div>
    <div class="form__actions">
      <BaseButton variant="secondary" :disabled="submitting" @click="emit('cancel')">
        Cancel
      </BaseButton>
      <BaseButton type="submit" :loading="submitting">{{ submitLabel }}</BaseButton>
    </div>
  </form>
</template>

<style scoped>
.form {
  display: grid;
  gap: var(--space-4);
}
.form__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
}
.form__actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-2);
  padding-top: var(--space-2);
}
@media (max-width: 560px) {
  .form__row {
    grid-template-columns: 1fr;
  }
}
</style>
