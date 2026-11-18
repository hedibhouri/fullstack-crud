# API rules (NestJS)

The reference implementation is `src/modules/tasks/`. Mirror it.

## Module anatomy

```
src/modules/<feature>/
├── dto/                 create-<x>.dto.ts, update-<x>.dto.ts (PartialType), query-<x>.dto.ts,
│                        <x>-response.dto.ts (Swagger), index.ts (barrel)
├── entities/<x>.entity.ts   extends common/entities/BaseEntity
├── enums/<x>-status.enum.ts
├── <feature>.controller.ts
├── <feature>.service.ts
├── <feature>.module.ts      TypeOrmModule.forFeature([...]), exports the service
├── <feature>.service.spec.ts
└── <feature>.controller.spec.ts
```

Register the module in `src/app.module.ts` under the `Features` section.

## Rules

- **Controllers:** use `@Controller({ path: '<plural>', version: '1' })` and `@ApiTags`. Validate
  ids with `ParseUUIDPipe`. Use `@HttpCode(204)` on deletes. Add Swagger response decorators.
  No business logic and no repository access.
- **Services:** inject repositories with `@InjectRepository`. Throw Nest HTTP exceptions
  (`NotFoundException`, `ConflictException`, …), never raw `Error`s, for expected failures.
  Return entities or `PaginatedResponseDto`.
- **DTOs:** every property has class-validator decorators. Trim strings with `@Transform`.
  Optional fields get `@IsOptional()`. Query DTOs for lists extend `PaginationQueryDto`. The
  global `ValidationPipe` runs with `whitelist` + `forbidNonWhitelisted`, so unknown fields are
  rejected.
- **Entities:** explicit column `type`, `snake_case` column `name`s, nullable fields typed
  `T | null`, indexes on filtered or sorted columns. Keep the entity in sync with its migration.
- **Imports:** use relative paths (no TS path aliases, because there's no runtime rewriting).
  Keep value imports (not `import type`) for anything used in constructor injection or as a
  decorated parameter type, because decorator metadata needs them at runtime.
- **Config:** read config with
  `ConfigService.getOrThrow<XConfig>('<namespace>')`, never `process.env` directly (except in
  `src/config/*`). New variables need the Joi schema, the namespace file and `.env.example`.
- **Errors:** `AllExceptionsFilter` shapes every error as
  `{ statusCode, error, message, path, timestamp }`. Don't build custom error bodies in
  controllers.
- **Logging:** inject `Logger` from `@nestjs/common`
  (`private readonly logger = new Logger(X.name)`). Never use `console.log`. Never log secrets
  or personal data.
- **Global pipeline:** everything global (pipes, filters, middleware, Swagger) belongs in
  `src/app.setup.ts`, so e2e tests run the same pipeline.

## Testing

- Unit: `Test.createTestingModule` with mocked repositories (`getRepositoryToken(Entity)`).
- E2E: `test/*.e2e-spec.ts` boots the feature module plus `setupApp()` with the repository
  overridden by an in-memory fake (see `test/utils/in-memory-task.repository.ts`), so no DB is
  needed.
- Cover the happy path, validation failure (400), not found (404) and invalid UUID (400).
