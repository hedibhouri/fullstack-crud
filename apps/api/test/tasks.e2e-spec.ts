import type { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import request from 'supertest';
import type { App } from 'supertest/types';
import { setupApp } from '../src/app.setup';
import { appConfig } from '../src/config/app.config';
import { Task } from '../src/modules/tasks/entities/task.entity';
import { TasksModule } from '../src/modules/tasks/tasks.module';
import { InMemoryTaskRepository } from './utils/in-memory-task.repository';

describe('Tasks (e2e)', () => {
  let app: INestApplication<App>;
  const repository = new InMemoryTaskRepository();

  beforeAll(async () => {
    process.env.SWAGGER_ENABLED = 'false';

    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, ignoreEnvFile: true, load: [appConfig] }),
        TasksModule,
      ],
    })
      .overrideProvider(getRepositoryToken(Task))
      .useValue(repository)
      .compile();

    app = moduleRef.createNestApplication();
    setupApp(app);
    await app.init();
  });

  afterEach(() => repository.clear());
  afterAll(() => app.close());

  it('POST /api/v1/tasks creates a task', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/tasks')
      .send({ title: '  Write tests  ' })
      .expect(201);

    expect(res.body).toMatchObject({ title: 'Write tests', status: 'todo' });
    expect(res.body.id).toBeDefined();
  });

  it('POST /api/v1/tasks rejects invalid payloads', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/tasks')
      .send({ title: '', unknownField: true })
      .expect(400);

    expect(res.body).toMatchObject({ statusCode: 400, path: '/api/v1/tasks' });
    expect(Array.isArray(res.body.message)).toBe(true);
  });

  it('GET /api/v1/tasks returns a paginated list', async () => {
    await request(app.getHttpServer()).post('/api/v1/tasks').send({ title: 'A' });
    await request(app.getHttpServer()).post('/api/v1/tasks').send({ title: 'B' });

    const res = await request(app.getHttpServer()).get('/api/v1/tasks?page=1&limit=1').expect(200);

    expect(res.body.data).toHaveLength(1);
    expect(res.body.meta).toEqual({ page: 1, limit: 1, total: 2, totalPages: 2 });
  });

  it('GET /api/v1/tasks/:id validates the UUID', () =>
    request(app.getHttpServer()).get('/api/v1/tasks/not-a-uuid').expect(400));

  it('GET /api/v1/tasks/:id returns 404 for unknown ids', () =>
    request(app.getHttpServer())
      .get('/api/v1/tasks/9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d')
      .expect(404));

  it('PATCH then DELETE a task', async () => {
    const created = await request(app.getHttpServer())
      .post('/api/v1/tasks')
      .send({ title: 'Edit me' });
    const id = created.body.id as string;

    const updated = await request(app.getHttpServer())
      .patch(`/api/v1/tasks/${id}`)
      .send({ status: 'done' })
      .expect(200);
    expect(updated.body.status).toBe('done');

    await request(app.getHttpServer()).delete(`/api/v1/tasks/${id}`).expect(204);
    await request(app.getHttpServer()).get(`/api/v1/tasks/${id}`).expect(404);
  });
});
