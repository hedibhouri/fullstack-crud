# Full-Stack TypeScript CRUD — Vue 3 + NestJS

A simple **Tasks** CRUD app with a production-ready setup: npm-workspaces monorepo,
strict TypeScript, validated config, migrations, security middleware, structured logging,
tests, linting, Docker and CI.

> The step-by-step build plan and architecture decisions are in [PLAN.md](PLAN.md).

## Stack

| Layer    | Tech                                                                       |
| -------- | -------------------------------------------------------------------------- |
| Frontend | Vue 3 (`<script setup>`), Vite, Pinia, Vue Router, Axios, Vitest           |
| Backend  | NestJS 11, TypeORM, PostgreSQL, class-validator, Swagger, Pino, Terminus   |
| Tooling  | TypeScript, ESLint 9 (flat), Prettier, Husky + lint-staged, GitHub Actions |
| Runtime  | Docker multi-stage images, nginx, docker compose                           |

## Prerequisites

- Node.js ≥ 22 (`nvm use`), npm ≥ 10
- Docker Desktop

## Quick start

### Option A: Everything in Docker (production-like)

```bash
docker compose up -d --build
```

| URL                              | What            |
| -------------------------------- | --------------- |
| http://localhost:8080            | Web app (nginx) |
| http://localhost:3000/api/docs   | Swagger UI      |
| http://localhost:3000/api/health | Health check    |

### Option B: Local development (hot reload)

```bash
npm install
cp apps/api/.env.example apps/api/.env     # first time only
cp apps/web/.env.example apps/web/.env     # first time only
npm run db:up                              # PostgreSQL in Docker
npm run dev                                # API :3000 + Web :5173
```

Open http://localhost:5173. Vite proxies `/api` to the API. Migrations run automatically on API start.

## Scripts (root)

| Script                   | Description                           |
| ------------------------ | ------------------------------------- |
| `npm run dev`            | Run API and web in watch mode         |
| `npm run build`          | Production build of both apps         |
| `npm run lint`           | ESLint on both apps                   |
| `npm run typecheck`      | `tsc` / `vue-tsc` type checking       |
| `npm test`               | Unit tests (Jest + Vitest)            |
| `npm run test:e2e`       | API end-to-end tests (no DB required) |
| `npm run format`         | Prettier write                        |
| `npm run docker:up/down` | Start / stop the full Docker stack    |

Database migrations (run inside `apps/api`):

```bash
npm run migration:generate -w @app/api -- src/database/migrations/<Name>
npm run migration:run -w @app/api
npm run migration:revert -w @app/api
```

## Project structure

```
apps/
├── api/src/
│   ├── config/        # typed config namespaces + Joi env validation
│   ├── common/        # filters, base entity, shared DTOs, constants
│   ├── database/      # TypeORM module, CLI data-source, migrations
│   ├── modules/       # feature modules (tasks, health)
│   ├── app.module.ts  # composition root
│   ├── app.setup.ts   # global pipes/filters/middleware (shared with e2e)
│   └── main.ts        # bootstrap
└── web/src/
    ├── assets/styles/ # global CSS + design tokens (light/dark)
    ├── components/    # shared UI (ui/) and layout components
    ├── composables/   # reusable composition functions
    ├── config/        # typed env access
    ├── features/      # feature slices: api/, components/, stores/, types/, views/
    ├── layouts/       # app shells
    ├── router/        # router + route aggregation
    ├── services/http/ # axios client + ApiError normalisation
    ├── types/         # shared types
    └── views/         # app-level views (404)
```

## API

Base path `/api/v1`. Full interactive docs are at `/api/docs`.

| Method | Path         | Description                                          |
| ------ | ------------ | ---------------------------------------------------- |
| GET    | `/tasks`     | Paginated list (`page`, `limit`, `status`, `search`) |
| GET    | `/tasks/:id` | Get one                                              |
| POST   | `/tasks`     | Create                                               |
| PATCH  | `/tasks/:id` | Update                                               |
| DELETE | `/tasks/:id` | Delete                                               |

## Environment variables

Each variable is documented in [apps/api/.env.example](apps/api/.env.example) and
[apps/web/.env.example](apps/web/.env.example). The API validates its environment at startup and
refuses to boot if the configuration is invalid.

## Claude Code setup

The repo ships with an AI-assistant setup so Claude Code follows the project's patterns:

| Path                                      | Purpose                                                                                                                   |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `CLAUDE.md`, `apps/*/CLAUDE.md`           | Principles, commands, architecture and Definition of Done                                                                 |
| `.claude/rules/*.md`                      | Path-scoped rules: testing, security, database, infrastructure                                                            |
| `.claude/agents/*.md`                     | Specialist subagents (backend, frontend, tests, review, security, DB, DevOps)                                             |
| `.claude/skills/*/SKILL.md`               | Workflows: `/new-api-module`, `/new-web-feature`, `/add-endpoint`, `/db-migration`, `/verify`, `/commit`, `/docker-stack` |
| `.claude/settings.json` + `.claude/hooks` | Permissions, auto-formatting, protection for `.env`/lockfile/committed migrations                                         |

Example: `/new-api-module project`, then `/new-web-feature project`, then `/verify`, then `/commit`.

## Port conflicts

If 8080, 3000 or 5432 is taken on your machine, override the host ports:

```bash
WEB_PORT=8081 API_PORT=3001 DB_HOST_PORT=5433 docker compose up -d
```

## Git hooks

Husky runs `lint-staged` on `pre-commit`. It lints and formats only the staged files, so bad code
can't be committed. Hooks are installed automatically by `npm install` (the `prepare` script).
