<script setup lang="ts">
import type { Task } from '../types/task.types';
import TaskListItem from './TaskListItem.vue';

defineProps<{ tasks: Task[]; busy?: boolean }>();
defineEmits<{ delete: [task: Task]; toggle: [task: Task] }>();
</script>

<template>
  <ul class="list card">
    <TaskListItem
      v-for="task in tasks"
      :key="task.id"
      :task="task"
      :busy="busy"
      @delete="$emit('delete', $event)"
      @toggle="$emit('toggle', $event)"
    />
  </ul>
</template>

<style scoped>
.list {
  list-style: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>
