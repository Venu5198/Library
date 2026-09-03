import React from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Card,
  Container,
  Typography,
  Badge,
} from "@myorg/ui";
import "@myorg/ui/styles";
import "./HomePage.css";

const FEATURE_CARDS = [
  {
    title: "@myorg/ui Component Library",
    description:
      "Independently versioned React components published to Verdaccio. Pin exact versions, upgrade deliberately.",
    tags: ["React", "TypeScript", "Vite"],
    colorScheme: "primary" as const,
  },
  {
    title: "Fastify REST API",
    description:
      "Type-safe backend with Zod validation, structured pino logging, and MongoDB repository pattern.",
    tags: ["Fastify", "Zod", "Pino"],
    colorScheme: "info" as const,
  },
  {
    title: "MongoDB + Verdaccio",
    description:
      "Persistent MongoDB data with Docker volumes. Verdaccio simulates Artifact Registry for npm packages.",
    tags: ["MongoDB", "Docker", "npm"],
    colorScheme: "success" as const,
  },
  {
    title: "GCP Migration Ready",
    description:
      "One command starts everything locally. Same architecture deploys to Cloud Run + Artifact Registry.",
    tags: ["Cloud Run", "GCP", "CI/CD"],
    colorScheme: "warning" as const,
  },
];

export const HomePage: React.FC = () => {
  return (
    <div className="home-page fade-in">
      {/* Hero Section */}
      <section className="hero">
        <Container maxWidth="lg">
          <div className="hero__content">
            <Badge colorScheme="primary" variant="subtle" pill>
              Local-first · Cloud-ready
            </Badge>
            <Typography variant="h1" className="hero__title">
              MyPlatform
            </Typography>
            <Typography variant="body1" color="muted" className="hero__subtitle">
              A complete local development platform — UI library, REST API, MongoDB, and Docker Compose.
              Designed for seamless migration to Google Cloud.
            </Typography>
            <div className="hero__actions">
              <Link to="/examples">
                <Button variant="primary" size="lg">
                  Browse Examples
                </Button>
              </Link>
              <Link to="/components">
                <Button variant="outline" size="lg">
                  View Components
                </Button>
              </Link>
            </div>
            <div className="hero__stats">
              <div className="hero__stat">
                <Typography variant="h3" color="primary">0.1.0</Typography>
                <Typography variant="caption" color="muted">UI Library Version</Typography>
              </div>
              <div className="hero__stat-divider" />
              <div className="hero__stat">
                <Typography variant="h3" color="primary">6+</Typography>
                <Typography variant="caption" color="muted">UI Components</Typography>
              </div>
              <div className="hero__stat-divider" />
              <div className="hero__stat">
                <Typography variant="h3" color="primary">4</Typography>
                <Typography variant="caption" color="muted">Docker Services</Typography>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Feature Grid */}
      <section className="features">
        <Container maxWidth="xl">
          <Typography variant="h2" align="center" className="section-title">
            Platform Architecture
          </Typography>
          <Typography variant="body1" color="muted" align="center" className="section-subtitle">
            Each layer is independently deployable and replaceable.
          </Typography>
          <div className="features__grid">
            {FEATURE_CARDS.map((card) => (
              <Card
                key={card.title}
                variant="default"
                padding="lg"
                header={
                  <div className="feature-card__header">
                    <Typography variant="h5">{card.title}</Typography>
                  </div>
                }
              >
                <Typography variant="body2" color="muted" className="feature-card__desc">
                  {card.description}
                </Typography>
                <div className="feature-card__tags">
                  {card.tags.map((tag) => (
                    <Badge key={tag} colorScheme={card.colorScheme} variant="subtle" pill>
                      {tag}
                    </Badge>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Quick Start */}
      <section className="quickstart">
        <Container maxWidth="lg">
          <Card variant="elevated" padding="lg">
            <Typography variant="h3" className="quickstart__title">
              Quick Start
            </Typography>
            <div className="quickstart__steps">
              <div className="quickstart__step">
                <span className="quickstart__step-num">1</span>
                <code className="quickstart__cmd">cd infrastructure</code>
                <Typography variant="caption" color="muted">Navigate to infra directory</Typography>
              </div>
              <div className="quickstart__step">
                <span className="quickstart__step-num">2</span>
                <code className="quickstart__cmd">docker compose up --build</code>
                <Typography variant="caption" color="muted">Start all services</Typography>
              </div>
              <div className="quickstart__step">
                <span className="quickstart__step-num">3</span>
                <code className="quickstart__cmd">node scripts/publish-ui.js</code>
                <Typography variant="caption" color="muted">Publish @myorg/ui to Verdaccio</Typography>
              </div>
            </div>
          </Card>
        </Container>
      </section>
    </div>
  );
};
