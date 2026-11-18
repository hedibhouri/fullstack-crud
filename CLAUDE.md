# CLAUDE.md — Project Rules

Full-stack TypeScript CRUD monorepo: **NestJS API** (`apps/api`) + **Vue 3 SPA** (`apps/web`),
PostgreSQL via TypeORM, npm workspaces. The architecture and its rationale are in `PLAN.md`.
App-specific rules live in `apps/api/CLAUDE.md` and `apps/web/CLAUDE.md`, and topic rules
in `.claude/rules/`.

## Commands (run from repo root)

| Task              | Command                                     |
| ----------------- | ------------------------------------------- |
| Dev (API + web)   | `npm run db:up && npm run dev`              |
| Lint / fix        | `npm run lint` · `npm run lint:fix -w <ws>` |
| Typecheck         | `npm run typecheck`                         |
| Unit tests        | `npm test`                                  |
| API e2e tests     | `npm run test:e2e`                          |
| Build             | `npm run build`                             |
| Format            | `npm run format`                            |
| Full Docker stack | `npm run docker:up` → http://localhost:8080 |

Workspaces: `@app/api`, `@app/web`. To target one, use `-w @app/api`, for example
`npm test -w @app/web`.

## Non-negotiable principles

1. **Follow existing patterns first.** Before creating anything, find the closest existing
   example (the `tasks` feature is the reference implementation) and mirror its structure,
   naming and style. Do not invent a new pattern when one exists.
2. **Feature-first organisation.** Backend code goes in `apps/api/src/modules/<feature>/` and
   frontend code in `apps/web/src/features/<feature>/`. Shared code is promoted to `common/`
   (API) or `components/`, `services/`, `types/`, `composables/` (web) only after a second
   feature needs it.
3. **Strict TypeScript.** No `any` (use `unknown` and narrow it), no `@ts-ignore`, no non-null
   `!` in production code, explicit return types on exported functions and methods.
4. **Single responsibility and thin layers.** Controllers only translate HTTP, services hold
   business logic, repositories handle persistence. Views orchestrate, components present,
   stores own state, and `api/` modules perform HTTP calls.
5. **Validate at the boundaries.** Every API input goes through a DTO with class-validator
   decorators. All config goes through the Joi schema in `apps/api/src/config/env.validation.ts`.
6. **The database schema changes only through migrations.** `synchronize` stays `false`. Never
   edit a migration that has already been committed; add a new one instead.
7. **Tests come with every change.** New service logic needs unit tests. New endpoints need e2e
   coverage in `apps/api/test`. New components, stores and composables need Vitest specs.
8. **No secrets in code.** Configuration comes from env vars. Every new variable must be added
   to the relevant `.env.example` **and** the validation schema.
9. **Keep the API contract in sync.** If an API DTO or response changes, update the matching
   types in `apps/web/src/features/<feature>/types/` in the same change.
10. **Small, focused changes.** Don't refactor unrelated code or add speculative abstractions,
    and don't reformat by hand (Prettier and the hooks handle formatting).

## Definition of done

A change is done only when all of these pass:

```bash
npm run lint && npm run typecheck && npm test && npm run test:e2e && npm run build
```

The `/verify` skill runs this gate. Report failures honestly, with the output.

## Naming conventions

- TS files: kebab-case with a role suffix: `tasks.service.ts`, `create-task.dto.ts`,
  `task.entity.ts`, `tasks.store.ts`, `tasks.api.ts`, `task.types.ts`.
- Vue SFCs: PascalCase and multi-word: `TaskForm.vue`. Shared primitives are prefixed `Base*`
  and views are suffixed `*View`.
- Classes and types use PascalCase, variables and functions camelCase, constants
  `UPPER_SNAKE_CASE`, DB tables and columns `snake_case`.
- Routes are named `<feature>.<action>`, for example `tasks.edit`.

## Git

- Conventional Commits: `feat(api): add projects module`, `fix(web): …`, `chore: …`.
- Commit or push only when asked. Never commit `.env` files or skip hooks (`--no-verify`).

## Available Claude tooling

- **Skills:** `/new-api-module`, `/new-web-feature`, `/add-endpoint`, `/db-migration`,
  `/verify`, `/commit`, `/docker-stack`.
- **Agents:** `backend-engineer`, `frontend-engineer`, `test-engineer`, `code-reviewer`,
  `security-auditor`, `db-specialist`, `devops-engineer`.
