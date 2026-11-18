# Project Plan — Full-Stack TypeScript CRUD (Vue 3 + NestJS)

A simple **Tasks** CRUD application whose _setup_ is production-ready: strict typing,
layered architecture, validated configuration, security middleware, structured logging,
migrations, tests, linting/formatting, containers and CI.

---

## 1. Tech Stack & Key Decisions

| Concern         | Choice                                                            | Why                                                  |
| --------------- | ----------------------------------------------------------------- | ---------------------------------------------------- |
| Language        | TypeScript (strict) everywhere                                    | One language, end-to-end type safety                 |
| Repo layout     | **npm workspaces monorepo** (`apps/api`, `apps/web`)              | Single install, shared tooling, no extra tool needed |
| Backend         | **NestJS 11** (Express adapter)                                   | Modular, DI, opinionated, enterprise standard        |
| ORM / DB        | **TypeORM 0.3** + **PostgreSQL 16**                               | First-class Nest integration, migrations             |
| Config          | `@nestjs/config` + **Joi** schema validation                      | App fails fast on invalid/missing env                |
| Validation      | `class-validator` / `class-transformer` + global `ValidationPipe` | DTO-driven validation and whitelisting               |
| API docs        | `@nestjs/swagger` (OpenAPI) at `/api/docs`                        | Self-documenting API                                 |
| Security        | `helmet`, CORS allow-list, `@nestjs/throttler`, `compression`     | Sensible production defaults                         |
| Logging         | `nestjs-pino` (JSON in prod, pretty in dev)                       | Structured, fast, request-scoped logs                |
| Health          | `@nestjs/terminus` (`/api/health`)                                | Liveness/readiness for orchestrators                 |
| Backend tests   | Jest (unit) + Supertest (e2e)                                     | Nest default tooling                                 |
| Frontend        | **Vue 3.5** (Composition API, `<script setup>`) + **Vite 7**      | Modern, fast, recommended Vue setup                  |
| State / routing | **Pinia** + **Vue Router 4**                                      | Official Vue libraries                               |
| HTTP            | Axios instance with interceptors + typed API modules              | Central error handling, single base URL              |
| Frontend tests  | Vitest + @vue/test-utils + jsdom                                  | Vite-native testing                                  |
| Lint / format   | ESLint 9 flat config + typescript-eslint + Prettier 3             | Consistent style, catch bugs early                   |
| Git hooks       | Husky + lint-staged                                               | Lint/format staged files before commit               |
| Containers      | Multi-stage Dockerfiles, Nginx for the SPA, docker-compose        | Small images, reproducible environment               |
| CI              | GitHub Actions (lint → typecheck → test → build)                  | Quality gate on every push/PR                        |

---

## 2. Target Folder Structure

```
.
├── .github/workflows/ci.yml          # CI pipeline
├── .husky/pre-commit                 # runs lint-staged
├── apps/
│   ├── api/                          # NestJS backend
│   │   ├── src/
│   │   │   ├── main.ts               # bootstrap (thin)
│   │   │   ├── app.module.ts         # root module (composition only)
│   │   │   ├── app.setup.ts          # global pipes/filters/middleware (reused by e2e)
│   │   │   ├── config/               # typed, validated configuration namespaces
│   │   │   ├── common/               # cross-cutting: filters, dto, entities, constants
│   │   │   ├── database/             # TypeORM module, CLI data-source, migrations
│   │   │   └── modules/              # feature modules (one folder per domain)
│   │   │       ├── health/
│   │   │       └── tasks/
│   │   │           ├── dto/
│   │   │           ├── entities/
│   │   │           ├── enums/
│   │   │           ├── tasks.controller.ts
│   │   │           ├── tasks.service.ts
│   │   │           ├── tasks.module.ts
│   │   │           └── *.spec.ts     # co-located unit tests
│   │   ├── test/                     # e2e tests
│   │   ├── Dockerfile
│   │   └── .env.example
│   └── web/                          # Vue 3 frontend
│       ├── src/
│       │   ├── main.ts / App.vue
│       │   ├── assets/styles/        # global CSS + design tokens
│       │   ├── config/               # typed env access
│       │   ├── router/               # router instance + route aggregation
│       │   ├── services/http/        # axios client + error normalisation
│       │   ├── layouts/              # app shells
│       │   ├── components/           # shared, feature-agnostic UI (ui/, layout/)
│       │   ├── types/                # shared types (pagination, api errors)
│       │   ├── views/                # app-level views (NotFound)
│       │   └── features/             # feature slices (one folder per domain)
│       │       └── tasks/
│       │           ├── api/          # typed endpoint calls
│       │           ├── components/
│       │           ├── stores/       # Pinia store
│       │           ├── types/
│       │           ├── views/
│       │           ├── __tests__/
│       │           └── routes.ts
│       ├── nginx.conf
│       ├── Dockerfile
│       └── .env.example
├── docker-compose.yml                # db + api + web
├── package.json                      # workspaces + orchestration scripts
├── .editorconfig / .prettierrc.json / .gitignore / .nvmrc
├── PLAN.md
└── README.md
```

**Architecture principles**

- **Backend — modular, layered:** Controller (HTTP only) → Service (business logic) → Repository (TypeORM).
  DTOs define the API contract; entities define persistence. Each domain is a self-contained Nest module.
- **Frontend — feature-sliced:** everything for a domain lives in `features/<domain>`; shared,
  reusable pieces live in `components/`, `services/`, `types/`. Views orchestrate; components are
  presentational; stores own state and talk to the `api/` layer; the `api/` layer uses the shared HTTP client.

---

## 3. API Contract (v1)

Base URL: `/api/v1`

| Method | Path          | Description                                           | Body            |
| ------ | ------------- | ----------------------------------------------------- | --------------- |
| GET    | `/tasks`      | List (paginated: `page`, `limit`, `status`, `search`) | –               |
| GET    | `/tasks/:id`  | Get one (UUID)                                        | –               |
| POST   | `/tasks`      | Create                                                | `CreateTaskDto` |
| PATCH  | `/tasks/:id`  | Partial update                                        | `UpdateTaskDto` |
| DELETE | `/tasks/:id`  | Delete (204)                                          | –               |
| GET    | `/api/health` | Health check (DB ping) — unversioned                  | –               |

`Task`: `id (uuid)`, `title (1–120)`, `description? (≤1000)`, `status (todo|in_progress|done)`,
`dueDate? (ISO date)`, `createdAt`, `updatedAt`.

Paginated response: `{ data: T[], meta: { page, limit, total, totalPages } }`.
Error response: `{ statusCode, error, message, path, timestamp }`.

---

## 4. Phases

### Phase 0 — Prerequisites

- Node ≥ 22 (pinned via `.nvmrc`), npm ≥ 10, Docker + Docker Compose.

### Phase 1 — Monorepo foundation

- Root `package.json` with `workspaces: ["apps/*"]` and orchestration scripts
  (`dev`, `build`, `lint`, `typecheck`, `test`, `format`).
- `.editorconfig`, `.gitignore`, `.prettierrc.json`, `.prettierignore`, `.nvmrc`.
- Husky + lint-staged pre-commit hook.

### Phase 2 — Backend scaffold & configuration

- `package.json`, `nest-cli.json`, `tsconfig.json` (strict), `tsconfig.build.json`, `eslint.config.mjs`.
- `config/` namespaces: `app.config.ts`, `database.config.ts`; `env.validation.ts` (Joi).
- `ConfigModule` global, cached, validated at boot. `.env.example` documented.

### Phase 3 — Backend database layer

- `DatabaseModule` using `TypeOrmModule.forRootAsync` fed by typed config.
- `synchronize: false` always; schema owned by **migrations**.
- `data-source.ts` for the TypeORM CLI; scripts `migration:generate|run|revert`.
- `BaseEntity` abstraction (uuid PK, timestamps). Initial migration `CreateTasks`.

### Phase 4 — Backend Tasks feature

- `Task` entity + `TaskStatus` enum.
- DTOs: `CreateTaskDto`, `UpdateTaskDto` (`PartialType`), `QueryTaskDto` (extends `PaginationQueryDto`).
- `TasksService` (CRUD, pagination, filtering, `NotFoundException`).
- `TasksController` with `ParseUUIDPipe`, proper status codes, Swagger decorators.

### Phase 5 — Backend cross-cutting concerns

- `app.setup.ts`: global prefix `api`, URI versioning, `ValidationPipe`
  (`whitelist`, `forbidNonWhitelisted`, `transform`), `helmet`, `compression`, CORS allow-list,
  global `AllExceptionsFilter`, shutdown hooks.
- Throttler guard (global rate limiting).
- `nestjs-pino` logger (redacts auth headers, pretty in dev).
- Swagger UI (disabled in production unless enabled by env).
- Health module with TypeORM ping.

### Phase 6 — Backend tests

- Unit tests for service and controller (mocked repository/service).
- E2E test booting the real app pipeline with a mocked repository (no DB needed in CI).

### Phase 7 — Frontend scaffold & tooling

- Vite + Vue + TS project files: `vite.config.ts`, `vitest.config.ts`, `tsconfig.*` (app/node/vitest
  project references), `env.d.ts`, `eslint.config.ts`, `index.html`.
- `@` alias → `src/`. Dev proxy `/api` → backend.

### Phase 8 — Frontend core

- Typed env (`config/env.ts`), Axios client with interceptors and `ApiError` normalisation.
- Router with lazy-loaded feature routes, title handling, 404 route.
- Pinia setup; `DefaultLayout`, `AppHeader`; base UI components (`BaseButton`, `BaseInput`,
  `BaseSelect`, `BaseTextarea`, `BaseAlert`, `BaseSpinner`, `BasePagination`).
- Global CSS with design tokens (light/dark).

### Phase 9 — Frontend Tasks feature

- `tasks.api.ts`, `task.types.ts`, `useTasksStore` (list/get/create/update/delete, loading & error state).
- Components: `TaskForm`, `TaskList`, `TaskListItem`, `TaskStatusBadge`, `TaskFilters`.
- Views: `TaskListView`, `TaskCreateView`, `TaskEditView`.

### Phase 10 — Frontend tests

- Component tests (`TaskForm` validation/emit, `TaskStatusBadge`) and store tests (mocked API).

### Phase 11 — Containerisation

- `apps/api/Dockerfile`: multi-stage (deps → build → slim runtime, non-root user, healthcheck).
- `apps/web/Dockerfile`: multi-stage (build → `nginx:alpine`), `nginx.conf` with SPA fallback,
  gzip, caching and `/api` reverse proxy.
- `docker-compose.yml`: `db` (Postgres w/ healthcheck + volume), `api` (runs migrations on boot), `web`.
- `.dockerignore` files.

### Phase 12 — CI

- GitHub Actions: install (`npm ci`) → lint → typecheck → test → build for both apps.

### Phase 13 — Documentation & verification

- `README.md`: quick start (local & Docker), scripts, structure, conventions.
- Verify: install, lint, typecheck, unit + e2e tests, production builds for both apps.

---

### Phase 14 — Claude Code ecosystem (AI guardrails)

- `CLAUDE.md` (root) holds the principles, commands and Definition of Done. `apps/api/CLAUDE.md` and
  `apps/web/CLAUDE.md` hold the app-specific patterns.
- `.claude/rules/`: path-scoped rules (testing, security, database, infrastructure).
- `.claude/agents/`: backend-engineer, frontend-engineer, test-engineer, code-reviewer,
  security-auditor, db-specialist, devops-engineer.
- `.claude/skills/`: `/new-api-module`, `/new-web-feature`, `/add-endpoint`, `/db-migration`,
  `/verify`, `/commit`, `/docker-stack`.
- `.claude/settings.json`: permission allow/deny lists, plus hooks that auto-format edited files and
  block edits to `.env` files, the lockfile and committed migrations.

### Phase 15 — Publish

- Initialise git, make a Conventional Commit, create the GitHub repository and push `main`.

## 5. Conventions

- **Files:** kebab-case for TS (`tasks.service.ts`), PascalCase for Vue SFCs (`TaskForm.vue`).
- **Commits:** Conventional Commits (`feat:`, `fix:`, `chore:` …).
- **Env:** never commit `.env`; every variable documented in `.env.example`.
- **Imports:** backend uses relative imports (no runtime path-rewrite needed); frontend uses `@/`.
- **Tests:** unit tests co-located (`*.spec.ts`); backend e2e in `apps/api/test`.
