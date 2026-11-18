---
name: db-migration
description: Create, generate, review, run or revert a TypeORM migration for apps/api safely. Use whenever an entity changes or the user asks for a schema/database change, migration, or rollback.
---

# Database migration

Read `.claude/rules/database.md` first.

## Create

1. Update the entity (`apps/api/src/modules/<f>/entities/*.entity.ts`).
2. Choose a method:
   - **Generate (preferred when Docker is available):**
     ```bash
     npm run db:up
     npm run migration:run -w @app/api          # bring DB to the previous schema
     npm run migration:generate -w @app/api -- src/database/migrations/<PascalCaseName>
     ```
     Review the generated SQL: rename constraints/indexes to the `PK_/IDX_/FK_<table>_<col>` convention, and remove noise.
   - **Hand-write:** `apps/api/src/database/migrations/<Date.now()>-<PascalCaseName>.ts`, class `<PascalCaseName><timestamp>`, mirroring `1763500000000-CreateTasks.ts`.
3. Make sure `down()` exactly reverses `up()` in reverse order.

## Verify

```bash
npm run migration:run -w @app/api
npm run migration:revert -w @app/api
npm run migration:run -w @app/api
npm run typecheck -w @app/api && npm test -w @app/api
```

## Rules

- Never edit a committed migration. Never set `synchronize: true`.
- Warn the user about destructive operations (drop/rename/type change) and propose an expand → migrate → contract rollout.
- Production runs migrations automatically on API start (`DB_RUN_MIGRATIONS=true`), or manually with `npm run migration:run:prod -w @app/api` against `dist`.
