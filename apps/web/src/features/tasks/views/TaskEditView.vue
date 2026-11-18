<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import BaseAlert from '@/components/ui/BaseAlert.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import BaseSpinner from '@/components/ui/BaseSpinner.vue';
import TaskForm from '../components/TaskForm.vue';
import { useTasksStore } from '../stores/tasks.store';
import type { CreateTaskPayload, Task } from '../types/task.types';

const props = defineProps<{ id: string }>();

const router = useRouter();
const store = useTasksStore();
const { saving, error } = storeToRefs(store);

const task = ref<Task | null>(null);
const notFound = ref(false);
const loading = ref(true);

watch(
  () => props.id,
  async (id) => {
    loading.value = true;
    notFound.value = false;
    try {
      task.value = await store.fetchTask(id);
    } catch {
      notFound.value = store.error?.isNotFound === true || store.error?.status === 400;
    } finally {
      loading.value = false;
    }
  },
  { immediate: true },
);

async function onSubmit(payload: CreateTaskPayload): Promise<void> {
  try {
    await store.updateTask(props.id, payload);
    await router.push({ name: 'tasks.list' });
  } catch {
    // error is exposed through the store
  }
}
</script>

<template>
  <section class="narrow">
    <header class="page-header">
      <h1>Edit task</h1>
    </header>

    <div v-if="loading" class="state"><BaseSpinner size="lg" /></div>

    <div v-else-if="notFound" class="state card">
      <h2>Task not found</h2>
      <p class="muted">It may have been deleted.</p>
      <BaseButton :to="{ name: 'tasks.list' }">Back to tasks</BaseButton>
    </div>

    <template v-else>
      <BaseAlert v-if="error" variant="error" class="mb">{{ error.message }}</BaseAlert>
      <TaskForm
        v-if="task"
        :key="task.id"
        :initial="task"
        submit-label="Save changes"
        :submitting="saving"
        @submit="onSubmit"
        @cancel="router.push({ name: 'tasks.list' })"
      />
    </template>
  </section>
</template>

<style scoped>
.narrow {
  max-width: 640px;
  margin-inline: auto;
}
.state {
  display: grid;
  justify-items: center;
  gap: var(--space-3);
  padding: var(--space-12) var(--space-4);
  text-align: center;
}
.mb {
  margin-bottom: var(--space-4);
}
</style>
