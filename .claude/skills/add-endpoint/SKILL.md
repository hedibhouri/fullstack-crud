---
name: add-endpoint
description: Add a single endpoint (or change an existing one) to an existing NestJS module end-to-end — DTO, service method, controller route, Swagger, tests, and the matching frontend api/types/store update. Use for "add an endpoint/route/action to X".
---

# Add / change an endpoint

## Steps

1. Locate the module in `apps/api/src/modules/<feature>/`. Read its controller, service, DTOs and specs.
2. **Design** the contract: method, path (REST, plural nouns, no verbs unless it is an action like `POST /tasks/:id/archive`), request DTO, response shape, status codes and error cases. State it briefly before coding.
3. **API side:**
   - DTO with class-validator decorators (new file in `dto/`, exported from `dto/index.ts`)
   - Service method with business logic and Nest HTTP exceptions
   - Controller route: thin, `ParseUUIDPipe` for ids, `@HttpCode` when not 200/201, Swagger `@Api*Response` decorators
   - Unit tests for the service method and an e2e test for the route (happy path + 400 + 404)
4. **Web side (if consumed):** update `features/<feature>/types`, add the call to `api/<feature>.api.ts`, add the store action, and add tests.
5. **Schema change?** Run `/db-migration`.
6. Run `/verify`.
