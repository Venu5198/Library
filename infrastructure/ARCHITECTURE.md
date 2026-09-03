# MyPlatform — Architecture Documentation

## System Architecture

```mermaid
graph TB
    subgraph "Developer Machine"
        DEV[Developer]
        UL[ui-library<br/>@myorg/ui]
        FE[frontend<br/>React+Vite]
        BE[backend<br/>Fastify]
    end

    subgraph "Docker Compose Network"
        VD[Verdaccio<br/>:4873]
        FEC[frontend container<br/>nginx :3000]
        BEC[backend container<br/>Fastify :8080]
        MDB[MongoDB<br/>:27017]
        MEX[mongo-express<br/>:8081]
    end

    subgraph "Persistent Storage"
        VOL1[(verdaccio_storage)]
        VOL2[(mongodb_data)]
    end

    DEV -->|develops| UL
    UL -->|npm publish| VD
    VD --> VOL1

    VD -->|npm install @myorg/ui| FE
    FE -->|docker build| FEC

    BE -->|docker build| BEC
    BEC -->|queries| MDB
    MDB --> VOL2

    FEC -.->|API calls :8080| BEC
    MEX -.->|inspects| MDB

    DEV -->|http://localhost:3000| FEC
    DEV -->|http://localhost:8080| BEC
    DEV -->|http://localhost:4873| VD
    DEV -->|http://localhost:8081| MEX
```

---

## Package Publishing Flow

```mermaid
sequenceDiagram
    actor Dev as Developer
    participant UL as ui-library
    participant VD as Verdaccio
    participant FE as Frontend

    Dev->>UL: Edit components
    Dev->>UL: npm run verify
    UL-->>Dev: ✓ Tests pass
    Dev->>UL: Bump version (0.1.0 → 0.2.0)
    Dev->>UL: npm run build
    Dev->>VD: npm publish --registry http://localhost:4873
    VD-->>Dev: Published @myorg/ui@0.2.0

    Note over VD: Both 0.1.0 and 0.2.0 coexist

    Dev->>FE: npm install @myorg/ui@0.2.0
    FE->>VD: GET @myorg/ui@0.2.0
    VD-->>FE: ✓ Package delivered
    Dev->>FE: npm run build → docker build
```

---

## Frontend / Backend / Database Flow

```mermaid
graph LR
    Browser["Browser\nhttp://localhost:3000"]

    subgraph "Frontend Container (nginx)"
        R[React App]
        Pages["Pages:\nHome\nExamples\nStatus\nComponents"]
        APIService[API Service\nfetch VITE_API_URL]
    end

    subgraph "Backend Container (Fastify)"
        Routes["Routes:\nGET /health\nGET /api/examples\nPOST /api/examples\nPUT /api/examples/:id\nDELETE /api/examples/:id"]
        Controllers[Controllers]
        Services[Services]
        Repos[Repositories]
        Zod[Zod Validation]
    end

    subgraph "MongoDB"
        DB[(myapp db)]
        Col["examples collection\n+ text index\n+ tags index\n+ createdAt index"]
    end

    Browser --> R
    R --> Pages
    Pages --> APIService
    APIService -->|"HTTP :8080"| Routes
    Routes --> Zod
    Zod --> Controllers
    Controllers --> Services
    Services --> Repos
    Repos --> DB
    DB --> Col
```

---

## Version Isolation Architecture

```mermaid
graph TB
    subgraph "Verdaccio Registry"
        V010["@myorg/ui@0.1.0\n(Button, Input, Card, Modal,\nTypography, Container)"]
        V020["@myorg/ui@0.2.0\n(+ Badge component)"]
    end

    subgraph "Frontend A (this project)"
        FA["frontend\npackage.json:\n'@myorg/ui': '0.1.0'"]
    end

    subgraph "Frontend B (example)"
        FB["frontend-v2\npackage.json:\n'@myorg/ui': '0.2.0'"]
    end

    V010 -->|npm install| FA
    V020 -->|npm install| FB

    Note["✓ Versions are immutable\n✓ Publishing 0.2.0 does NOT affect\n  consumers of 0.1.0\n✓ Both versions resolvable\n  independently"]
```

---

## Local to GCP Migration Map

```mermaid
graph LR
    subgraph "Local (Current)"
        L1[Verdaccio :4873]
        L2[Local Docker Images]
        L3[Docker Compose]
        L4[.env files]
        L5[Node.js scripts]
        L6[Local MongoDB :27017]
    end

    subgraph "GCP (Future)"
        G1["Artifact Registry\n(npm)"]
        G2["Artifact Registry\n(Docker)"]
        G3["Cloud Run\n(per service)"]
        G4["Secret Manager"]
        G5["GitHub Actions"]
        G6["MongoDB Atlas"]
    end

    L1 -->|"Change .npmrc registry URL"| G1
    L2 -->|"docker tag + push\nwith git-sha tag"| G2
    L3 -->|"One service → one Cloud Run deployment\nNo code changes"| G3
    L4 -->|"Move secrets to SM\nCI injects via --set-secrets"| G4
    L5 -->|"Convert verify-all.js\nto workflow YAML steps"| G5
    L6 -->|"Change MONGODB_URI only\nRepository layer unchanged"| G6
```

---

## Layered Backend Architecture

```mermaid
graph TB
    HTTP["HTTP Request"]

    subgraph "Fastify Layer"
        Routes["Routes\n(example.routes.ts)"]
        ZodVal["Zod Validation\n(example.schema.ts)"]
        Health["Health Routes\n(/health, /health/live, /health/ready)"]
    end

    subgraph "Application Layer"
        Controllers["Controllers\n(example.controller.ts)"]
    end

    subgraph "Domain Layer"
        Services["Services\n(seed.service.ts)"]
        Repos["Repositories\n(example.repository.ts)"]
        Models["Models\n(example.model.ts)"]
    end

    subgraph "Infrastructure Layer"
        MongoDB["MongoDB Driver\n(database.ts)"]
        Config["Config\n(env.ts / Zod)"]
    end

    HTTP --> Routes
    Routes --> ZodVal
    ZodVal --> Controllers
    HTTP --> Health
    Controllers --> Services
    Services --> Repos
    Repos --> Models
    Models --> MongoDB
    Config --> MongoDB
```

---

## Container Architecture

```mermaid
graph LR
    subgraph "Backend Multi-stage Build"
        BD1["Stage 1: deps\nnode:20-alpine\nnpm ci"]
        BD2["Stage 2: builder\nnpm run build\n(tsc)"]
        BD3["Stage 3: runner\nnode:20-alpine\nnon-root user\nHEALTHCHECK"]
        BD1 -->|node_modules| BD2
        BD2 -->|dist/| BD3
    end

    subgraph "Frontend Multi-stage Build"
        FD1["Stage 1: deps\nnode:20-alpine\nnpm ci + @myorg/ui\nfrom Verdaccio"]
        FD2["Stage 2: builder\nnpm run build\n(vite)"]
        FD3["Stage 3: runner\nnginx:1.25-alpine\nSPA fallback\nSecurity headers"]
        FD1 -->|node_modules| FD2
        FD2 -->|dist/| FD3
    end
```
