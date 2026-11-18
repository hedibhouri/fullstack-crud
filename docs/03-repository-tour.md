# 03 — Repository tour

Every folder and file, and why it exists. Generated folders (`node_modules/`, `dist/`,
`coverage/`) are not committed and are omitted.

## Root

```
.
├── .claude/                 Claude Code AI assistant setup → see 17-claude-code.md
├── .github/workflows/ci.yml CI pipeline → see 14-ci-cd.md
├── .husky/pre-commit        Git hook: runs lint-staged before every commit
├── .vscode/                 Recommended editor extensions & settings (shared with the team)
├── apps/
│   ├── api/                 NestJS backend
│   └── web/                 Vue frontend
├── docs/                    You are here
├── .dockerignore            Files excluded from Docker build context
├── .editorconfig            Basic editor settings (indent, line endings) for any editor
├── .gitattributes           Forces LF line endings in Git (avoids Windows CRLF diffs)
├── .gitignore               Files Git must never track (node_modules, dist, .env …)
├── .nvmrc                   Node version (22) — `nvm use` picks it up; CI reads it too
├── .prettierrc.json         Prettier formatting rules
├── .prettierignore          Files Prettier skips
├── CLAUDE.md                Project rules for the AI assistant (also a conventions summary)
├── docker-compose.yml       Runs db + api + web together
├── package.json             Workspaces, root scripts, shared dev tools
├── package-lock.json        Exact dependency versions for reproducible installs
├── PLAN.md                  The phased plan written before building
└── README.md                Quick start
```

### Root `package.json` scripts

| Script                      | What it does                                                     |
| --------------------------- | ---------------------------------------------------------------- |
| `dev`                       | Starts API and web in watch mode in parallel (`concurrently`)    |
| `build`                     | Builds every workspace                                           |
| `lint`, `typecheck`, `test` | Runs the same script in every workspace                          |
| `test:e2e`                  | API end-to-end tests                                             |
| `format` / `format:check`   | Prettier write / verify                                          |
| `db:up` / `db:down`         | Start/stop only the Postgres container (for local dev)           |
| `docker:up` / `docker:down` | Full stack in Docker                                             |
| `prepare`                   | Runs automatically after `npm install`; installs Husky Git hooks |

## Backend — `apps/api`

```
apps/api/
├── src/
│   ├── main.ts                  Entry point: creates the app, applies setup, listens on PORT
│   ├── app.module.ts            Root module: wires infrastructure + feature modules
│   ├── app.setup.ts             Global prefix, versioning, security middleware, pipes, filters, Swagger
│   ├── config/
│   │   ├── env.validation.ts    Joi schema for every environment variable
│   │   ├── app.config.ts        "app" config namespace (port, cors, logging, throttle…)
│   │   ├── database.config.ts   "database" config namespace
│   │   └── index.ts             Barrel export
│   ├── common/                  Code shared by all features
│   │   ├── constants/pagination.constants.ts
│   │   ├── dto/                 PaginationQueryDto, PaginatedResponseDto
│   │   ├── entities/base.entity.ts   id + createdAt + updatedAt for every table
│   │   ├── filters/all-exceptions.filter.ts   Uniform error responses
│   │   └── interfaces/error-response.interface.ts
│   ├── database/
│   │   ├── database.module.ts   Connects TypeORM using config
│   │   ├── typeorm.options.ts   Single source of truth for DB options
│   │   ├── data-source.ts       Used by the TypeORM CLI for migrations
│   │   └── migrations/          Versioned schema changes
│   └── modules/                 Feature modules
│       ├── health/              GET /api/health
│       └── tasks/               The reference CRUD feature
│           ├── dto/             Request/response shapes + validation
│           ├── entities/task.entity.ts
│           ├── enums/task-status.enum.ts
│           ├── tasks.controller.ts
│           ├── tasks.service.ts
│           ├── tasks.module.ts
│           └── *.spec.ts        Unit tests next to the code
├── test/
│   ├── jest-e2e.json            Jest config for e2e tests
│   ├── tasks.e2e-spec.ts        HTTP-level tests
│   └── utils/in-memory-task.repository.ts   Fake DB for e2e tests
├── .env.example                 Documented template of every env var
├── CLAUDE.md                    Backend rules for the AI assistant
├── Dockerfile                   Multi-stage production image
├── eslint.config.mjs            Lint rules (type-aware)
├── nest-cli.json                Nest CLI config (+ Swagger compiler plugin)
├── package.json                 Dependencies, scripts, Jest config, lint-staged rules
├── tsconfig.json                TypeScript config (strict)
└── tsconfig.build.json          Build-only config (excludes tests)
```

## Frontend — `apps/web`

```
apps/web/
├── index.html                   HTML shell; Vite injects the bundle here
├── public/favicon.svg           Copied as-is to the build output
├── src/
│   ├── main.ts                  Creates the Vue app, installs Pinia + router, global error handler
│   ├── App.vue                  Root component: layout + <RouterView/>
│   ├── assets/styles/main.css   Design tokens (CSS variables), light/dark theme, base & form styles
│   ├── components/
│   │   ├── layout/AppHeader.vue
│   │   └── ui/Base*.vue         Reusable primitives: Button, Input, Select, Textarea, Alert, Spinner, Pagination
│   ├── composables/useDebouncedRef.ts   Reusable reactive logic
│   ├── config/env.ts            Typed access to VITE_* variables
│   ├── layouts/DefaultLayout.vue    Page shell (header + main)
│   ├── router/
│   │   ├── index.ts             Router instance, route aggregation, page titles
│   │   └── router.d.ts          Types for route `meta`
│   ├── services/http/
│   │   ├── client.ts            Configured axios instance + interceptors
│   │   ├── api-error.ts         ApiError class: one error type for the whole UI
│   │   └── index.ts
│   ├── types/                   Shared types (pagination, API error body, select options)
│   ├── views/NotFoundView.vue   404 page
│   └── features/tasks/          The reference feature slice
│       ├── api/tasks.api.ts
│       ├── components/          TaskForm, TaskList, TaskListItem, TaskFilters, TaskStatusBadge
│       ├── stores/tasks.store.ts
│       ├── types/task.types.ts
│       ├── views/               TaskListView, TaskCreateView, TaskEditView
│       ├── routes.ts
│       └── __tests__/           Vitest specs
├── .env.example
├── CLAUDE.md
├── Dockerfile                   Build with Node, serve with nginx
├── nginx.conf                   SPA fallback, caching, security headers, /api proxy
├── env.d.ts                     Types for import.meta.env
├── eslint.config.ts
├── tsconfig.json                "Solution" file referencing the three below
├── tsconfig.app.json            App code (browser)
├── tsconfig.node.json           Config files (Node)
├── tsconfig.vitest.json         Test files
├── vite.config.ts               Plugins, `@` alias, dev proxy, build options
└── vitest.config.ts             Test environment (jsdom)
```

## Naming conventions

| Kind                 | Convention                | Example                                |
| -------------------- | ------------------------- | -------------------------------------- |
| TS files             | kebab-case + role suffix  | `create-task.dto.ts`, `tasks.store.ts` |
| Vue components       | PascalCase, multi-word    | `TaskForm.vue`                         |
| Shared UI primitives | `Base` prefix             | `BaseButton.vue`                       |
| Route components     | `View` suffix             | `TaskEditView.vue`                     |
| Classes / types      | PascalCase                | `TasksService`, `TaskStatus`           |
| Constants            | UPPER_SNAKE_CASE          | `MAX_PAGE_LIMIT`                       |
| DB tables / columns  | snake_case, plural tables | `tasks.due_date`                       |
| Route names          | `<feature>.<action>`      | `tasks.edit`                           |

The role suffix tells you what a file is without opening it — a convention Nest and Angular
popularised and many teams adopt.
