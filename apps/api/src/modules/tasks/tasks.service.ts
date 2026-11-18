import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { type FindOptionsWhere, ILike, Repository } from 'typeorm';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';
import type { CreateTaskDto, QueryTaskDto, UpdateTaskDto } from './dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
  ) {}

  async findAll(query: QueryTaskDto): Promise<PaginatedResponseDto<Task>> {
    const { page, limit, status, search } = query;

    const where: FindOptionsWhere<Task> = {};
    if (status) where.status = status;
    if (search) where.title = ILike(`%${search}%`);

    const [items, total] = await this.tasksRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return PaginatedResponseDto.of(items, total, page, limit);
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.tasksRepository.findOneBy({ id });
    if (!task) {
      throw new NotFoundException(`Task with id "${id}" not found`);
    }
    return task;
  }

  async create(dto: CreateTaskDto): Promise<Task> {
    const task = this.tasksRepository.create(dto);
    return this.tasksRepository.save(task);
  }

  async update(id: string, dto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);
    this.tasksRepository.merge(task, dto);
    return this.tasksRepository.save(task);
  }

  async remove(id: string): Promise<void> {
    const task = await this.findOne(id);
    await this.tasksRepository.remove(task);
  }
}
