# 09 — Security

Security in production is **defence in depth**: several independent layers, so one mistake
doesn't expose everything. This page lists each protection in the repo, where it lives and what
it prevents. It loosely follows the [OWASP Top 10](https://owasp.org/Top10/).

## Protections in place

| #   | Protection                                                                                     | Where                         | Prevents                                                                                 |
| --- | ---------------------------------------------------------------------------------------------- | ----------------------------- | ---------------------------------------------------------------------------------------- |
| 1   | **DTO validation** (`whitelist`, `forbidNonWhitelisted`, `transform`)                          | `app.setup.ts`, `dto/`        | Malformed input, **mass assignment** (client setting `id`, `createdAt`…), type confusion |
| 2   | **`ParseUUIDPipe`** on ids                                                                     | controllers                   | Garbage ids reaching the DB                                                              |
| 3   | **Parameterised queries** (TypeORM operators)                                                  | `tasks.service.ts`            | **SQL injection**                                                                        |
| 4   | **Helmet** security headers                                                                    | `app.setup.ts`                | Clickjacking, MIME sniffing, some XSS vectors, info leaks (`X-Powered-By` removed)       |
| 5   | **CORS allow-list**                                                                            | `CORS_ORIGINS`                | Other websites calling your API from a user's browser                                    |
| 6   | **Rate limiting** (`ThrottlerGuard`, global)                                                   | `app.module.ts`               | Brute force, scraping, simple DoS                                                        |
| 7   | **Safe error responses**                                                                       | `AllExceptionsFilter`         | Leaking stack traces / internals on 500                                                  |
| 8   | **Log redaction** (`authorization`, `cookie`)                                                  | pino config                   | Credentials ending up in logs                                                            |
| 9   | **Env validation**                                                                             | Joi schema                    | Booting with missing/invalid secrets or config                                           |
| 10  | **Swagger off in production by default**                                                       | `SWAGGER_ENABLED`             | Advertising your attack surface                                                          |
| 11  | **Non-root containers**                                                                        | `USER node` in API Dockerfile | Container escape impact                                                                  |
| 12  | **No secrets in images or Git**                                                                | `.gitignore`, `.dockerignore` | Credential leaks                                                                         |
| 13  | **Minimal runtime images**                                                                     | multi-stage builds            | Fewer packages = fewer vulnerabilities                                                   |
| 14  | **nginx headers** (`X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy`, `server_tokens off`) | `nginx.conf`                  | Clickjacking, sniffing, version disclosure                                               |
| 15  | **Same-origin deployment**                                                                     | nginx `/api/` proxy           | Removes CORS complexity; API needn't be public                                           |
| 16  | **Vue template escaping**, no `v-html`                                                         | all components                | **XSS** — Vue escapes interpolated text by default                                       |
| 17  | **Lockfile + `npm ci`**                                                                        | CI & Dockerfiles              | Unexpected dependency versions (supply chain)                                            |
| 18  | **Claude hooks** block edits to `.env`                                                         | `.claude/hooks`               | AI assistant touching secrets                                                            |

## Explanations of the key ideas

### Mass assignment

Without `whitelist`, a client could send `{"title":"x","id":"…","createdAt":"1999-01-01"}` and,
because the service does `repository.create(dto)`, those fields could be written. Whitelisting
means _only declared, decorated fields_ get through; `forbidNonWhitelisted` makes the request
fail loudly.

### SQL injection

Never build SQL by concatenating user input:

```ts
// ❌ vulnerable
query(`SELECT * FROM tasks WHERE title LIKE '%${search}%'`);
// ✅ parameterised (what ILike does)
find({ where: { title: ILike(`%${search}%`) } }); // → WHERE title ILIKE $1
```

### CORS

Browsers block a page from `evil.com` reading responses from your API unless the API says that
origin is allowed. `CORS_ORIGINS` lists the allowed origins. Note: CORS protects **browsers**
only — `curl` ignores it — so it is not authentication.

### XSS (Cross-Site Scripting)

If a task title were `<script>steal()</script>`, Vue's `{{ task.title }}` renders it as text, not
HTML. `v-html` would execute it — so it's banned for user content.

## What is intentionally NOT included (and what you'd add next)

This template has **no authentication**. A real product would add, in roughly this order:

1. **Authentication** — e.g. `@nestjs/passport` + JWT access tokens (short-lived) and refresh
   tokens in `httpOnly`, `Secure`, `SameSite` cookies; or an identity provider (Auth0, Keycloak,
   Cognito). Attach tokens in the axios request interceptor (already stubbed).
2. **Authorization** — guards checking roles/ownership (a user may only edit their own tasks).
3. **Password hashing** with `argon2` or `bcrypt` if you store passwords.
4. **HTTPS everywhere** — terminate TLS at a load balancer or nginx; enable HSTS.
5. **Content-Security-Policy** tuned for the SPA.
6. **Dependency scanning** — `npm audit`, Dependabot/Renovate, container scanning (Trivy).
7. **Secret management** — see [Configuration](08-configuration.md#secrets-in-real-production).
8. **Distributed rate limiting** — the default throttler stores counters in memory per instance;
   with multiple replicas use a Redis store.

The `security-auditor` Claude agent can audit the repo against this list (see
[17-claude-code](17-claude-code.md)).
