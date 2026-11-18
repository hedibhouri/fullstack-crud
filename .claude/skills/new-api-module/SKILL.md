---
name: new-api-module
description: Scaffold a complete NestJS feature module (entity, migration, DTOs, service, controller, module, unit + e2e tests) in apps/api by mirroring the tasks reference module. Use when the user asks to add a new resource/domain/CRUD to the backend.
---

# New API module

Argument: the feature name (singular), e.g. `project`. Plural = `projects`.

## Steps

1. **Clarify the fields** (name, type, required, constraints) if the user did not give them. Do not guess business rules.
2. **Read the reference:** every file in `apps/api/src/modules/tasks/` and `apps/api/test/tasks.e2e-spec.ts`.
3. **Create** `apps/api/src/modules/<plural>/` mirroring tasks one-for-one:
   - `entities/<singular>.entity.ts` (`@Entity({ name: '<plural>' })`, extends `BaseEntity`)
   - `enums/` only if needed
   - `dto/create-<singular>.dto.ts`, `dto/update-<singular>.dto.ts` (`PartialType`), `dto/query-<singular>.dto.ts` (extends `PaginationQueryDto`), `dto/<singular>-response.dto.ts`, `dto/index.ts`
   - `<plural>.service.ts`, `<plural>.controller.ts` (`version: '1'`), `<plural>.module.ts`
   - `<plural>.service.spec.ts`, `<plural>.controller.spec.ts`
4. **Register** the module in `apps/api/src/app.module.ts` under `// ─── Features`.
5. **Migration:** create `apps/api/src/database/migrations/<Date.now()>-Create<Plural>.ts` with `up()` and `down()` matching the entity exactly (see `/db-migration`).
6. **E2E:** add `apps/api/test/<plural>.e2e-spec.ts` plus an in-memory repository in `test/utils/` (or generalise the existing one) covering create/list/get/update/delete, 400 validation, 400 bad UUID and 404.
7. **Verify:**
   ```bash
   npm run lint -w @app/api && npm run typecheck -w @app/api && npm test -w @app/api && npm run test:e2e -w @app/api && npm run build -w @app/api
   ```
8. Suggest running `/new-web-feature <singular>` to build the UI on top.
