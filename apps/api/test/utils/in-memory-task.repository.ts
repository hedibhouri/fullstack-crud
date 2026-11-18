import { randomUUID } from 'node:crypto';
import { Task } from '../../src/modules/tasks/entities/task.entity';
import { TaskStatus } from '../../src/modules/tasks/enums/task-status.enum';

/**
 * Minimal in-memory stand-in for `Repository<Task>` so e2e tests can
 * exercise the full HTTP pipeline without a running database.
 */
export class InMemoryTaskRepository {
  private readonly store = new Map<string, Task>();

  create(dto: Partial<Task>): Task {
    return Object.assign(new Task(), dto);
  }

  merge(task: Task, dto: Partial<Task>): Task {
    return Object.assign(task, dto);
  }

  save(task: Task): Promise<Task> {
    const now = new Date();
    task.id ??= randomUUID();
    task.createdAt ??= now;
    task.updatedAt = now;
    task.status ??= TaskStatus.Todo;
    task.description ??= null;
    task.dueDate ??= null;
    this.store.set(task.id, task);
    return Promise.resolve(task);
  }

  findOneBy({ id }: { id: string }): Promise<Task | null> {
    return Promise.resolve(this.store.get(id) ?? null);
  }

  findAndCount({
    skip = 0,
    take = 10,
  }: {
    skip?: number;
    take?: number;
  }): Promise<[Task[], number]> {
    const all = [...this.store.values()];
    return Promise.resolve([all.slice(skip, skip + take), all.length]);
  }

  remove(task: Task): Promise<Task> {
    this.store.delete(task.id);
    return Promise.resolve(task);
  }

  clear(): void {
    this.store.clear();
  }
}
