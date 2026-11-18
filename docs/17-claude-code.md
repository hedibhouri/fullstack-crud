# 17 — Claude Code setup (`.claude/` and `CLAUDE.md`)

The repo contains configuration for [Claude Code](https://code.claude.com/docs), an AI coding
assistant, so that it follows the project's architecture and conventions every time. Think of it
as **onboarding documentation for an AI teammate**, plus automated guardrails.

```
CLAUDE.md                     ← always loaded: principles, commands, Definition of Done
apps/api/CLAUDE.md            ← loaded when working in apps/api
apps/web/CLAUDE.md            ← loaded when working in apps/web
.claude/
├── settings.json             ← permissions + hooks (shared with the team)
├── hooks/                    ← scripts run automatically around tool calls
├── rules/                    ← topic rules loaded for matching file paths
├── agents/                   ← specialist subagents
└── skills/                   ← reusable workflows invoked as /commands
```

## 1. Memory files: `CLAUDE.md`

| File                                          | Content                                                                                              |
| --------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| [`CLAUDE.md`](../CLAUDE.md)                   | 10 non-negotiable principles, commands, naming, Git rules, Definition of Done, list of agents/skills |
| [`apps/api/CLAUDE.md`](../apps/api/CLAUDE.md) | NestJS module anatomy and rules (controllers, services, DTOs, entities, config, logging, tests)      |
| [`apps/web/CLAUDE.md`](../apps/web/CLAUDE.md) | Vue feature-slice anatomy and rules (SFCs, data flow, routing, a11y, tests)                          |

These are also an excellent **human** summary of the conventions.

## 2. Path-scoped rules: `.claude/rules/`

Each file has `paths:` frontmatter and is applied when Claude works on matching files.

| Rule                                                      | Applies to                             |
| --------------------------------------------------------- | -------------------------------------- |
| [`testing.md`](../.claude/rules/testing.md)               | spec files, `test/`, `__tests__/`      |
| [`security.md`](../.claude/rules/security.md)             | API source, HTTP client, Docker, nginx |
| [`database.md`](../.claude/rules/database.md)             | `database/`, `*.entity.ts`             |
| [`infrastructure.md`](../.claude/rules/infrastructure.md) | Dockerfiles, compose, CI, nginx        |

## 3. Agents: `.claude/agents/`

Subagents are specialised assistants with their own instructions and tool access.

| Agent               | Can edit?    | Use it for                                              |
| ------------------- | ------------ | ------------------------------------------------------- |
| `backend-engineer`  | ✅           | NestJS features/fixes following the Tasks module        |
| `frontend-engineer` | ✅           | Vue features/fixes following the Tasks slice            |
| `test-engineer`     | ✅           | Writing tests, coverage gaps, reproducing bugs          |
| `db-specialist`     | ✅           | Schema design, entities, migrations                     |
| `devops-engineer`   | ✅           | Docker, compose, nginx, CI; local stack smoke tests     |
| `code-reviewer`     | ❌ read-only | Review a diff against conventions; prioritised findings |
| `security-auditor`  | ❌ read-only | OWASP-style audit + `npm audit`                         |

Ask for them by name: _"Use the code-reviewer agent on my changes."_

## 4. Skills (slash commands): `.claude/skills/`

| Command            | What it does                                                                                   |
| ------------------ | ---------------------------------------------------------------------------------------------- |
| `/new-api-module`  | Scaffold a complete Nest feature (entity, migration, DTOs, service, controller, module, tests) |
| `/new-web-feature` | Scaffold a complete Vue feature slice (types, api, store, components, views, routes, tests)    |
| `/add-endpoint`    | Add/change one endpoint end to end, including frontend types                                   |
| `/db-migration`    | Create/generate, verify (run → revert → run) a migration safely                                |
| `/verify`          | Run the full Definition of Done and report ✅/❌ honestly                                      |
| `/commit`          | Safety checks + Conventional Commit, never bypassing hooks                                     |
| `/docker-stack`    | Build, run and smoke-test the Docker stack                                                     |

Typical flow: `/new-api-module project` → `/new-web-feature project` → `/verify` → `/commit`.

## 5. Settings and hooks: `.claude/settings.json`

**Permissions**

- _allow_: safe, frequent commands (lint, typecheck, test, build, `git status/diff/log`,
  `docker compose ps/logs`) run without prompting.
- _deny_: reading `.env` files, `git push --force`, `git commit --no-verify`,
  `docker system prune`.

**Hooks** — scripts the harness runs automatically, so the rules are _enforced_, not just
requested:

| Hook                     | Script                                                    | Behaviour                                                                                                          |
| ------------------------ | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| PreToolUse (Edit/Write)  | [`protect-files.mjs`](../.claude/hooks/protect-files.mjs) | Blocks edits to real `.env` files, `package-lock.json`, and **committed** migrations (checked with `git ls-files`) |
| PostToolUse (Edit/Write) | [`format-file.mjs`](../.claude/hooks/format-file.mjs)     | Runs Prettier on every file Claude edits                                                                           |

Personal overrides go in `.claude/settings.local.json` (git-ignored).

## 6. Why this pattern is worth copying

The same idea works for human teams: **write conventions down once, point to a reference
implementation, and automate enforcement** (types, lint, hooks, CI). The AI setup is simply the
same discipline applied to an assistant.
