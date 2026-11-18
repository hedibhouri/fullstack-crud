import { Transform } from 'class-transformer';
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { TaskStatus } from '../enums/task-status.enum';

const trim = ({ value }: { value: unknown }): unknown =>
  typeof value === 'string' ? value.trim() : value;

export class CreateTaskDto {
  /**
   * Short, human readable title
   * @example "Write the README"
   */
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  title: string;

  /**
   * Optional longer description
   * @example "Cover setup, scripts and architecture"
   */
  @Transform(trim)
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string | null;

  /** Workflow status */
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  /**
   * Due date (ISO 8601, date only)
   * @example "2026-12-31"
   */
  @IsOptional()
  @IsDateString({ strict: true })
  dueDate?: string | null;
}
