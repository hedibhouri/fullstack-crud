# 07 — API reference

Interactive docs (try requests in the browser): **http://localhost:3000/api/docs** (Swagger UI,
when `SWAGGER_ENABLED=true`). The raw OpenAPI JSON is at `/api/docs-json`.

- Base URL: `/api/v1`
- Content type: `application/json`
- IDs: UUID v4

## The Task resource

```json
{
  "id": "57715718-cb06-48fe-9958-a0dfe58a7afe",
  "title": "Smoke test",
  "description": "via nginx",
  "status": "todo",
  "dueDate": "2026-12-31",
  "createdAt": "2026-11-18T20:06:45.382Z",
  "updatedAt": "2026-11-18T20:06:45.382Z"
}
```

| Field                          | Type                                    | Rules                                 |
| ------------------------------ | --------------------------------------- | ------------------------------------- |
| `title`                        | string                                  | required, trimmed, 1–120 chars        |
| `description`                  | string \| null                          | optional, ≤ 1000 chars                |
| `status`                       | `"todo"` \| `"in_progress"` \| `"done"` | optional, default `"todo"`            |
| `dueDate`                      | string `YYYY-MM-DD` \| null             | optional, strict ISO date             |
| `id`, `createdAt`, `updatedAt` | read-only                               | set by the server; sending them → 400 |

## Endpoints

### List tasks — `GET /api/v1/tasks`

| Query    | Type   | Default | Rules                                        |
| -------- | ------ | ------- | -------------------------------------------- |
| `page`   | int    | 1       | ≥ 1                                          |
| `limit`  | int    | 10      | 1–100                                        |
| `status` | enum   | —       | filter by status                             |
| `search` | string | —       | case-insensitive match on title, ≤ 120 chars |

Sorted newest first. Response `200`:

```json
{
  "data": [{ "id": "…", "title": "…", "...": "..." }],
  "meta": { "page": 1, "limit": 10, "total": 21, "totalPages": 3 }
}
```

### Get one — `GET /api/v1/tasks/:id`

`200` with a Task · `400` if `id` is not a UUID · `404` if not found.

### Create — `POST /api/v1/tasks`

```bash
curl -X POST http://localhost:3000/api/v1/tasks \
  -H 'Content-Type: application/json' \
  -d '{"title":"Write docs","dueDate":"2026-12-31"}'
```

`201` with the created Task · `400` on validation errors.

### Update — `PATCH /api/v1/tasks/:id`

Partial update — send only the fields to change:

```bash
curl -X PATCH http://localhost:3000/api/v1/tasks/<id> \
  -H 'Content-Type: application/json' -d '{"status":"done"}'
```

`200` with the updated Task · `400` · `404`.

> **PATCH vs PUT:** `PUT` replaces the whole resource; `PATCH` changes some fields. Partial updates
> are what UIs need, so this API uses `PATCH`.

### Delete — `DELETE /api/v1/tasks/:id`

`204 No Content` (empty body) · `400` · `404`.

### Health — `GET /api/health`

Not versioned, not rate-limited.

```json
{
  "status": "ok",
  "info": { "database": { "status": "up" } },
  "error": {},
  "details": { "...": "..." }
}
```

Returns `503` with `"status": "error"` if the database is unreachable.

## Error format

**Every** error has the same shape:

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": ["property hack should not exist", "title should not be empty"],
  "path": "/api/v1/tasks",
  "timestamp": "2026-11-18T20:06:46.011Z"
}
```

`message` is a string, or an array of strings for validation errors.

| Status | When                                                           |
| ------ | -------------------------------------------------------------- |
| 400    | Invalid body/query, unknown fields, malformed UUID             |
| 404    | Resource not found / unknown route                             |
| 429    | Rate limit exceeded (default 100 requests per 60 s per client) |
| 500    | Unexpected server error (details are logged, never returned)   |
| 503    | Health check failing                                           |

## Versioning policy

Non-breaking changes (new optional field, new endpoint) are added to `v1`. Breaking changes
(removing/renaming a field, changing types or semantics) go to a new controller version
(`version: '2'`) served at `/api/v2/...` while `v1` stays available until clients migrate.
