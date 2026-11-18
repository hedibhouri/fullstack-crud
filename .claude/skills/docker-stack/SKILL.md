---
name: docker-stack
description: Build and run the full production-like stack (PostgreSQL + API + nginx web) with Docker Desktop and smoke-test it end to end. Use when the user asks to run/test in Docker, after changing Dockerfiles/compose/nginx, or before a release.
---

# Docker stack

Requires Docker Desktop to be running (`docker info`).

## Run

```bash
docker compose build
docker compose up -d
docker compose ps            # wait until db, api and web are all "healthy"
```

Port 5432 must be free. If another Postgres container uses it, tell the user rather than stopping it yourself.

## Smoke test

```bash
curl -fsS http://localhost:3000/api/health
curl -fsS -X POST http://localhost:8080/api/v1/tasks -H 'Content-Type: application/json' -d '{"title":"Smoke test"}'
curl -fsS http://localhost:8080/api/v1/tasks
# PATCH and DELETE the created id, then confirm 404 on GET
curl -fsS -o /dev/null -w '%{http_code}\n' http://localhost:8080/        # 200 (SPA)
curl -fsS -o /dev/null -w '%{http_code}\n' http://localhost:8080/tasks   # 200 (SPA fallback)
```

On failure: `docker compose logs --tail=100 api web db`.

## Clean up

- Stop: `docker compose down`
- Wipe the DB volume too: `docker compose down -v`. **Only do this when the user asks.**
- Never prune or remove Docker resources that don't belong to this project without explicit confirmation.

Report service health, smoke-test results and image sizes (`docker images`).
