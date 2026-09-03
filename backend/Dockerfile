# ─────────────────────────────────────────────────────────────────────────────
# Backend Dockerfile — Multi-stage build
#
# Stage 1: deps     — Install all dependencies
# Stage 2: builder  — Compile TypeScript
# Stage 3: runner   — Minimal production image
# ─────────────────────────────────────────────────────────────────────────────

# Stage 1: Install deps
FROM node:20-alpine AS deps
LABEL stage=deps

WORKDIR /app

COPY package*.json ./
RUN npm ci --prefer-offline

# Stage 2: Build TypeScript
FROM node:20-alpine AS builder
LABEL stage=builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Stage 3: Production runtime — minimal image
FROM node:20-alpine AS runner
LABEL stage=runner
LABEL org.opencontainers.image.title="MyPlatform Backend"
LABEL org.opencontainers.image.description="Fastify REST API"

# Security: run as non-root
RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 --ingroup nodejs appuser

WORKDIR /app

# Copy only production artifacts
COPY --from=deps    /app/node_modules ./node_modules
COPY --from=builder /app/dist         ./dist
COPY package*.json ./

# Remove devDependencies from node_modules (prune)
RUN npm prune --production

# Set non-root user
USER appuser

# Expose port (documented; actual binding via ENV PORT)
EXPOSE 8080

ENV NODE_ENV=production
ENV PORT=8080
ENV HOST=0.0.0.0

# Health check — calls the /health/live endpoint
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget -qO- http://127.0.0.1:${PORT}/health/live || exit 1

CMD ["node", "dist/server.js"]
