import { customRef, onScopeDispose, type Ref } from 'vue';

/** A ref whose updates are applied only after `delay` ms of inactivity. */
export function useDebouncedRef<T>(initial: T, delay = 300): Ref<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  let value = initial;

  onScopeDispose(() => clearTimeout(timer));

  return customRef<T>((track, trigger) => ({
    get() {
      track();
      return value;
    },
    set(next) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        value = next;
        trigger();
      }, delay);
    },
  }));
}
