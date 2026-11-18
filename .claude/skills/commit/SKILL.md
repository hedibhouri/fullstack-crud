---
name: commit
description: Create a clean Conventional Commit for the current changes after verifying them — reviews the diff, groups related changes, writes the message, and never commits secrets or bypasses hooks. Use when the user asks to commit (and optionally push).
---

# Commit

1. `git status` and `git diff` (staged + unstaged). Understand every change.
2. **Safety:** make sure no `.env`, credentials, `node_modules`, `dist` or coverage files are included. Stop and warn if any are.
3. Run `/verify` unless it was just run successfully on these exact changes.
4. If the diff mixes unrelated concerns, propose splitting it into several commits.
5. Stage explicitly by path (avoid `git add -A` when unrelated files are present).
6. Message format ([Conventional Commits](https://www.conventionalcommits.org)):
   ```
   <type>(<scope>): <imperative summary ≤ 72 chars>

   <body: what and why, wrapped at 72>
   ```
   Types: `feat`, `fix`, `refactor`, `perf`, `test`, `docs`, `build`, `ci`, `chore`. Scopes: `api`, `web`, `db`, `infra`, `deps`, `claude`.
7. Commit. Hooks run lint-staged. If a hook fails, fix the issue and create a new commit. Never use `--no-verify` or `--amend` on pushed commits.
8. Push only if the user asked to.
