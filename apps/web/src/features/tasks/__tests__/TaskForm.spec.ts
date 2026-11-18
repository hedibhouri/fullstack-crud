import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import TaskForm from '../components/TaskForm.vue';
import type { Task } from '../types/task.types';

const RouterLinkStub = { template: '<a><slot /></a>' };
const mountForm = (props: Record<string, unknown> = {}) =>
  mount(TaskForm, { props, global: { stubs: { RouterLink: RouterLinkStub } } });

describe('TaskForm', () => {
  it('shows a validation error and does not emit when title is empty', async () => {
    const wrapper = mountForm();

    await wrapper.find('form').trigger('submit');

    expect(wrapper.text()).toContain('Title is required');
    expect(wrapper.emitted('submit')).toBeUndefined();
  });

  it('emits a normalised payload on valid submit', async () => {
    const wrapper = mountForm();

    await wrapper.find('input[type="text"]').setValue('  Buy milk  ');
    await wrapper.find('form').trigger('submit');

    expect(wrapper.emitted('submit')?.[0]).toEqual([
      { title: 'Buy milk', description: null, status: 'todo', dueDate: null },
    ]);
  });

  it('pre-fills fields from the initial task', () => {
    const initial: Task = {
      id: '1',
      title: 'Existing',
      description: 'Some details',
      status: 'in_progress',
      dueDate: '2026-12-31',
      createdAt: '',
      updatedAt: '',
    };
    const wrapper = mountForm({ initial });

    expect((wrapper.find('input[type="text"]').element as HTMLInputElement).value).toBe('Existing');
    expect((wrapper.find('textarea').element as HTMLTextAreaElement).value).toBe('Some details');
    expect((wrapper.find('select').element as HTMLSelectElement).value).toBe('in_progress');
  });

  it('emits cancel', async () => {
    const wrapper = mountForm();
    const cancel = wrapper.findAll('button').find((b) => b.text() === 'Cancel');
    await cancel?.trigger('click');
    expect(wrapper.emitted('cancel')).toHaveLength(1);
  });
});
