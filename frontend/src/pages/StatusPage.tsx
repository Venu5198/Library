import React from "react";
import { Card, Container, Typography, Badge } from "@myorg/ui";
import { useApi } from "../hooks/useApi";
import { getHealth } from "../services/api";
import { appConfig } from "../config/app";
import "./StatusPage.css";

export const StatusPage: React.FC = () => {
  const { data, loading, error, refetch } = useApi(getHealth, []);

  return (
    <div className="status-page fade-in">
      <Container maxWidth="lg">
        <div className="status-page__header">
          <Typography variant="h1">System Status</Typography>
          <Typography variant="body1" color="muted">
            Real-time health of all platform services.
          </Typography>
        </div>

        <div className="status-cards">
          {/* Backend API */}
          <Card
            variant="default"
            padding="md"
            header={
              <div className="status-card__header">
                <Typography variant="h5">Backend API</Typography>
                {loading ? (
                  <Badge colorScheme="neutral">Checking...</Badge>
                ) : error ? (
                  <Badge colorScheme="error" dot>
                    Unreachable
                  </Badge>
                ) : data?.status === "healthy" ? (
                  <Badge colorScheme="success" dot>
                    Healthy
                  </Badge>
                ) : (
                  <Badge colorScheme="warning" dot>
                    Degraded
                  </Badge>
                )}
              </div>
            }
          >
            {loading && (
              <Typography variant="body2" color="muted">
                Fetching health data...
              </Typography>
            )}
            {error && (
              <Typography variant="body2" color="error">
                Cannot reach {appConfig.apiUrl}/health. Is the backend container
                running?
              </Typography>
            )}
            {data && !loading && (
              <div className="status-details">
                <StatusRow label="URL" value={appConfig.apiUrl} />
                <StatusRow label="Environment" value={data.environment} />
                <StatusRow label="Version" value={data.version} />
                <StatusRow label="Uptime" value={`${data.uptime}s`} />
                <StatusRow
                  label="Timestamp"
                  value={new Date(data.timestamp).toLocaleString()}
                />
              </div>
            )}
            <button className="status-refresh" onClick={refetch} type="button">
              ↻ Refresh
            </button>
          </Card>

          {/* MongoDB */}
          <Card
            variant="default"
            padding="md"
            header={
              <div className="status-card__header">
                <Typography variant="h5">MongoDB</Typography>
                {loading ? (
                  <Badge colorScheme="neutral">Checking...</Badge>
                ) : data?.database?.connected ? (
                  <Badge colorScheme="success" dot>
                    Connected
                  </Badge>
                ) : (
                  <Badge colorScheme="error" dot>
                    Disconnected
                  </Badge>
                )}
              </div>
            }
          >
            {data && (
              <div className="status-details">
                <StatusRow
                  label="Connected"
                  value={data.database.connected ? "Yes" : "No"}
                />
                <StatusRow label="Host (Docker)" value="mongodb:27017" />
                <StatusRow label="Host (local)" value="localhost:27017" />
                <StatusRow label="Database" value="myapp" />
              </div>
            )}
          </Card>

          {/* Verdaccio */}
          <Card
            variant="default"
            padding="md"
            header={
              <div className="status-card__header">
                <Typography variant="h5">Verdaccio Registry</Typography>
                <Badge colorScheme="info" dot>
                  External
                </Badge>
              </div>
            }
          >
            <div className="status-details">
              <StatusRow label="URL" value="http://localhost:4873" />
              <StatusRow label="Scope" value="@myorg" />
              <StatusRow label="Package" value="@myorg/ui" />
              <StatusRow label="Versions" value="0.1.0, 0.2.0" />
            </div>
            <a
              href="http://localhost:4873"
              target="_blank"
              rel="noopener noreferrer"
              className="status-link"
            >
              Open Registry →
            </a>
          </Card>

          {/* Frontend */}
          <Card
            variant="default"
            padding="md"
            header={
              <div className="status-card__header">
                <Typography variant="h5">Frontend</Typography>
                <Badge colorScheme="success" dot>
                  Running
                </Badge>
              </div>
            }
          >
            <div className="status-details">
              <StatusRow label="URL" value="http://localhost:3000" />
              <StatusRow label="@myorg/ui version" value="0.1.0" />
              <StatusRow label="Framework" value="React 18 + Vite" />
              <StatusRow label="Server" value="nginx (Docker)" />
            </div>
          </Card>
        </div>

        {/* Version isolation note */}
        <Card variant="filled" padding="md" className="version-note">
          <Typography variant="h5" style={{ marginBottom: "0.5rem" }}>
            Version Isolation Demo
          </Typography>
          <Typography variant="body2" color="muted">
            This frontend consumes{" "}
            <Typography as="span" variant="code">
              @myorg/ui@0.1.0
            </Typography>
            . Version{" "}
            <Typography as="span" variant="code">
              @myorg/ui@0.2.0
            </Typography>{" "}
            (with Badge component) is also published to Verdaccio and can be
            consumed independently by another frontend. Both versions coexist in
            the registry without conflicts.
          </Typography>
        </Card>
      </Container>
    </div>
  );
};

function StatusRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="status-row">
      <Typography variant="label" color="muted">
        {label}
      </Typography>
      <Typography variant="body2" className="status-row__value">
        {value}
      </Typography>
    </div>
  );
}
