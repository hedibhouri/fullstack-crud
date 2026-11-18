# Glossary

| Term                           | Meaning                                                                                                         |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| **ACID**                       | Database transaction guarantees: Atomic, Consistent, Isolated, Durable.                                         |
| **API**                        | Application Programming Interface — here, the HTTP endpoints the frontend calls.                                |
| **Barrel file**                | An `index.ts` that re-exports a folder's modules for shorter imports.                                           |
| **Build context**              | The set of files sent to Docker when building an image.                                                         |
| **CI / CD**                    | Continuous Integration (automatic checks on every change) / Continuous Delivery-Deployment (automatic release). |
| **Code splitting**             | Splitting the JS bundle into chunks loaded on demand (lazy routes).                                             |
| **Composition API**            | Vue 3's function-based way to write component logic (`ref`, `computed`, `watch`).                               |
| **Composable**                 | A reusable function using the Composition API (`useDebouncedRef`).                                              |
| **Container**                  | A running instance of a Docker image.                                                                           |
| **CORS**                       | Cross-Origin Resource Sharing — browser rule controlling which origins may call an API.                         |
| **CRUD**                       | Create, Read, Update, Delete.                                                                                   |
| **Decorator**                  | `@Something()` syntax attaching metadata to a class, method, property or parameter.                             |
| **Dependency Injection (DI)**  | A framework creates objects and supplies their dependencies, instead of code calling `new`.                     |
| **Design tokens**              | Named design values (colours, spacing) defined once as CSS variables.                                           |
| **DTO**                        | Data Transfer Object — class describing data crossing a boundary, with validation rules.                        |
| **E2E test**                   | End-to-end test exercising the system through its external interface (HTTP here).                               |
| **Entity**                     | A class mapped to a database table by the ORM.                                                                  |
| **Exception filter**           | Nest component converting thrown errors into HTTP responses.                                                    |
| **Guard**                      | Nest component deciding whether a request may proceed (auth, rate limiting).                                    |
| **Health check**               | Endpoint reporting whether the service and its dependencies work.                                               |
| **HMR**                        | Hot Module Replacement — updating code in the browser without a full reload.                                    |
| **Hoisting**                   | npm placing shared dependencies in the root `node_modules`.                                                     |
| **Idempotent**                 | Repeating a request has the same effect as doing it once (GET, PUT, DELETE).                                    |
| **Image**                      | An immutable, layered package of an application and its runtime.                                                |
| **Index (DB)**                 | A data structure making lookups/sorts on a column fast.                                                         |
| **Interceptor (axios)**        | Function that runs on every request/response (error normalisation, auth headers).                               |
| **JSON**                       | JavaScript Object Notation — the data format exchanged by the API.                                              |
| **jsdom**                      | A JavaScript implementation of the browser DOM, used to run component tests in Node.                            |
| **Layer (architecture)**       | A part of the code with one responsibility (controller, service, repository).                                   |
| **Lazy loading**               | Loading code only when it's needed.                                                                             |
| **Lint**                       | Static analysis that flags bugs and bad patterns.                                                               |
| **Lockfile**                   | `package-lock.json` — exact versions of every installed package.                                                |
| **Mass assignment**            | Vulnerability where a client sets fields it shouldn't (e.g. `id`) by adding them to a payload.                  |
| **Middleware**                 | Function run on every request before the route handler.                                                         |
| **Migration**                  | Versioned script that changes the database schema (`up`) and can undo it (`down`).                              |
| **Mock / fake / stub**         | Test replacements for real dependencies.                                                                        |
| **Module (Nest)**              | A class grouping related controllers and providers.                                                             |
| **Monorepo**                   | One repository containing several projects.                                                                     |
| **Multi-stage build**          | Dockerfile with several `FROM` stages; only the last ships.                                                     |
| **OpenAPI / Swagger**          | Standard format describing an HTTP API / tooling that renders it as interactive docs.                           |
| **ORM**                        | Object-Relational Mapper — maps classes to database tables.                                                     |
| **Pagination**                 | Returning a list in pages (`page`, `limit`) instead of all at once.                                             |
| **Pinia**                      | Vue's official state management library.                                                                        |
| **Pipe (Nest)**                | Component transforming/validating input before the handler.                                                     |
| **Provider (Nest)**            | Any injectable class (service, repository, factory).                                                            |
| **Rate limiting / throttling** | Limiting how many requests a client may make per time window.                                                   |
| **Repository**                 | Object providing data access for one entity.                                                                    |
| **Reverse proxy**              | Server forwarding requests to backend services (nginx → API).                                                   |
| **SFC**                        | Single-File Component — a `.vue` file with script, template and style.                                          |
| **SPA**                        | Single-Page Application — loads once; navigation happens in the browser.                                        |
| **SPA fallback**               | Server returning `index.html` for unknown paths so the client router can handle them.                           |
| **SQL injection**              | Attack inserting SQL through unescaped user input; prevented by parameterised queries.                          |
| **Strict mode (TS)**           | TypeScript settings enabling the strongest type checks.                                                         |
| **Structured logging**         | Logs as machine-readable key/value objects (JSON).                                                              |
| **Twelve-Factor App**          | Methodology for building deployable SaaS apps (config in env, logs to stdout, …).                               |
| **UUID**                       | Universally Unique Identifier — 128-bit random id.                                                              |
| **Versioning (API)**           | Keeping multiple API versions (`/v1`, `/v2`) so changes don't break clients.                                    |
| **Volume**                     | Docker storage that persists beyond a container's life.                                                         |
| **Whitelist (validation)**     | Only declared fields are accepted; others are stripped or rejected.                                             |
| **Workspace (npm)**            | A package inside a monorepo managed by the root `package.json`.                                                 |
| **XSS**                        | Cross-Site Scripting — injecting scripts into pages viewed by others.                                           |
