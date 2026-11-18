import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';
import {
  CreateTaskDto,
  PaginatedTasksResponseDto,
  QueryTaskDto,
  TaskResponseDto,
  UpdateTaskDto,
} from './dto';
import type { Task } from './entities/task.entity';
import { TasksService } from './tasks.service';

@ApiTags('tasks')
@Controller({ path: 'tasks', version: '1' })
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @ApiOkResponse({ type: PaginatedTasksResponseDto })
  findAll(@Query() query: QueryTaskDto): Promise<PaginatedResponseDto<Task>> {
    return this.tasksService.findAll(query);
  }

  @Get(':id')
  @ApiOkResponse({ type: TaskResponseDto })
  @ApiNotFoundResponse({ description: 'Task not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Task> {
    return this.tasksService.findOne(id);
  }

  @Post()
  @ApiCreatedResponse({ type: TaskResponseDto })
  create(@Body() dto: CreateTaskDto): Promise<Task> {
    return this.tasksService.create(dto);
  }

  @Patch(':id')
  @ApiOkResponse({ type: TaskResponseDto })
  @ApiNotFoundResponse({ description: 'Task not found' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateTaskDto): Promise<Task> {
    return this.tasksService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Task deleted' })
  @ApiNotFoundResponse({ description: 'Task not found' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.tasksService.remove(id);
  }
}
