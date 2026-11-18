import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { TaskStatus } from '../enums/task-status.enum';

@Entity({ name: 'tasks' })
export class Task extends BaseEntity {
  @Column({ type: 'varchar', length: 120 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Index('IDX_tasks_status')
  @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.Todo })
  status: TaskStatus;

  @Column({ name: 'due_date', type: 'date', nullable: true })
  dueDate: string | null;
}
