# MyPlatform — Local-First Full-Stack Development Platform

> A complete, production-grade local development environment that is architected for zero-code-change migration to Google Cloud.

[![Architecture](https://img.shields.io/badge/Architecture-Local--first-6366f1)]()
[![Stack](https://img.shields.io/badge/Stack-React%20%2B%20Fastify%20%2B%20MongoDB-22c55e)]()
[![Registry](https://img.shields.io/badge/Registry-Verdaccio-ef4444)]()
[![GCP Ready](https://img.shields.io/badge/GCP-Migration--Ready-4285F4)]()

---

## Table of Contents

1. [Architecture](#1-architecture)
2. [Prerequisites](#2-prerequisites)
3. [Directory Structure](#3-directory-structure)
4. [Quick Start](#4-quick-start)
5. [Starting the System](#5-starting-the-system)
6. [Stopping the System](#6-stopping-the-system)
7. [UI Library Development](#7-ui-library-development)
8. [UI Library Versioning](#8-ui-library-versioning)
9. [Publishing to Verdaccio](#9-publishing-to-verdaccio)
10. [Installing UI Packages](#10-installing-ui-packages)
11. [MongoDB Usage](#11-mongodb-usage)
12. [Environment Variables](#12-environment-variables)
13. [Testing](#13-testing)
14. [Linting & Formatting](#14-linting--formatting)
15. [Docker Commands](#15-docker-commands)
16. [Version Isolation Demo](#16-version-isolation-demo)
17. [Local CI Pipeline](#17-local-ci-pipeline)
18. [Security](#18-security)
19. [Troubleshooting](#19-troubleshooting)
20. [GCP Migration Guide](#20-gcp-migration-guide)

---

## 1. Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Developer Machine                        │
│                                                             │
│  ┌──────────────┐    npm publish    ┌─────────────────────┐ │
│  │  ui-library  │ ─────────────────▶│    Verdaccio        │ │
│  │  @myorg/ui   │                   │  localhost:4873      │ │
│  │  v0.1.0      │                   └──────────┬──────────┘ │
│  │  v0.2.0      │                              │            │
│  └──────────────┘               npm install    │            │
│                                               ▼            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                    Docker Compose                     │  │
│  │                                                      │  │
│  │  ┌────────────┐   ┌────────────┐   ┌─────────────┐  │  │
│  │  │  Frontend  │   │  Backend   │   │   MongoDB   │  │  │
│  │  │ React+Vite │   │  Fastify   │   │    7.0      │  │  │
│  │  │   :3000    │──▶│   :8080    │──▶│   :27017    │  │  │
│  │  │   nginx    │   │            │   │             │  │  │
│  │  └────────────┘   └────────────┘   └─────────────┘  │  │
│  │                                                      │  │
│  │  ┌────────────┐   ┌────────────────────────────────┐ │  │
│  │  │ Verdaccio  │   │      Mongo Express             │ │  │
│  │  │   :4873    │   │          :8081                 │ │  │
│  │  └────────────┘   └────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

**Service URLs (local):**

| Service | URL | Description |
|---|---|---|
| Frontend | http://localhost:3000 | React app |
| Backend API | http://localhost:8080 | Fastify REST API |
| API Health | http://localhost:8080/health | Health endpoint |
| Verdaccio | http://localhost:4873 | npm registry |
| Mongo Express | http://localhost:8081 | MongoDB web UI |
| MongoDB | mongodb://localhost:27017 | Direct DB access |

---

## 2. Prerequisites

| Tool | Version | Purpose |
|---|---|---|
| Node.js | ≥ 20.0.0 | Running scripts |
| npm | ≥ 10.0.0 | Package management |
| Docker Desktop | Latest | Container runtime |
| Git | Latest | Source control |

**Windows-specific notes:**
- Use Docker Desktop (not WSL-only Docker)
- All scripts are cross-platform Node.js — no bash required
- PowerShell equivalents documented in [Section 15](#15-docker-commands)

---

## 3. Directory Structure

```
my-platform/
├── ui-library/              ← @myorg/ui package (independent repo)
│   ├── src/
│   │   ├── components/      ← Button, Input, Card, Modal, Typography, Container, Badge
│   │   ├── theme/           ← Design tokens
│   │   ├── hooks/
│   │   └── index.ts         ← Public API
│   ├── tests/               ← Vitest tests
│   ├── stories/             ← Storybook stories
│   ├── .storybook/
│   ├── package.json         ← publishes to Verdaccio via publishConfig
│   └── CHANGELOG.md
│
├── frontend/                ← React app (independent repo)
│   ├── src/
│   │   ├── pages/           ← HomePage, ExamplesPage, StatusPage, ComponentsPage
│   │   ├── layouts/         ← AppLayout (nav + footer)
│   │   ├── services/        ← api.ts (all backend calls)
│   │   ├── hooks/           ← useApi.ts
│   │   └── config/          ← app.ts
│   ├── Dockerfile           ← Multi-stage: node build → nginx serve
│   └── nginx.conf
│
├── backend/                 ← Fastify API (independent repo)
│   ├── src/
│   │   ├── config/          ← env.ts (Zod), database.ts
│   │   ├── routes/          ← health.routes.ts, example.routes.ts
│   │   ├── controllers/     ← example.controller.ts
│   │   ├── services/        ← seed.service.ts
│   │   ├── repositories/    ← example.repository.ts
│   │   ├── models/          ← example.model.ts
│   │   ├── schemas/         ← example.schema.ts (Zod)
│   │   └── app.ts           ← Fastify app factory
│   ├── Dockerfile           ← Multi-stage: node build → minimal alpine
│   └── .env.example
│
└── infrastructure/          ← Orchestration (independent repo)
    ├── docker-compose.yml
    ├── verdaccio/
    │   └── config.yaml
    ├── mongo-init/
    │   └── init.js
    ├── scripts/
    │   ├── publish-ui.js    ← Build & publish @myorg/ui to Verdaccio
    │   ├── verify-all.js    ← Run all CI checks
    │   ├── db-seed.js       ← Seed MongoDB
    │   └── security-audit.js
    ├── README.md            ← This file
    └── ARCHITECTURE.md      ← Mermaid diagrams
```

---

## 4. Quick Start

```bash
# 1. Navigate to the infrastructure directory
cd my-platform/infrastructure

# 2. Start all services (first run will build images)
docker compose up --build

# 3. In a new terminal: publish the UI library
node scripts/publish-ui.js

# 4. Seed the database
node scripts/db-seed.js

# 5. Open the frontend
# Browser: http://localhost:3000
```

> **Note:** On first run, the frontend Docker build will install `@myorg/ui` from Verdaccio.
> Make sure to publish the library (step 3) before rebuilding the frontend.

---

## 5. Starting the System

### All services at once

```bash
cd my-platform/infrastructure

# Start and build
docker compose up --build

# Start in background (detached)
docker compose up -d --build
```

### Individual services

```bash
# Start only Verdaccio and MongoDB
docker compose up verdaccio mongodb

# Start backend only (assumes MongoDB is running)
docker compose up backend

# Rebuild and restart a specific service
docker compose up --build backend
```

### Host-based development (without Docker for frontend/backend)

```bash
# 1. Start infra services
docker compose up verdaccio mongodb

# 2. Backend (in backend/ directory)
cp .env.example .env
# Edit .env: MONGODB_URI=mongodb://localhost:27017/myapp
npm install
npm run dev

# 3. Frontend (in frontend/ directory)
npm install  # Will install @myorg/ui from Verdaccio
npm run dev
```

---

## 6. Stopping the System

```bash
# Stop all services (keep data)
docker compose down

# Stop all services and remove volumes (destroys database!)
docker compose down -v

# Stop a specific service
docker compose stop backend
```

---

## 7. UI Library Development

```bash
cd my-platform/ui-library

# Install dependencies
npm install

# Development watch mode
npm run dev

# Run tests
npm test

# Open Storybook (http://localhost:6006)
npm run storybook

# Type check
npm run typecheck

# Lint
npm run lint

# Format
npm run format

# Full verification
npm run verify
```

### Adding a new component

1. Create `src/components/MyComponent/` directory
2. Create `MyComponent.tsx`, `MyComponent.css`, `index.ts`
3. Add test in `tests/MyComponent.test.tsx`
4. Add story in `stories/MyComponent.stories.tsx`
5. Export from `src/index.ts`

---

## 8. UI Library Versioning

The library follows [Semantic Versioning](https://semver.org):

| Change Type | Example | Version Bump |
|---|---|---|
| Bug fix (backward-compatible) | Fix button alignment | `0.1.0 → 0.1.1` |
| New feature (backward-compatible) | Add Badge component | `0.1.0 → 0.2.0` |
| Breaking change | Rename ButtonVariant | `0.1.0 → 1.0.0` |

**Workflow:**

```bash
# 1. Make changes in ui-library/
# 2. Update CHANGELOG.md
# 3. Verify
npm run verify

# 4. Update version in package.json (or use the publish script)
# 5. Tag in Git
git tag v0.2.0
git push origin v0.2.0

# 6. Publish to Verdaccio
node infrastructure/scripts/publish-ui.js 0.2.0
```

---

## 9. Publishing to Verdaccio

### Automated (recommended)

```bash
# Publish current version
node infrastructure/scripts/publish-ui.js

# Publish specific version (updates package.json automatically)
node infrastructure/scripts/publish-ui.js 0.2.0
```

### Manual

```bash
cd my-platform/ui-library
npm run build
npm publish --registry http://localhost:4873
```

### Verify publication

```bash
# Check package info
npm info @myorg/ui --registry http://localhost:4873

# List versions
npm view @myorg/ui versions --registry http://localhost:4873

# Browse in UI
open http://localhost:4873/-/web/detail/@myorg/ui
```

---

## 10. Installing UI Packages

The frontend `.npmrc` configures the `@myorg` scope to use Verdaccio:

```ini
@myorg:registry=http://localhost:4873
```

```bash
cd my-platform/frontend

# Install exact version (pinned in package.json)
npm install @myorg/ui@0.1.0

# Install a different version
npm install @myorg/ui@0.2.0

# Update to latest available
npm install @myorg/ui@latest
```

**In `package.json` (pinned exact version):**

```json
{
  "dependencies": {
    "@myorg/ui": "0.1.0"
  }
}
```

---

## 11. MongoDB Usage

### Connect from host (development)

```bash
# Using mongosh
mongosh mongodb://localhost:27017/myapp

# Using MongoDB Compass
# Connection string: mongodb://localhost:27017
```

### Mongo Express (web UI)

```
http://localhost:8081
Username: admin
Password: admin123
```

### Seed the database

```bash
# Via root script
node infrastructure/scripts/db-seed.js

# Direct via backend
cd backend && npm run db:seed
```

### Backup and restore

```bash
# Backup
docker exec myplatform-mongodb mongodump --out /tmp/backup
docker cp myplatform-mongodb:/tmp/backup ./backup

# Restore
docker cp ./backup myplatform-mongodb:/tmp/backup
docker exec myplatform-mongodb mongorestore /tmp/backup
```

---

## 12. Environment Variables

### Backend (`backend/.env.example`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `NODE_ENV` | No | `development` | Environment mode |
| `PORT` | No | `8080` | Server listen port |
| `HOST` | No | `0.0.0.0` | Server bind address |
| `MONGODB_URI` | **Yes** | — | MongoDB connection string |
| `DATABASE_NAME` | No | `myapp` | Database name |
| `CORS_ORIGINS` | No | `http://localhost:3000` | Allowed CORS origins |
| `LOG_LEVEL` | No | `info` | pino log level |

### Frontend (`frontend/.env.example`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `VITE_API_URL` | No | `http://localhost:8080` | Backend API base URL |
| `VITE_APP_NAME` | No | `MyPlatform` | App display name |

> **Security:** Never commit `.env` files. Always use `.env.example` as the template.

---

## 13. Testing

### Run all tests

```bash
# From repository root
node infrastructure/scripts/verify-all.js

# Individual projects
cd ui-library && npm test
cd frontend && npm test
cd backend && npm test
```

### Coverage

```bash
npm run test:coverage
```

### Watch mode (development)

```bash
npm run test:watch
```

---

## 14. Linting & Formatting

```bash
# Check (CI mode)
npm run lint
npm run format:check
npm run typecheck

# Fix automatically
npm run lint:fix
npm run format
```

---

## 15. Docker Commands

### PowerShell equivalents

```powershell
# Start all services
docker compose up --build

# Start detached
docker compose up -d --build

# Stop
docker compose down

# Stop and remove volumes
docker compose down -v

# View logs
docker compose logs

# Follow specific service logs
docker compose logs -f backend

# Check service status
docker compose ps

# Rebuild single service
docker compose up --build backend

# Enter container shell
docker exec -it myplatform-backend sh

# View container stats
docker stats

# List images
docker images myplatform/*
```

### Image naming (GCP-ready)

Current format: `myplatform/backend:latest`

Future GCP format: `REGION-docker.pkg.dev/PROJECT/REPO/backend:<git-sha>`

To tag for GCP:
```bash
$GIT_SHA = git rev-parse --short HEAD
docker tag myplatform/backend:latest `
  us-central1-docker.pkg.dev/my-project/my-repo/backend:$GIT_SHA
docker push us-central1-docker.pkg.dev/my-project/my-repo/backend:$GIT_SHA
```

---

## 16. Version Isolation Demo

This platform proves that multiple `@myorg/ui` versions can coexist in Verdaccio.

### Step 1: Publish both versions

```bash
# Publish v0.1.0
node infrastructure/scripts/publish-ui.js 0.1.0

# Modify ui-library (Badge is already in the code)
# Publish v0.2.0
node infrastructure/scripts/publish-ui.js 0.2.0
```

### Step 2: Verify both versions exist

```bash
npm view @myorg/ui versions --registry http://localhost:4873
# → ["0.1.0", "0.2.0"]
```

### Step 3: Frontend A uses v0.1.0

```bash
cd frontend
cat package.json | grep "@myorg/ui"
# → "@myorg/ui": "0.1.0"
```

### Step 4: Frontend B could use v0.2.0

Create a second frontend consuming the new version:

```bash
# In a separate directory
mkdir frontend-v2 && cd frontend-v2
npm init -y
echo "@myorg:registry=http://localhost:4873" > .npmrc
npm install @myorg/ui@0.2.0
# → Installs 0.2.0 successfully
# → 0.1.0 still available and unchanged in Verdaccio
```

### Step 5: Verify v0.1.0 still works

```bash
npm install @myorg/ui@0.1.0 --registry http://localhost:4873
# → Both versions resolve independently
```

**Result:** Publishing `0.2.0` does NOT affect consumers using `0.1.0`. Versions are immutable in Verdaccio (just like Artifact Registry).

---

## 17. Local CI Pipeline

Simulates what GitHub Actions will run:

```bash
# Run everything
node infrastructure/scripts/verify-all.js

# Or individually per project
cd ui-library
npm run typecheck
npm run lint
npm run format:check
npm test
npm run build

cd ../frontend
npm run typecheck
npm run lint
npm run format:check
npm test
npm run build

cd ../backend
npm run typecheck
npm run lint
npm run format:check
npm test
npm run build
```

---

## 18. Security

- `.env` files are in `.gitignore` — never committed
- `.env.example` shows required variables without secrets
- Containers run as non-root users
- nginx security headers (X-Frame-Options, CSP, etc.)
- MongoDB not exposed with authentication in local dev (use Atlas auth in prod)
- Dependency audit:
  ```bash
  node infrastructure/scripts/security-audit.js
  ```

---

## 19. Troubleshooting

### Frontend build fails — cannot find @myorg/ui

```bash
# Make sure Verdaccio is running and the package is published
docker compose up verdaccio
node infrastructure/scripts/publish-ui.js 0.1.0

# Rebuild frontend
docker compose up --build frontend
```

### Backend cannot connect to MongoDB

```bash
# Check MongoDB is healthy
docker compose ps mongodb

# Check backend logs
docker compose logs backend

# Verify MONGODB_URI uses 'mongodb' hostname (not localhost) in Docker
# MONGODB_URI=mongodb://mongodb:27017/myapp
```

### Port conflicts

```bash
# Check what's using the ports
netstat -ano | findstr :3000
netstat -ano | findstr :8080
netstat -ano | findstr :4873
netstat -ano | findstr :27017
```

### Verdaccio storage permission errors

```bash
# Remove and recreate the volume
docker compose down
docker volume rm myplatform-verdaccio-storage
docker compose up verdaccio
```

### Database is empty after restart

```bash
# Seed the database
node infrastructure/scripts/db-seed.js
```

### TypeScript errors in ui-library

```bash
# Clean build artifacts
cd ui-library && npm run clean && npm run build
```

---

## 20. GCP Migration Guide

The architecture is designed for zero-application-code changes when migrating to GCP.

| Local Component | GCP Component | Notes |
|---|---|---|
| Verdaccio | Google Artifact Registry (npm) | Change `.npmrc` registry URL |
| Local Docker images | Artifact Registry (Docker) | Change image tag format |
| Docker Compose | Cloud Run | One service → one Cloud Run service |
| `.env` files | Secret Manager | CI injects secrets from SM |
| Manual scripts | GitHub Actions | `verify-all.js` → CI workflow steps |
| Local MongoDB | MongoDB Atlas | Change `MONGODB_URI` only |
| nginx (frontend) | Cloud Run + load balancer | Same nginx config works |

### Migration steps

1. **npm Registry:** Update `.npmrc` from `http://localhost:4873` to `https://REGION-npm.pkg.dev/PROJECT/REPO/`
2. **Docker Images:** Retag and push: `docker tag myplatform/backend:latest REGION-docker.pkg.dev/PROJECT/REPO/backend:GIT_SHA`
3. **Secrets:** Move `.env` values to Secret Manager; Cloud Run accesses them as environment variables
4. **Database:** Change `MONGODB_URI` to Atlas connection string
5. **CI/CD:** Convert `verify-all.js` steps into GitHub Actions workflow YAML

**No changes required to:**
- React components
- Fastify route handlers
- MongoDB repository layer
- nginx configuration
- Docker multi-stage build files

---

*Built with ❤️ — local first, cloud ready.*
