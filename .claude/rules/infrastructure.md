---
paths:
  - '**/Dockerfile'
  - 'docker-compose.yml'
  - '.dockerignore'
  - '.github/**'
  - 'apps/web/nginx.conf'
---

# Infrastructure rules

- Docker build context is always the **repo root** (npm workspace lockfile). Dockerfiles copy every workspace `package.json` before `npm ci`.
- Multi-stage builds: separate build and runtime stages; runtime contains only production deps and compiled output.
- Pin base images to a major/minor tag (`node:22-alpine`, `postgres:16-alpine`, `nginx:1.27-alpine`). Never use `latest`.
- Every long-running service has a `HEALTHCHECK`/compose `healthcheck` and `depends_on: condition: service_healthy`.
- Config is passed via environment variables. Compose uses `${VAR:-default}` for overridable values.
- nginx: `add_header` is not inherited into a `location` that defines its own, so repeat security headers per location.
- CI (`.github/workflows/ci.yml`) must mirror the local Definition of Done. When a new quality step is added locally, add it to CI too.
