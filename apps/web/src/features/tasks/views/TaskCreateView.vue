<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import BaseAlert from '@/components/ui/BaseAlert.vue';
import TaskForm from '../components/TaskForm.vue';
import { useTasksStore } from '../stores/tasks.store';
import type { CreateTaskPayload } from '../types/task.types';

const router = useRouter();
const store = useTasksStore();
const { saving, error } = storeToRefs(store);

onMounted(() => store.clearError());

async function onSubmit(payload: CreateTaskPayload): Promise<void> {
  try {
    await store.createTask(payload);
    await router.push({ name: 'tasks.list' });
  } catch {
    // error is exposed through the store
  }
}
</script>

<template>
  <section class="narrow">
    <header class="page-header">
      <h1>New task</h1>
    </header>
    <BaseAlert v-if="error" variant="error" class="mb">
      {{ error.message }}
      <ul v-if="error.details.length > 1">
        <li v-for="detail in error.details" :key="detail">{{ detail }}</li>
      </ul>
    </BaseAlert>
    <TaskForm
      submit-label="Create task"
      :submitting="saving"
      @submit="onSubmit"
      @cancel="router.push({ name: 'tasks.list' })"
    />
  </section>
</template>

<style scoped>
.narrow {
  max-width: 640px;
  margin-inline: auto;
}
.mb {
  margin-bottom: var(--space-4);
}
</style>
