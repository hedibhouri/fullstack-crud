# 16 — Building a production-ready project from zero

This is the **recipe** used to create this repository, in order. Follow it to build your own
project from an empty folder. Each phase ends with something working and verifiable — never
build ten things and test at the end.

> The original phased plan is in [`PLAN.md`](../PLAN.md). Writing a plan like that **before**
> coding is itself step 0 of a professional project.

## Phase 0 — Decide before you code

Write down (in a `PLAN.md` or design doc):

- **What** you're building and the first use case (here: Tasks CRUD).
- **Stack** and why (see [01-overview](01-overview.md)).
- **Repo layout** (monorepo? where do apps live?).
- **API contract** draft: resources, endpoints, payloads, errors.
- **Non-functional requirements**: validation, security, logging, tests, deployment target.

Install prerequisites: Node LTS (+ `nvm`), Git, Docker Desktop, VS Code.

## Phase 1 — Repository foundation

```bash
mkdir my-app && cd my-app
git init -b main
npm init -y
```

1. Root `package.json`: `"private": true`, `"workspaces": ["apps/*"]`, `engines`.
2. `.gitignore` (node_modules, dist, coverage, `.env*` except `.env.example`), `.gitattributes`
   (`* text=auto eol=lf`), `.editorconfig`, `.nvmrc`.
3. Prettier: `npm i -D prettier`, `.prettierrc.json`, `.prettierignore`, scripts `format` and
   `format:check`.
4. Git hooks: `npm i -D husky lint-staged && npx husky init`; put `npx lint-staged` in
   `.husky/pre-commit`.
5. First commit: `chore: initial repository setup`.

✅ Check: `npm run format:check` works.

## Phase 2 — Backend skeleton

```bash
mkdir -p apps/api && cd apps/api
npm init -y   # name "@app/api"
npm i @nestjs/common @nestjs/core @nestjs/platform-express reflect-metadata rxjs
npm i -D @nestjs/cli @nestjs/schematics @nestjs/testing typescript @types/node ts-node jest ts-jest @types/jest supertest @types/supertest
```

(Or `npx @nestjs/cli new api --skip-git` and then restructure.)

1. `tsconfig.json` (strict, decorators), `tsconfig.build.json`, `nest-cli.json`.
2. `src/main.ts`, `src/app.module.ts`, `src/app.setup.ts`.
3. ESLint flat config with `typescript-eslint` type-checked rules + Prettier plugin.
4. Scripts: `build`, `start:dev`, `start:prod`, `lint`, `typecheck`, `test`, `test:e2e`.

✅ Check: `npm run start:dev -w @app/api` boots.

## Phase 3 — Configuration

1. `npm i @nestjs/config joi`.
2. `src/config/env.validation.ts` (Joi), `app.config.ts`, `database.config.ts` (`registerAs`).
3. `ConfigModule.forRoot({ isGlobal, cache, load, validationSchema })`.
4. `.env.example` documenting every variable; local `.env` git-ignored.

✅ Check: deleting `DB_HOST` from `.env` makes the app refuse to start with a clear message.

## Phase 4 — Database

1. `docker-compose.yml` with just the `db` service (Postgres + healthcheck + volume);
   `npm run db:up` script.
2. `npm i @nestjs/typeorm typeorm pg`.
3. `src/database/typeorm.options.ts` (shared options, `synchronize: false`),
   `database.module.ts`, `data-source.ts` for the CLI; migration scripts.
4. `common/entities/base.entity.ts`.

✅ Check: the app connects; `npm run migration:run -w @app/api` runs (nothing to do yet).

## Phase 5 — First feature (the reference implementation)

1. Entity + enum → generate the first migration → review → run/revert/run.
2. DTOs with class-validator (`npm i class-validator class-transformer`), shared pagination DTOs.
3. Service → controller → module → register in `AppModule`.
4. Global `ValidationPipe` in `app.setup.ts`.

✅ Check: CRUD works with `curl`.

Invest in making this first feature exemplary — **every future feature will be copied from it**.

## Phase 6 — Cross-cutting concerns

Add one at a time, verifying each:

1. Global exception filter (consistent error JSON).
2. `helmet`, `compression`, CORS allow-list.
3. Rate limiting (`@nestjs/throttler` + `APP_GUARD`).
4. Structured logging (`nestjs-pino`, `pino-http`, `pino-pretty` for dev).
5. Health checks (`@nestjs/terminus`).
6. Swagger (`@nestjs/swagger` + CLI plugin in `nest-cli.json`).
7. URI versioning + global prefix.
8. Graceful shutdown (`enableShutdownHooks`).

✅ Check: `/api/health`, `/api/docs`, an invalid request returns the standard error shape.

## Phase 7 — Backend tests

1. Unit tests for service and controller with mocked dependencies.
2. E2E tests booting the module with `setupApp()` and an in-memory repository.

✅ Check: `npm test -w @app/api && npm run test:e2e -w @app/api`.

## Phase 8 — Frontend skeleton

```bash
cd apps && npm create vue@latest web   # TypeScript, Router, Pinia, Vitest, ESLint, Prettier
```

Then align it with the monorepo: rename to `@app/web`, remove its own Prettier config (root one
wins), configure the `@` alias and the **dev proxy** `/api → :3000` in `vite.config.ts`,
`env.d.ts` + `src/config/env.ts`.

✅ Check: `npm run dev -w @app/web` shows the page.

## Phase 9 — Frontend core

1. Design tokens and base CSS (light/dark).
2. HTTP layer: axios instance + interceptors + `ApiError`.
3. Router with lazy routes, 404, titles.
4. Layout + header.
5. Base UI components (button, inputs, alert, spinner, pagination).

## Phase 10 — Frontend feature slice

`types` → `api` → `store` → components → views → `routes.ts` → register routes. Handle loading,
empty, error and success states. Then Vitest specs for the form, badge and store.

✅ Check: full CRUD through the UI with `npm run dev`.

## Phase 11 — Containerise

1. API multi-stage Dockerfile (deps → build → prod deps → slim non-root runtime + healthcheck).
2. Web Dockerfile (Vite build → nginx) + `nginx.conf` (SPA fallback, caching, `/api` proxy,
   security headers).
3. Root `.dockerignore`. Add `api` and `web` services to compose with `depends_on: service_healthy`.

✅ Check: `docker compose up -d --build` → full smoke test on :8080.

## Phase 12 — Continuous Integration

`.github/workflows/ci.yml` running format check, lint, typecheck, tests, e2e, build, then Docker
builds. Push to GitHub, enable branch protection.

✅ Check: green pipeline on GitHub.

## Phase 13 — Documentation

`README.md` (quick start), `docs/` (this folder), `CLAUDE.md` / contribution rules.

## Phase 14 — AI guardrails (optional but powerful)

`CLAUDE.md`, `.claude/rules`, agents, skills, hooks — so AI assistants follow the same standards
(see [17-claude-code](17-claude-code.md)).

## The mindset

1. **Make it work, make it right, make it observable** — then add features.
2. **Automate every rule** you care about (types, lint, format, tests, CI). Rules that rely on
   memory get broken.
3. **Fail fast and loudly** — validation at every boundary, config validated at boot.
4. **Small, reversible steps** — small commits, migrations with `down()`, versioned APIs,
   immutable images.
5. **One obvious way** — a reference feature everyone copies beats a wiki nobody reads.
