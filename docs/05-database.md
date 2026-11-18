# 05 — Database (PostgreSQL + TypeORM)

## 1. PostgreSQL

PostgreSQL is a **relational database**: data lives in tables with typed columns, and SQL is
used to query it. It guarantees **ACID** transactions (Atomic, Consistent, Isolated, Durable) —
your data is never left half-written.

Locally it runs in Docker (`npm run db:up` → `postgres:16-alpine` on port 5432). Data persists in
a named Docker volume `db-data`, so it survives container restarts.

Connect manually to look around:

```bash
docker compose exec db psql -U postgres -d app
\dt                       -- list tables
\d tasks                  -- describe the tasks table
SELECT * FROM migrations; -- applied migrations
```

## 2. The `tasks` table

| Column        | Type                     | Notes                                             |
| ------------- | ------------------------ | ------------------------------------------------- |
| `id`          | `uuid` PK                | default `gen_random_uuid()`                       |
| `created_at`  | `timestamptz`            | default `now()`                                   |
| `updated_at`  | `timestamptz`            | default `now()`, updated by TypeORM on save       |
| `title`       | `varchar(120)` NOT NULL  |                                                   |
| `description` | `text` NULL              |                                                   |
| `status`      | enum `tasks_status_enum` | `todo` \| `in_progress` \| `done`, default `todo` |
| `due_date`    | `date` NULL              | date only, no time                                |

Indexes: `IDX_tasks_status` (filtering) and `IDX_tasks_created_at` (sorting).

Design choices:

- **UUID primary keys** — not guessable (`/tasks/5` → `/tasks/6` enumeration impossible), can be
  generated client-side, safe to merge across databases.
- **`timestamptz`** — stores an absolute instant (UTC internally). Plain `timestamp` loses timezone
  information and causes bugs.
- **Postgres enum** for status — the DB itself rejects invalid values.
- **snake_case columns** — the SQL convention; TypeScript keeps camelCase via `name:` mapping.
- **Indexes** on columns used in `WHERE` and `ORDER BY` keep queries fast as the table grows.

## 3. TypeORM: the ORM

An **ORM** maps classes to tables so you write TypeScript instead of raw SQL for everyday
queries.

### Entities

[`task.entity.ts`](../apps/api/src/modules/tasks/entities/task.entity.ts):

```ts
@Entity({ name: 'tasks' })
export class Task extends BaseEntity {
  @Column({ type: 'varchar', length: 120 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Index('IDX_tasks_status')
  @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.Todo })
  status: TaskStatus;

  @Column({ name: 'due_date', type: 'date', nullable: true })
  dueDate: string | null;
}
```

- Always set the column **`type`** explicitly — never rely on inference.
- Nullable columns are typed `T | null` so TypeScript forces you to handle null.
- `date` columns are returned as `'YYYY-MM-DD'` strings by the `pg` driver, hence `string | null`.

### Repositories

`TypeOrmModule.forFeature([Task])` makes `Repository<Task>` injectable. Common methods:

| Method                                       | SQL equivalent                      |
| -------------------------------------------- | ----------------------------------- |
| `findOneBy({ id })`                          | `SELECT … WHERE id = $1 LIMIT 1`    |
| `findAndCount({ where, skip, take, order })` | `SELECT …` + `SELECT COUNT(*)`      |
| `create(dto)`                                | builds an entity in memory (no SQL) |
| `save(entity)`                               | `INSERT` or `UPDATE`                |
| `merge(entity, dto)`                         | copies fields in memory             |
| `remove(entity)`                             | `DELETE`                            |

Operators like `ILike('%x%')` produce **parameterised** SQL (`WHERE title ILIKE $1`), which is what
prevents SQL injection.

## 4. One source of truth for connection options

[`typeorm.options.ts`](../apps/api/src/database/typeorm.options.ts) builds the options from the
typed `DatabaseConfig`. It is used by:

1. **The app** — [`database.module.ts`](../apps/api/src/database/database.module.ts) via
   `TypeOrmModule.forRootAsync` (+ `autoLoadEntities: true`).
2. **The CLI** — [`data-source.ts`](../apps/api/src/database/data-source.ts), which loads `.env`
   with `dotenv` and exports a `DataSource` for migration commands.

Both use glob paths built with `__dirname`, so they work from `src/*.ts` (dev/CLI) **and**
`dist/*.js` (production).

## 5. Migrations — the most important production habit

`synchronize: true` makes TypeORM alter tables automatically to match entities. It is convenient
and **dangerous**: renaming a property can silently drop a column and its data. In this repo
`synchronize` is **always false**.

Instead, every schema change is a **migration**: a versioned TypeScript file with `up()` (apply)
and `down()` (undo):

```ts
export class CreateTasks1763500000000 implements MigrationInterface {
  public async up(q: QueryRunner): Promise<void> {
    await q.query(`CREATE TYPE "public"."tasks_status_enum" AS ENUM('todo','in_progress','done')`);
    await q.query(`CREATE TABLE "tasks" (...)`);
    await q.query(`CREATE INDEX "IDX_tasks_status" ON "tasks" ("status")`);
  }
  public async down(q: QueryRunner): Promise<void> {
    // exact reverse order
  }
}
```

TypeORM records applied migrations in the `migrations` table, so each runs exactly once per
database.

```mermaid
flowchart LR
    E[Change entity] --> G["Generate or write<br/>migration file"]
    G --> Rv[Review SQL]
    Rv --> Run["migration:run (local)"]
    Run --> Rev["migration:revert → run<br/>(prove down() works)"]
    Rev --> Commit[Commit with the code]
    Commit --> Deploy["Deploy: API runs pending<br/>migrations on boot"]
```

### Commands

```bash
npm run db:up                                   # Postgres must be running
npm run migration:run -w @app/api               # apply pending
npm run migration:revert -w @app/api            # undo the last one
npm run migration:generate -w @app/api -- src/database/migrations/AddPriorityToTasks
npm run migration:create -w @app/api -- src/database/migrations/SeedSomething   # empty file
npm run migration:run:prod -w @app/api          # against compiled dist/ (production)
```

`migration:generate` compares your entities with the live database and writes the SQL diff.
**Always read the generated SQL** before committing.

### How production applies migrations

`DB_RUN_MIGRATIONS=true` sets TypeORM's `migrationsRun`, so the API applies pending migrations at
startup before accepting traffic. With several API replicas, teams often run migrations as a
separate one-off job instead (`migration:run:prod`) and set the flag to `false`.

### Rules

1. Never edit a migration that is already committed/deployed — write a new one. (A Claude hook
   enforces this, see [17-claude-code](17-claude-code.md).)
2. `down()` must exactly reverse `up()`.
3. Destructive changes (drop/rename column) use **expand → migrate → contract**: add the new
   column, deploy code that writes both, backfill, switch reads, and only later drop the old one.
   This avoids downtime and data loss.

## 6. Adding a relation (preview)

When you add, say, `projects` with many tasks:

```ts
@ManyToOne(() => Project, (p) => p.tasks, { onDelete: 'CASCADE' })
@JoinColumn({ name: 'project_id' })
project: Project;
```

…plus a migration adding `project_id uuid REFERENCES projects(id) ON DELETE CASCADE` and an
index on `project_id`. Always decide `onDelete` explicitly.
