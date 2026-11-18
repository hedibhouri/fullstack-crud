import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { TaskStatus } from '../enums/task-status.enum';

export class QueryTaskDto extends PaginationQueryDto {
  /** Filter by status */
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  /** Case-insensitive search on title */
  @IsOptional()
  @Transform(({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MaxLength(120)
  search?: string;
}
