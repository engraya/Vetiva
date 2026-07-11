# syntax=docker/dockerfile:1

# ---- Build stage ----
FROM node:22-alpine AS builder

# HUSKY=0 skips the `prepare: husky` script on install (no git hooks in CI).
ENV HUSKY=0 \
    CI=true \
    PNPM_HOME=/pnpm \
    PATH=/pnpm:$PATH

# corepack reads the pinned pnpm version from package.json `packageManager`.
RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm config set store-dir /pnpm/store && \
    pnpm install --frozen-lockfile

# Full source needed: `pnpm build` runs `tsc -b`, which also compiles
# vite.config.ts, playwright.config.ts, and e2e/ (see tsconfig.node.json).
COPY . .
RUN pnpm build

# ---- Runtime stage ----
FROM nginx:1.28-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s \
    CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1
