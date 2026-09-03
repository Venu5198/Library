import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, Container, Typography, Badge } from "@myorg/ui";
import "@myorg/ui/styles";
import "./HomePage.css";

interface ArchitectureLayer {
  title: string;
  category: string;
  description: string;
  tags: string[];
  colorScheme: "primary" | "neutral" | "success" | "warning" | "error" | "info";
  stats: string;
}

const ARCHITECTURE_LAYERS: ArchitectureLayer[] = [
  {
    title: "@myorg/ui Component Library",
    category: "Design System",
    description:
      "A reusable, versioned React component library built with TypeScript and Vite. Published to private Verdaccio registry and consumed via exact semantic versioning.",
    tags: ["React 18", "TypeScript", "Vitest", "Storybook", "ESM/CJS"],
    colorScheme: "primary",
    stats: "46 Tests Passing",
  },
  {
    title: "FastAPI REST API Engine",
    category: "Backend Microservice",
    description:
      "High-throughput Python async backend powered by FastAPI, Motor async MongoDB driver, and Pydantic v2 schemas with automated health probes.",
    tags: ["FastAPI", "Python 3.11", "Motor", "Pydantic v2", "Pytest"],
    colorScheme: "info",
    stats: "5 Async Tests",
  },
  {
    title: "Private npm Registry (Verdaccio)",
    category: "Package Infrastructure",
    description:
      "Local npm registry simulating Google Artifact Registry. Supports semantic version coexistence (e.g. 0.1.0 and 0.2.0 simultaneously) and scoped package routing.",
    tags: ["Verdaccio 5", "Docker", "SemVer", "Multi-Version"],
    colorScheme: "info",
    stats: "Port 4873 Active",
  },
  {
    title: "Orchestration & Database",
    category: "Local Cloud Fabric",
    description:
      "Docker Compose network orchestrating MongoDB 7.0, Mongo Express UI, Frontend Nginx, FastAPI, and Verdaccio with automated healthchecks.",
    tags: ["Docker Compose", "MongoDB 7.0", "Nginx Alpine", "Non-Root"],
    colorScheme: "success",
    stats: "5/5 Services Healthy",
  },
];

const MIGRATION_MAPPINGS = [
  {
    component: "Custom UI Library",
    local: "Verdaccio Registry (http://localhost:4873)",
    gcp: "Google Artifact Registry (npm package format)",
    action: "Zero code changes, update .npmrc registry URL",
  },
  {
    component: "Backend REST API",
    local: "Docker Container (FastAPI + Uvicorn)",
    gcp: "Google Cloud Run (Managed Serverless Container)",
    action: "Push image to Artifact Registry, deploy to Cloud Run",
  },
  {
    component: "Frontend SPA",
    local: "Docker Container (Hardened Nginx Alpine)",
    gcp: "Google Cloud Run / Firebase App Hosting",
    action: "Deploy container with backend API URL injected",
  },
  {
    component: "Database",
    local: "MongoDB 7.0 (Docker Volume)",
    gcp: "MongoDB Atlas on Google Cloud Platform",
    action: "Store connection URI in Google Secret Manager",
  },
];

const QUICKSTART_COMMANDS = [
  {
    label: "1. Start All 5 Services",
    code: "cd infrastructure\ndocker compose up -d",
    description:
      "Launches FastAPI, Frontend Nginx, MongoDB, Verdaccio, and Mongo Express",
  },
  {
    label: "2. Publish UI Library Version",
    code: "node infrastructure/scripts/publish-ui.js 0.2.0",
    description:
      "Compiles TypeScript and publishes @myorg/ui to Verdaccio registry",
  },
  {
    label: "3. Verify Inside Container",
    code: "docker exec myplatform-frontend npm list @myorg/ui",
    description:
      "Inspects installed libraries directly inside the running Nginx container",
  },
];

export const HomePage: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="home-page fade-in">
      {/* Hero Section */}
      <section className="hero">
        <Container maxWidth="xl">
          <div className="hero__content">
            <div className="hero__badge-wrapper">
              <Badge colorScheme="primary" variant="subtle" pill>
                ⚡ Local-First Platform · GCP Production-Ready
              </Badge>
            </div>

            <Typography variant="h1" className="hero__title">
              Enterprise Full-Stack Architecture,{" "}
              <span className="hero__title-gradient">Built Locally First.</span>
            </Typography>

            <Typography variant="body1" className="hero__subtitle">
              Develop seamlessly with our custom versioned UI component library,
              high-performance FastAPI Python backend, MongoDB 7.0, and
              Verdaccio registry. Designed for zero-code-change migration to
              Google Cloud.
            </Typography>

            <div className="hero__actions">
              <Link to="/libraries">
                <Button variant="primary" size="lg">
                  Libraries &amp; Versions Inspector →
                </Button>
              </Link>
              <Link to="/examples">
                <Button variant="outline" size="lg">
                  Explore Live CRUD API
                </Button>
              </Link>
              <Link to="/components">
                <Button variant="ghost" size="lg">
                  UI Components
                </Button>
              </Link>
            </div>

            {/* Architecture Metrics Row */}
            <div className="hero__metrics-grid">
              <div className="metric-card">
                <span className="metric-card__badge">Package Registry</span>
                <div className="metric-card__value">@myorg/ui</div>
                <div className="metric-card__label">
                  Pinned v0.1.0 · Verdaccio
                </div>
              </div>
              <div className="metric-card">
                <span className="metric-card__badge">REST Engine</span>
                <div className="metric-card__value">FastAPI</div>
                <div className="metric-card__label">
                  Python 3.11 · Async Motor
                </div>
              </div>
              <div className="metric-card">
                <span className="metric-card__badge">Orchestration</span>
                <div className="metric-card__value">5 Containers</div>
                <div className="metric-card__label">Docker Compose Healthy</div>
              </div>
              <div className="metric-card">
                <span className="metric-card__badge">GCP Destination</span>
                <div className="metric-card__value">Cloud Run</div>
                <div className="metric-card__label">
                  Zero Code Change Target
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Bento Grid Architecture */}
      <section className="features-section">
        <Container maxWidth="xl">
          <div className="section-header">
            <Typography variant="overline" color="primary">
              System Architecture
            </Typography>
            <Typography variant="h2" className="section-title">
              Layered, Decoupled &amp; Independently Versioned
            </Typography>
            <Typography variant="body1" className="section-subtitle">
              Every component is isolated, tested in isolation, and ready for
              containerized deployment.
            </Typography>
          </div>

          <div className="bento-grid">
            {ARCHITECTURE_LAYERS.map((layer) => (
              <Card
                key={layer.title}
                variant="elevated"
                padding="lg"
                className="bento-card"
                header={
                  <div className="bento-card__header">
                    <div>
                      <span className="bento-card__category">
                        {layer.category}
                      </span>
                      <Typography variant="h5" className="bento-card__title">
                        {layer.title}
                      </Typography>
                    </div>
                    <Badge
                      colorScheme={layer.colorScheme}
                      variant="subtle"
                      pill
                    >
                      {layer.stats}
                    </Badge>
                  </div>
                }
              >
                <Typography variant="body2" className="bento-card__desc">
                  {layer.description}
                </Typography>
                <div className="bento-card__tags">
                  {layer.tags.map((tag) => (
                    <span key={tag} className="tech-chip">
                      {tag}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Developer Terminal Section */}
      <section className="terminal-section">
        <Container maxWidth="xl">
          <div className="terminal-card">
            <div className="terminal-header">
              <div className="terminal-dots">
                <span className="dot dot-red"></span>
                <span className="dot dot-yellow"></span>
                <span className="dot dot-green"></span>
              </div>
              <span className="terminal-title">
                Developer Workflow &amp; Container Inspection
              </span>
              <span className="terminal-env">
                local-environment · powershell / bash
              </span>
            </div>

            <div className="terminal-body">
              {QUICKSTART_COMMANDS.map((cmd, idx) => (
                <div key={cmd.label} className="terminal-step">
                  <div className="step-meta">
                    <span className="step-label">{cmd.label}</span>
                    <span className="step-desc">{cmd.description}</span>
                  </div>
                  <div className="code-row">
                    <pre className="code-text">{cmd.code}</pre>
                    <button
                      className="copy-btn"
                      onClick={() => handleCopy(cmd.code, idx)}
                      aria-label={`Copy command ${cmd.label}`}
                    >
                      {copiedIndex === idx ? "✓ Copied" : "Copy"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* GCP Migration Roadmap */}
      <section className="migration-section">
        <Container maxWidth="xl">
          <div className="section-header">
            <Typography variant="overline" color="primary">
              Cloud Migration Roadmap
            </Typography>
            <Typography variant="h2" className="section-title">
              Zero Architectural Changes to Deploy on Google Cloud
            </Typography>
            <Typography variant="body1" className="section-subtitle">
              How each local layer translates into Google Cloud Platform
              services.
            </Typography>
          </div>

          <div className="migration-table-wrapper">
            <table className="migration-table">
              <thead>
                <tr>
                  <th>Platform Layer</th>
                  <th>Local Development Component</th>
                  <th>Google Cloud Destination</th>
                  <th>Migration Strategy</th>
                </tr>
              </thead>
              <tbody>
                {MIGRATION_MAPPINGS.map((row) => (
                  <tr key={row.component}>
                    <td>
                      <strong>{row.component}</strong>
                    </td>
                    <td>
                      <code className="table-code">{row.local}</code>
                    </td>
                    <td>
                      <span className="gcp-pill">{row.gcp}</span>
                    </td>
                    <td className="strategy-cell">{row.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </section>
    </div>
  );
};
