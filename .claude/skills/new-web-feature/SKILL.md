---
name: new-web-feature
description: Scaffold a complete Vue 3 feature slice (types, api module, Pinia store, components, list/create/edit views, routes, Vitest specs) in apps/web by mirroring the tasks reference slice. Use when the user asks to add UI/pages for a resource.
---

# New web feature

Argument: the feature name (singular), e.g. `project`.

## Steps

1. **Read the API contract** for this feature in `apps/api/src/modules/<plural>/dto/` and the entity. Frontend types must mirror them exactly. If the API does not exist yet, propose `/new-api-module` first.
2. **Read the reference:** everything under `apps/web/src/features/tasks/` and `apps/web/src/components/ui/`.
3. **Create** `apps/web/src/features/<plural>/` mirroring tasks:
   - `types/<singular>.types.ts` (entity, create/update payloads, query, constants/labels, limits)
   - `api/<plural>.api.ts` (`list/get/create/update/remove` via `http`)
   - `stores/<plural>.store.ts` (setup store with `items/meta/current/filters/loading/saving/error`, a `run()` helper, CRUD actions)
   - `components/` (`<X>Form.vue`, `<X>List.vue`, `<X>ListItem.vue`, plus filters/badges as needed)
   - `views/<X>ListView.vue`, `<X>CreateView.vue`, `<X>EditView.vue` handling loading, empty, error and success
   - `routes.ts` with lazy, named routes `<plural>.list|create|edit` and `meta.title`
   - `__tests__/` for form validation/emit, store actions (mock the api module) and any badge/formatter
4. **Register** routes by spreading `<plural>Routes` in `apps/web/src/router/index.ts`. Add a nav link in `src/components/layout/AppHeader.vue` if it is top-level.
5. **Verify:**
   ```bash
   npm run lint -w @app/web && npm run typecheck -w @app/web && npm test -w @app/web && npm run build -w @app/web
   ```
6. Tell the user how to try it (`npm run dev` → URL).
