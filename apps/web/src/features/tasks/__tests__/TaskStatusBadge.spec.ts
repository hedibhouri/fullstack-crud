import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import TaskStatusBadge from '../components/TaskStatusBadge.vue';

describe('TaskStatusBadge', () => {
  it.each([
    ['todo', 'To do'],
    ['in_progress', 'In progress'],
    ['done', 'Done'],
  ] as const)('renders %s as "%s"', (status, label) => {
    const wrapper = mount(TaskStatusBadge, { props: { status } });
    expect(wrapper.text()).toBe(label);
    expect(wrapper.classes()).toContain(`badge--${status}`);
  });
});
