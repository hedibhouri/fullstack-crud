import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { TaskStatus } from './enums/task-status.enum';
import { TasksService } from './tasks.service';

type MockRepository = Partial<Record<keyof Repository<Task>, jest.Mock>>;

const buildTask = (overrides: Partial<Task> = {}): Task =>
  Object.assign(new Task(), {
    id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
    title: 'Test task',
    description: null,
    status: TaskStatus.Todo,
    dueDate: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  });

describe('TasksService', () => {
  let service: TasksService;
  let repo: MockRepository;

  beforeEach(async () => {
    repo = {
      findAndCount: jest.fn(),
      findOneBy: jest.fn(),
      create: jest.fn((dto: Partial<Task>) => buildTask(dto)),
      save: jest.fn((task: Task) => Promise.resolve(task)),
      merge: jest.fn((task: Task, dto: Partial<Task>) => Object.assign(task, dto)),
      remove: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [TasksService, { provide: getRepositoryToken(Task), useValue: repo }],
    }).compile();

    service = moduleRef.get(TasksService);
  });

  describe('findAll', () => {
    it('returns paginated tasks with correct skip/take', async () => {
      const tasks = [buildTask()];
      repo.findAndCount!.mockResolvedValue([tasks, 21]);

      const result = await service.findAll({ page: 3, limit: 10 });

      expect(repo.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 20, take: 10 }),
      );
      expect(result.data).toBe(tasks);
      expect(result.meta).toEqual({ page: 3, limit: 10, total: 21, totalPages: 3 });
    });

    it('applies status filter', async () => {
      repo.findAndCount!.mockResolvedValue([[], 0]);
      await service.findAll({ page: 1, limit: 10, status: TaskStatus.Done });
      expect(repo.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({ where: { status: TaskStatus.Done } }),
      );
    });
  });

  describe('findOne', () => {
    it('returns the task when found', async () => {
      const task = buildTask();
      repo.findOneBy!.mockResolvedValue(task);
      await expect(service.findOne(task.id)).resolves.toBe(task);
    });

    it('throws NotFoundException when missing', async () => {
      repo.findOneBy!.mockResolvedValue(null);
      await expect(service.findOne('missing')).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  it('create persists a new task', async () => {
    const result = await service.create({ title: 'New' });
    expect(repo.create).toHaveBeenCalledWith({ title: 'New' });
    expect(repo.save).toHaveBeenCalled();
    expect(result.title).toBe('New');
  });

  it('update merges changes into the existing task', async () => {
    repo.findOneBy!.mockResolvedValue(buildTask());
    const result = await service.update('id', { status: TaskStatus.InProgress });
    expect(result.status).toBe(TaskStatus.InProgress);
  });

  it('remove deletes an existing task', async () => {
    const task = buildTask();
    repo.findOneBy!.mockResolvedValue(task);
    await service.remove(task.id);
    expect(repo.remove).toHaveBeenCalledWith(task);
  });
});
