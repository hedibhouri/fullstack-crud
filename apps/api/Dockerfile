# syntax=docker/dockerfile:1
# Build context: repository root (the npm workspace lockfile lives there).

# ─── Base: workspace manifests only (maximises layer caching) ─
FROM node:22-alpine AS base
WORKDIR /repo
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/

# ─── Build: full deps + compile ───────────────────────────────
FROM base AS build
RUN npm ci --workspace @app/api --include-workspace-root=false --ignore-scripts
COPY apps/api apps/api
RUN npm run build --workspace @app/api

# ─── Production dependencies only ─────────────────────────────
FROM base AS prod-deps
RUN npm ci --omit=dev --workspace @app/api --include-workspace-root=false --ignore-scripts \
  && mkdir -p apps/api/node_modules

# ─── Runtime ──────────────────────────────────────────────────
FROM node:22-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app

COPY --from=prod-deps --chown=node:node /repo/node_modules ./node_modules
COPY --from=prod-deps --chown=node:node /repo/apps/api/node_modules ./node_modules
COPY --from=build --chown=node:node /repo/apps/api/dist ./dist
COPY --chown=node:node apps/api/package.json ./package.json

USER node
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:${PORT:-3000}/api/health || exit 1

CMD ["node", "dist/main.js"]
