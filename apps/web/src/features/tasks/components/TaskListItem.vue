<script setup lang="ts">
import { computed } from 'vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import type { Task } from '../types/task.types';
import TaskStatusBadge from './TaskStatusBadge.vue';

const props = defineProps<{ task: Task; busy?: boolean }>();
defineEmits<{ delete: [task: Task]; toggle: [task: Task] }>();

const dueLabel = computed(() =>
  props.task.dueDate
    ? new Date(`${props.task.dueDate}T00:00:00`).toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : null,
);
const isDone = computed(() => props.task.status === 'done');
</script>

<template>
  <li class="item" :class="{ 'item--done': isDone }">
    <input
      type="checkbox"
      class="item__check"
      :checked="isDone"
      :disabled="busy"
      :aria-label="`Mark “${task.title}” as ${isDone ? 'not done' : 'done'}`"
      @change="$emit('toggle', task)"
    />
    <div class="item__content">
      <div class="item__top">
        <h3 class="item__title">{{ task.title }}</h3>
        <TaskStatusBadge :status="task.status" />
      </div>
      <p v-if="task.description" class="item__desc">{{ task.description }}</p>
      <p v-if="dueLabel" class="item__due">Due {{ dueLabel }}</p>
    </div>
    <div class="item__actions">
      <BaseButton variant="ghost" size="sm" :to="{ name: 'tasks.edit', params: { id: task.id } }">
        Edit
      </BaseButton>
      <BaseButton variant="ghost" size="sm" :disabled="busy" @click="$emit('delete', task)">
        Delete
      </BaseButton>
    </div>
  </li>
</template>

<style scoped>
.item {
  display: flex;
  gap: var(--space-3);
  align-items: flex-start;
  padding: var(--space-4);
  border-bottom: 1px solid var(--color-border);
}
.item:last-child {
  border-bottom: 0;
}
.item__check {
  margin-top: 0.3rem;
  width: 1.05rem;
  height: 1.05rem;
  accent-color: var(--color-primary);
  cursor: pointer;
}
.item__content {
  flex: 1;
  min-width: 0;
}
.item__top {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-wrap: wrap;
}
.item__title {
  font-size: 1rem;
  font-weight: 600;
  overflow-wrap: anywhere;
}
.item--done .item__title {
  text-decoration: line-through;
  color: var(--color-text-muted);
}
.item__desc {
  margin: var(--space-1) 0 0;
  color: var(--color-text-muted);
  font-size: 0.9rem;
  white-space: pre-line;
  overflow-wrap: anywhere;
}
.item__due {
  margin: var(--space-1) 0 0;
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}
.item__actions {
  display: flex;
  gap: var(--space-1);
}
</style>
