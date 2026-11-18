# Web rules (Vue 3)

The reference implementation is `src/features/tasks/`. Mirror it.

## Feature slice anatomy

```
src/features/<feature>/
├── api/<feature>.api.ts       typed calls through `http` from '@/services/http'
├── components/                presentational, props in / events out
├── stores/<feature>.store.ts  Pinia setup store: state, getters, actions
├── types/<x>.types.ts         domain types mirroring the API DTOs and constants
├── views/<X>View.vue          route components that orchestrate store + components
├── __tests__/*.spec.ts
└── routes.ts                  lazy-loaded RouteRecordRaw[], spread into src/router/index.ts
```

## Rules

- **SFCs:** `<script setup lang="ts">` only, with block order script → template → style. Use
  `<style scoped>` and existing CSS tokens (`var(--color-*)`, `var(--space-*)`). Don't
  hard-code colours.
- **Typing:** type-based `defineProps<…>()` / `defineEmits<…>()`. Use `defineModel` for
  v-model and `withDefaults` for optional props.
- **Data flow:** components never call `http` or `*.api.ts` directly. Views call store actions,
  stores call `api/`, and `api/` uses the shared `http` client. Errors surface as `ApiError`
  via `store.error`.
- **Reuse:** build from `components/ui/Base*` (Button, Input, Select, Textarea, Alert, Spinner,
  Pagination). For navigation, use `<BaseButton :to>` rather than a button nested inside a
  `RouterLink`.
- **Routing:** route components are lazy-loaded (`() => import(...)`), routes are named
  `<feature>.<action>`, and `meta.title` is set. Navigate by route name, never by hard-coded
  path strings.
- **Imports:** use the `@/` alias for cross-folder imports and relative paths inside a feature.
- **Env:** read env only through `src/config/env.ts`. New `VITE_*` variables go in `env.d.ts`
  and `.env.example`.
- **Accessibility:** labelled form controls, `aria-*` on custom controls, a visible focus
  state, semantic elements (`button` for actions, `a`/`RouterLink` for navigation).
- **UI states:** every data view handles loading, empty, error and success.

## Testing

- Vitest + `@vue/test-utils` (jsdom). Stub `RouterLink` when mounting components that use
  `BaseButton :to`.
- Stores: `setActivePinia(createPinia())` and `vi.mock('../api/<feature>.api')`.
- Test behaviour (rendered output, emitted events, state), not implementation details.
