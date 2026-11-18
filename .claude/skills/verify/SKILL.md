---
name: verify
description: Run the project's full Definition-of-Done quality gate (format check, lint, typecheck, unit tests, API e2e tests, production builds) and report results honestly. Use before saying work is done, before committing, or when the user asks to check/test everything.
---

# Verify (Definition of Done)

Run from the repo root, in order, stopping to fix issues as they appear:

```bash
npm run format:check
npm run lint
npm run typecheck
npm test
npm run test:e2e
npm run build
```

## Handling failures

- **Formatting:** run `npm run format`, then re-check.
- **Lint:** try `npm run lint:fix -w <ws>` first, then fix the remainder by hand. Never disable rules inline without a written justification.
- **Type errors / failing tests:** fix the root cause. Never use `any`, `@ts-ignore`, `.skip` or weakened assertions to get to green.

## Report

A short table with each step and ✅/❌. For any ❌, include the relevant output excerpt and what was done about it. Only claim "done" when every step is ✅.

Optional, when Docker-related files changed: also run `/docker-stack`.
