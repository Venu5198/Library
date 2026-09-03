import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Container } from "@myorg/ui";
import "./AppLayout.css";

const NAV_ITEMS = [
  { path: "/", label: "Home" },
  { path: "/libraries", label: "Libraries & Versions" },
  { path: "/examples", label: "Examples" },
  { path: "/status", label: "Status" },
  { path: "/components", label: "Components" },
];

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="app-layout">
      <header className="app-header">
        <Container maxWidth="xl">
          <nav className="app-nav" aria-label="Main navigation">
            <Link
              to="/"
              className="app-nav__brand"
              aria-label="MyPlatform home"
            >
              <div className="app-nav__logo" aria-hidden="true">
                M
              </div>
              <span className="app-nav__name">MyPlatform</span>
            </Link>
            <ul className="app-nav__links" role="list">
              {NAV_ITEMS.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={[
                      "app-nav__link",
                      location.pathname === item.path
                        ? "app-nav__link--active"
                        : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    aria-current={
                      location.pathname === item.path ? "page" : undefined
                    }
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="app-nav__status">
              <span className="status-dot" aria-hidden="true"></span>
              <span>FastAPI 8080</span>
              <span className="app-nav__version">v1.0.0</span>
            </div>
          </nav>
        </Container>
      </header>

      <main className="app-main" id="main-content">
        {children}
      </main>

      <footer className="app-footer">
        <Container maxWidth="xl">
          <div className="app-footer__inner">
            <p className="app-footer__text">
              MyPlatform — Local-First · Cloud-Ready · Powered by{" "}
              <strong>@myorg/ui@0.1.0</strong> &amp; <strong>FastAPI</strong>
            </p>
            <div className="app-footer__links">
              <a
                href="http://localhost:4873"
                target="_blank"
                rel="noopener noreferrer"
              >
                Verdaccio
              </a>
              <a
                href="http://localhost:8080/health"
                target="_blank"
                rel="noopener noreferrer"
              >
                FastAPI Health
              </a>
              <a
                href="http://localhost:8081"
                target="_blank"
                rel="noopener noreferrer"
              >
                Mongo Express
              </a>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
};
