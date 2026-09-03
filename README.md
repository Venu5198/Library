# MyPlatform — Local-First Full-Stack Platform

> A complete, production-grade local development and deployment platform architected for zero-code-change migration to Google Cloud Platform (Cloud Run, Artifact Registry, MongoDB Atlas, Secret Manager).

---

## Repository Structure

| Directory | Description | Technology |
|---|---|---|
| [`ui-library/`](./ui-library) | Reusable UI Component Library (`@myorg/ui`) | React 18, TypeScript, Vite library mode, Vitest, Storybook |
| [`frontend/`](./frontend) | Frontend SPA Application | React 18, Vite, React Router 6, Nginx |
| [`backend/`](./backend) | Layered REST API | Fastify, TypeScript, Zod, MongoDB, Pino |
| [`infrastructure/`](./infrastructure) | Local Orchestration & Runbooks | Docker Compose, Verdaccio 5, MongoDB 7, Mongo Express |
| [`dummy-lib/`](./dummy-lib) | Sample Utility Library (`@myorg/dummy-lib`) | TypeScript, Verdaccio published |
| [`dummy-consumer/`](./dummy-consumer) | Sample Consumer Project | Node.js, installs from Verdaccio |

---

## Services Overview

When running locally via Docker Compose:

- **Frontend Application**: [http://localhost:3000](http://localhost:3000)
- **Backend REST API**: [http://localhost:8080](http://localhost:8080)
- **API Health Check**: [http://localhost:8080/health](http://localhost:8080/health)
- **Verdaccio npm Registry**: [http://localhost:4873](http://localhost:4873)
- **Mongo Express UI**: [http://localhost:8081](http://localhost:8081)
- **MongoDB**: `mongodb://localhost:27017`

---

## Quick Start

```bash
# 1. Navigate to infrastructure
cd infrastructure

# 2. Start all services via Docker Compose
docker compose up -d

# 3. Publish the UI library to local Verdaccio registry
node scripts/publish-ui.js

# 4. Open the frontend
# Browse to http://localhost:3000
```

For complete documentation, refer to the [infrastructure runbook](./infrastructure/README.md) and [architecture diagrams](./infrastructure/ARCHITECTURE.md).
