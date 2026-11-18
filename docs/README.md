# Documentation

This folder explains **everything in this repository**: what each part does, why it exists, and
how the parts fit together. The goal is to show how a real production system is designed, so you
can build one yourself from zero.

The application itself is intentionally simple (a Tasks CRUD). The value is in the **setup around
it**: architecture, configuration, validation, security, logging, database migrations, tests,
code quality tooling, containers and CI. These are the same things a professional team puts in
place before writing real features.

## Reading order

Read top to bottom the first time. Each document builds on the previous ones.

| #   | Document                                           | What you will learn                                                                |
| --- | -------------------------------------------------- | ---------------------------------------------------------------------------------- |
| 01  | [Overview](01-overview.md)                         | What the project is, the tech stack and why each technology was chosen             |
| 02  | [Architecture](02-architecture.md)                 | The big picture: monorepo, layers, request lifecycle, design principles            |
| 03  | [Repository tour](03-repository-tour.md)           | Every folder and file, and its job                                                 |
| 04  | [Backend (NestJS)](04-backend.md)                  | Modules, dependency injection, controllers, services, DTOs, pipes, filters, guards |
| 05  | [Database](05-database.md)                         | PostgreSQL, TypeORM, entities, repositories, migrations                            |
| 06  | [Frontend (Vue 3)](06-frontend.md)                 | Vite, components, Pinia stores, routing, the HTTP layer, feature slices            |
| 07  | [API reference](07-api-reference.md)               | Every endpoint, request and response, error format, examples                       |
| 08  | [Configuration](08-configuration.md)               | Environment variables, validation, how config flows through the app                |
| 09  | [Security](09-security.md)                         | Every protection in place and what attack it prevents                              |
| 10  | [Observability](10-observability.md)               | Logging, health checks, error handling                                             |
| 11  | [Testing](11-testing.md)                           | Unit, end-to-end and component tests: strategy and how each kind works             |
| 12  | [Code quality tooling](12-code-quality.md)         | TypeScript strict mode, ESLint, Prettier, EditorConfig, Husky, lint-staged         |
| 13  | [Docker & deployment](13-docker.md)                | Dockerfiles line by line, docker compose, nginx                                    |
| 14  | [CI/CD](14-ci-cd.md)                               | The GitHub Actions pipeline and how it protects the main branch                    |
| 15  | [Development workflow](15-development-workflow.md) | Daily commands, Git conventions, adding a new feature end to end                   |
| 16  | [Building from zero](16-building-from-zero.md)     | Step-by-step recipe to recreate this project yourself                              |
| 17  | [Claude Code setup](17-claude-code.md)             | The AI assistant rules, agents, skills and hooks in `.claude/`                     |
| 18  | [Troubleshooting](18-troubleshooting.md)           | Common problems and how to fix them                                                |
| —   | [Glossary](glossary.md)                            | Definitions of every technical term used in these docs                             |

## Related files at the repo root

- [`README.md`](../README.md) — quick start and scripts.
- [`PLAN.md`](../PLAN.md) — the phased build plan written before any code.
- [`CLAUDE.md`](../CLAUDE.md) — the rules the AI assistant follows (also a good summary of conventions).

## How to use these docs while reading code

Each document links to real files. Open them side by side: read a section, then read the file it
describes. The reference feature is **Tasks**:

- Backend: [`apps/api/src/modules/tasks/`](../apps/api/src/modules/tasks/)
- Frontend: [`apps/web/src/features/tasks/`](../apps/web/src/features/tasks/)

Every future feature should look like these two folders.
