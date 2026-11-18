# 18 — Troubleshooting

## API won't start: `Config validation error: "DB_HOST" is required`

The Joi schema rejected your environment. Create the env file: `cp apps/api/.env.example apps/api/.env`
and fill in the values. The message lists every invalid variable.

## `ECONNREFUSED 127.0.0.1:5432` / `password authentication failed`

Postgres isn't running or credentials differ.

```bash
npm run db:up
docker compose ps            # db should be "healthy"
```

Check `DB_*` in `apps/api/.env` match `docker-compose.yml` (default `postgres/postgres/app`).

## `ports are not available` / `address already in use`

Another program uses 8080, 3000 or 5432.

```powershell
Get-NetTCPConnection -LocalPort 8080 -State Listen | Select-Object OwningProcess
Get-Process -Id <pid>
```

Either stop it, or use other host ports: `WEB_PORT=8081 API_PORT=3001 DB_HOST_PORT=5433 docker compose up -d`
(if you change `DB_HOST_PORT` for local dev, also set `DB_PORT` in `apps/api/.env`).

## Frontend shows "Network error — please check your connection."

The browser can't reach the API. In dev, check the API is running on :3000 and
`VITE_DEV_API_PROXY_TARGET` is correct. In Docker, `docker compose logs api`.

## CORS error in the browser console

You called the API directly from an origin not in `CORS_ORIGINS`. Use the relative `/api/v1`
base URL (proxied), or add the origin to `CORS_ORIGINS`.

## `relation "tasks" does not exist`

Migrations haven't run. `npm run migration:run -w @app/api` (or keep `DB_RUN_MIGRATIONS=true`).

## Migration generate says "No changes in database schema were found"

Your entity already matches the DB, or the DB is not at the previous schema. Make sure earlier
migrations are applied, and that the entity file is under `src/**/*.entity.ts`.

## Commit rejected by the pre-commit hook

lint-staged found an ESLint error it couldn't auto-fix. Read the output, fix the file, `git add`,
commit again. Don't use `--no-verify` — CI will fail anyway.

## Hooks don't run at all

Run `npm install` (the `prepare` script installs Husky) and check `git config core.hooksPath`
prints `.husky/_`.

## `npm install` fails with `ECONNRESET` / very slow

Network instability. Retry with
`npm install --fetch-retries=6 --fetch-retry-maxtimeout=120000`. Projects inside OneDrive/Dropbox
folders are slow because the sync client scans `node_modules` — consider excluding the folder
from sync or moving the repo.

## VS Code shows TypeScript errors that `npm run typecheck` doesn't

VS Code may use its bundled TypeScript. Command palette → **TypeScript: Select TypeScript
Version** → **Use Workspace Version**. For `.vue` files make sure the **Vue (Official)** extension
is installed.

## Docker build fails at `npm ci`

The lockfile is out of sync with a `package.json`. Run `npm install` at the root and commit
`package-lock.json`. Remember the build context is the repo root.

## Changed a `VITE_*` variable but the Docker app didn't change

`VITE_*` values are baked in at build time. Rebuild: `docker compose build web` (pass
`--build-arg` if needed).

## Reset everything

```bash
docker compose down -v          # removes containers AND the database volume (data loss!)
rm -rf node_modules apps/*/node_modules apps/*/dist
npm install
```
