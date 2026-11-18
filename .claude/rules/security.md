---
paths:
  - 'apps/api/src/**'
  - 'apps/web/src/services/**'
  - '**/Dockerfile'
  - 'docker-compose.yml'
  - 'apps/web/nginx.conf'
---

# Security rules

- Validate all input through DTOs. Never trust `req.body`/`req.query` directly.
- Build queries with TypeORM operators/parameters only. No string-concatenated SQL with user input (raw SQL is acceptable only in migrations).
- Never log or return secrets, tokens, passwords, stack traces or internal error details. `AllExceptionsFilter` already hides 500 internals, so don't bypass it.
- Keep `helmet`, CORS allow-list (`CORS_ORIGINS`), throttling and `whitelist`/`forbidNonWhitelisted` enabled. Use `@SkipThrottle()` only for health checks.
- Never use `v-html` with user content in Vue.
- Containers run as a non-root user and must never bake `.env` files into images.
- New dependencies: prefer well-maintained packages and pin with a caret range. Explain why the dependency is needed.
