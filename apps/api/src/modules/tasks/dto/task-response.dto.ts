import { ApiProperty } from '@nestjs/swagger';
import { PaginationMetaDto } from '../../../common/dto/paginated-response.dto';
import { TaskStatus } from '../enums/task-status.enum';

/** Swagger representation of a Task returned by the API. */
export class TaskResponseDto {
  @ApiProperty({ format: 'uuid' }) id: string;
  @ApiProperty() title: string;
  @ApiProperty({ type: String, nullable: true }) description: string | null;
  @ApiProperty({ enum: TaskStatus }) status: TaskStatus;
  @ApiProperty({ type: String, format: 'date', nullable: true }) dueDate: string | null;
  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;
}

export class PaginatedTasksResponseDto {
  @ApiProperty({ type: [TaskResponseDto] }) data: TaskResponseDto[];
  @ApiProperty({ type: PaginationMetaDto }) meta: PaginationMetaDto;
}
