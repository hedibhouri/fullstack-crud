---
paths:
  - 'apps/api/src/database/**'
  - 'apps/api/src/**/*.entity.ts'
---

# Database rules

- Schema changes ship as a **new migration** in `apps/api/src/database/migrations/` named `<timestamp>-<PascalCaseName>.ts`. Never edit a committed migration.
- Every migration has a working `down()` that exactly reverses `up()`.
- Entity and migration must agree (types, lengths, nullability, defaults, indexes). Prefer `npm run migration:generate -w @app/api -- src/database/migrations/<Name>` against a DB running the previous schema, then review the generated SQL.
- Tables and columns are `snake_case` and plural table names (`tasks`). Use UUID primary keys and `timestamptz` timestamps via `BaseEntity`.
- Add indexes for columns used in `WHERE`/`ORDER BY`. Add FK constraints with explicit `onDelete` behaviour.
- `synchronize` must stay `false` in every environment.
- Destructive changes (drop/rename column) need a two-step, backwards-compatible rollout. Flag this to the user.
