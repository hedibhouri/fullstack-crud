# 15 — Development workflow

## 1. First-time setup

```bash
git clone https://github.com/<you>/fullstack-crud.git
cd fullstack-crud
nvm use                                   # Node 22 (optional, if you use nvm)
npm install                               # all workspaces + Git hooks
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

## 2. Daily loop

```bash
npm run db:up        # Postgres in Docker (once per session)
npm run dev          # API on :3000 (watch) + web on :5173 (HMR)
```

| URL                              | What                  |
| -------------------------------- | --------------------- |
| http://localhost:5173            | App (Vite dev server) |
| http://localhost:3000/api/docs   | Swagger UI            |
| http://localhost:3000/api/health | Health                |

Debug the API: `npm run start:debug -w @app/api`, then attach VS Code's debugger to port 9229.

## 3. Git workflow

1. Branch from `main`: `git switch -c feat/projects`.
2. Commit small, focused changes with **Conventional Commits**:
   ```
   feat(api): add projects module
   fix(web): keep filters when paginating
   docs: explain migrations
   refactor(api): extract pagination helper
   test(web): cover TaskForm validation
   chore(deps): bump vite
   ```
   Format: `<type>(<scope>): <imperative summary>`. Types: `feat`, `fix`, `docs`, `refactor`,
   `test`, `perf`, `build`, `ci`, `chore`. A consistent history enables automatic changelogs and
   semantic versioning later.
3. The pre-commit hook lints/formats staged files.
4. Push and open a **pull request**; CI runs; review; merge.

Never commit `.env` files, never `--no-verify`.

## 4. Adding a new feature end to end

Example: a **Projects** resource (`name`, `color`). Always mirror the Tasks feature.

### Backend

1. **Entity** `apps/api/src/modules/projects/entities/project.entity.ts`:
   ```ts
   @Entity({ name: 'projects' })
   export class Project extends BaseEntity {
     @Column({ type: 'varchar', length: 80 }) name: string;
     @Column({ type: 'varchar', length: 7, nullable: true }) color: string | null;
   }
   ```
2. **Migration** — `npm run db:up`, then
   `npm run migration:generate -w @app/api -- src/database/migrations/CreateProjects`. Review
   the SQL, then `migration:run` / `migration:revert` / `migration:run`.
3. **DTOs** in `dto/`: `CreateProjectDto` (validators), `UpdateProjectDto = PartialType(...)`,
   `QueryProjectDto extends PaginationQueryDto`, response DTOs, `index.ts`.
4. **Service** with `findAll / findOne / create / update / remove` (copy the Tasks service shape).
5. **Controller** `@Controller({ path: 'projects', version: '1' })` with Swagger decorators.
6. **Module** with `TypeOrmModule.forFeature([Project])`; add `ProjectsModule` to `app.module.ts`.
7. **Tests**: `projects.service.spec.ts`, `projects.controller.spec.ts`, `test/projects.e2e-spec.ts`.

### Frontend

1. `features/projects/types/project.types.ts` mirroring the DTOs.
2. `api/projects.api.ts` — `list/get/create/update/remove`.
3. `stores/projects.store.ts` — copy the Tasks store shape.
4. Components (`ProjectForm`, `ProjectList`, …) built from `Base*` components.
5. Views (`ProjectListView`, `ProjectCreateView`, `ProjectEditView`) handling all UI states.
6. `routes.ts` with lazy, named routes `projects.list|create|edit`; spread into
   `src/router/index.ts`; add a link in `AppHeader.vue`.
7. Tests in `__tests__/`.

### Verify and ship

```bash
npm run format && npm run lint && npm run typecheck && npm test && npm run test:e2e && npm run build
git add -p && git commit -m "feat: add projects"
```

With Claude Code this whole flow is `/new-api-module project` → `/new-web-feature project` →
`/verify` → `/commit` (see [17-claude-code](17-claude-code.md)).

## 5. Changing an existing API contract

1. Update the DTO (and entity + migration if storage changes).
2. Update the web `types/` file **in the same commit**.
3. Update store/components using the field.
4. If the change is **breaking** for existing clients, introduce `v2` instead
   ([API reference](07-api-reference.md#versioning-policy)).

## 6. Dependencies

```bash
npm install <pkg> -w @app/api            # runtime dependency of the API
npm install -D <pkg> -w @app/web         # dev dependency of the web app
npm install -D <pkg>                     # root tooling
npm outdated                             # what's behind
npm audit                                # known vulnerabilities
```

Always commit the updated `package-lock.json`. Prefer well-maintained packages and justify new
ones — every dependency is code you're responsible for.
