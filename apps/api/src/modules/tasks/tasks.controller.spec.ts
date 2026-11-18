import { Test } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

describe('TasksController', () => {
  let controller: TasksController;
  const service = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    const moduleRef = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [{ provide: TasksService, useValue: service }],
    }).compile();

    controller = moduleRef.get(TasksController);
  });

  it('delegates findAll to the service', async () => {
    service.findAll.mockResolvedValue({ data: [], meta: {} });
    const query = { page: 1, limit: 10 };
    await controller.findAll(query);
    expect(service.findAll).toHaveBeenCalledWith(query);
  });

  it('delegates create to the service', async () => {
    const dto = { title: 'New' };
    await controller.create(dto);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('delegates update to the service', async () => {
    await controller.update('id', { title: 'Changed' });
    expect(service.update).toHaveBeenCalledWith('id', { title: 'Changed' });
  });

  it('delegates remove to the service', async () => {
    await controller.remove('id');
    expect(service.remove).toHaveBeenCalledWith('id');
  });
});
