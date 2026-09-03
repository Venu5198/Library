import React, { useState } from "react";
import { Card, Container, Typography, Badge, Button, Input } from "@myorg/ui";
import "./LibrariesPage.css";

interface ComponentMeta {
  name: string;
  introducedIn: string;
  description: string;
  propsList: string[];
  status: "active" | "planned";
}

const COMPONENTS_INVENTORY: ComponentMeta[] = [
  {
    name: "Button",
    introducedIn: "0.1.0",
    description:
      "Multi-variant action control with loading states, sizes, and icon support.",
    propsList: [
      "variant ('primary' | 'secondary' | 'outline' | 'ghost' | 'danger')",
      "size ('sm' | 'md' | 'lg')",
      "disabled",
      "loading",
      "icon",
    ],
    status: "active",
  },
  {
    name: "Input",
    introducedIn: "0.1.0",
    description:
      "Accessible text input with validation error states, helper text, and clear buttons.",
    propsList: ["label", "error", "helperText", "disabled", "clearable"],
    status: "active",
  },
  {
    name: "Card",
    introducedIn: "0.1.0",
    description:
      "Flexible surface container with header, body, and footer slots.",
    propsList: [
      "variant ('default' | 'elevated' | 'bordered' | 'filled')",
      "padding ('none' | 'sm' | 'md' | 'lg')",
      "header",
      "footer",
    ],
    status: "active",
  },
  {
    name: "Modal",
    introducedIn: "0.1.0",
    description:
      "Accessible dialog with focus trap, ESC key dismissal, and backdrop blur.",
    propsList: [
      "isOpen",
      "onClose",
      "title",
      "footer",
      "closeOnEsc",
      "closeOnBackdropClick",
    ],
    status: "active",
  },
  {
    name: "Typography",
    introducedIn: "0.1.0",
    description: "Semantic typography component enforcing design token scales.",
    propsList: [
      "variant ('h1'-'h6' | 'body1' | 'body2' | 'caption' | 'overline' | 'code')",
      "color",
      "align",
      "as",
    ],
    status: "active",
  },
  {
    name: "Container",
    introducedIn: "0.1.0",
    description: "Responsive max-width layout wrapper.",
    propsList: [
      "maxWidth ('sm' | 'md' | 'lg' | 'xl' | 'full')",
      "disableGutters",
    ],
    status: "active",
  },
  {
    name: "Badge",
    introducedIn: "0.2.0",
    description:
      "Status indicator pill with multiple semantic color schemes and dot indicators.",
    propsList: [
      "colorScheme ('primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral')",
      "variant ('solid' | 'subtle' | 'outline')",
      "pill",
      "dot",
    ],
    status: "active",
  },
];

const VERSION_HISTORY = [
  {
    version: "0.1.0",
    date: "2026-09-03",
    tag: "Initial Release",
    highlights: [
      "Core components: Button, Input, Card, Modal, Typography, Container",
      "Dual ESM/CJS packaging with full TypeScript definitions",
      "Vitest test suite with 40 unit tests",
    ],
  },
  {
    version: "0.2.0",
    date: "2026-09-03",
    tag: "Feature Update",
    highlights: [
      "Added Badge component with 6 semantic color schemes and dot indicator",
      "Enhanced focus outlines for accessibility (WCAG 2.1 AA)",
      "Coexists in Verdaccio registry simultaneously with 0.1.0",
    ],
  },
  {
    version: "0.3.0",
    date: "Upcoming",
    tag: "Planned",
    highlights: [
      "Planned Tooltip and Alert banner components",
      "Enhanced dark mode token integration",
    ],
  },
];

export const LibrariesPage: React.FC = () => {
  // Live component test state
  const [buttonVariant, setButtonVariant] = useState<
    "primary" | "secondary" | "outline" | "ghost" | "danger"
  >("primary");
  const [buttonSize, setButtonSize] = useState<"sm" | "md" | "lg">("md");
  const [badgeScheme, setBadgeScheme] = useState<
    "primary" | "neutral" | "success" | "warning" | "error" | "info"
  >("success");
  const [badgeVariant, setBadgeVariant] = useState<
    "solid" | "subtle" | "outline"
  >("subtle");
  const [inputVal, setInputVal] = useState("Live test value");
  const [hasInputError, setHasInputError] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const uiVersion =
    typeof __UI_LIB_VERSION__ !== "undefined" ? __UI_LIB_VERSION__ : "0.1.0";
  const dependencies =
    typeof __DEPENDENCIES__ !== "undefined" ? __DEPENDENCIES__ : {};
  const devDependencies =
    typeof __DEV_DEPENDENCIES__ !== "undefined" ? __DEV_DEPENDENCIES__ : {};
  const buildTime =
    typeof __BUILD_TIMESTAMP__ !== "undefined"
      ? new Date(__BUILD_TIMESTAMP__).toLocaleString()
      : "Live Dev";

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(text);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <div className="libraries-page fade-in">
      <Container maxWidth="xl">
        {/* Page Header */}
        <div className="lib-header">
          <Badge colorScheme="primary" variant="subtle" pill>
            Runtime &amp; Build Inspector
          </Badge>
          <Typography variant="h1" className="lib-title">
            Installed Libraries &amp; Component Versions
          </Typography>
          <Typography variant="body1" className="lib-subtitle">
            Inspect live package versions, component APIs, and registry
            provenance. Changes to libraries or versions are dynamically
            reflected here.
          </Typography>
        </div>

        {/* Featured Custom UI Library Banner */}
        <Card variant="elevated" padding="lg" className="ui-featured-card">
          <div className="ui-featured-header">
            <div className="ui-featured-title-group">
              <div className="ui-lib-avatar">UI</div>
              <div>
                <div className="ui-lib-tag">Custom Shared Library</div>
                <Typography variant="h3" className="ui-lib-name">
                  @myorg/ui
                </Typography>
              </div>
            </div>
            <div className="ui-version-badge-group">
              <Badge colorScheme="primary" variant="solid" pill>
                Active: v{uiVersion}
              </Badge>
              <Badge colorScheme="info" variant="subtle" pill>
                Registry: Verdaccio
              </Badge>
            </div>
          </div>

          <div className="ui-featured-grid">
            <div className="ui-feat-stat">
              <span className="stat-label">Installed Version</span>
              <span className="stat-value mono">v{uiVersion}</span>
              <span className="stat-sub">Pinned in package.json</span>
            </div>
            <div className="ui-feat-stat">
              <span className="stat-label">Registry Provenance</span>
              <span className="stat-value">Verdaccio</span>
              <span className="stat-sub">http://localhost:4873</span>
            </div>
            <div className="ui-feat-stat">
              <span className="stat-label">Build Formats</span>
              <span className="stat-value">Dual ESM / CJS</span>
              <span className="stat-sub">dist/index.js &amp; index.cjs</span>
            </div>
            <div className="ui-feat-stat">
              <span className="stat-label">Type Definitions</span>
              <span className="stat-value">TypeScript</span>
              <span className="stat-sub">dist/index.d.ts included</span>
            </div>
          </div>
        </Card>

        {/* Live Interactive Component Playground */}
        <div className="section-title-wrap">
          <Typography variant="h2">Interactive Component Playground</Typography>
          <Typography variant="body2" color="muted">
            Test and tweak components from{" "}
            <Typography as="span" variant="code">
              @myorg/ui
            </Typography>{" "}
            in real time.
          </Typography>
        </div>

        <div className="playground-grid">
          {/* Button Playground */}
          <Card variant="default" padding="md" className="play-card">
            <Typography variant="h5" className="play-card__title">
              Button Component
            </Typography>
            <div className="play-preview">
              <Button variant={buttonVariant} size={buttonSize}>
                Interactive Button
              </Button>
            </div>
            <div className="play-controls">
              <div className="control-group">
                <label className="control-label">Variant:</label>
                <div className="chip-options">
                  {(
                    [
                      "primary",
                      "secondary",
                      "outline",
                      "ghost",
                      "danger",
                    ] as const
                  ).map((v) => (
                    <button
                      key={v}
                      type="button"
                      className={`pill-btn ${buttonVariant === v ? "active" : ""}`}
                      onClick={() => setButtonVariant(v)}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
              <div className="control-group">
                <label className="control-label">Size:</label>
                <div className="chip-options">
                  {(["sm", "md", "lg"] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={`pill-btn ${buttonSize === s ? "active" : ""}`}
                      onClick={() => setButtonSize(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Badge Playground */}
          <Card variant="default" padding="md" className="play-card">
            <Typography variant="h5" className="play-card__title">
              Badge Component
            </Typography>
            <div className="play-preview">
              <Badge colorScheme={badgeScheme} variant={badgeVariant} pill dot>
                {badgeScheme.toUpperCase()} BADGE
              </Badge>
            </div>
            <div className="play-controls">
              <div className="control-group">
                <label className="control-label">Color Scheme:</label>
                <div className="chip-options">
                  {(
                    [
                      "primary",
                      "success",
                      "warning",
                      "error",
                      "info",
                      "neutral",
                    ] as const
                  ).map((scheme) => (
                    <button
                      key={scheme}
                      type="button"
                      className={`pill-btn ${badgeScheme === scheme ? "active" : ""}`}
                      onClick={() => setBadgeScheme(scheme)}
                    >
                      {scheme}
                    </button>
                  ))}
                </div>
              </div>
              <div className="control-group">
                <label className="control-label">Variant:</label>
                <div className="chip-options">
                  {(["solid", "subtle", "outline"] as const).map((v) => (
                    <button
                      key={v}
                      type="button"
                      className={`pill-btn ${badgeVariant === v ? "active" : ""}`}
                      onClick={() => setBadgeVariant(v)}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Input Playground */}
          <Card variant="default" padding="md" className="play-card">
            <Typography variant="h5" className="play-card__title">
              Input Component
            </Typography>
            <div className="play-preview" style={{ width: "100%" }}>
              <Input
                label="Custom Input"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                error={
                  hasInputError
                    ? "This field has a validation error!"
                    : undefined
                }
                helperText={
                  !hasInputError ? "Type something to test state." : undefined
                }
                placeholder="Enter text..."
              />
            </div>
            <div className="play-controls">
              <div className="control-group">
                <label className="control-label">Simulate Error:</label>
                <button
                  type="button"
                  className={`pill-btn ${hasInputError ? "active" : ""}`}
                  onClick={() => setHasInputError(!hasInputError)}
                >
                  {hasInputError ? "Error: ON" : "Error: OFF"}
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* Component Inventory Table */}
        <div className="section-title-wrap">
          <Typography variant="h2">Component Inventory in @myorg/ui</Typography>
          <Typography variant="body2" color="muted">
            All 7 modular components exported by the custom library.
          </Typography>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Component</th>
                <th>Introduced</th>
                <th>Description</th>
                <th>Key Supported Props</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {COMPONENTS_INVENTORY.map((comp) => (
                <tr key={comp.name}>
                  <td>
                    <code className="component-pill">
                      &lt;{comp.name} /&gt;
                    </code>
                  </td>
                  <td>
                    <span className="mono-ver">v{comp.introducedIn}</span>
                  </td>
                  <td className="desc-cell">{comp.description}</td>
                  <td>
                    <div className="props-list">
                      {comp.propsList.map((p) => (
                        <span key={p} className="prop-tag">
                          {p}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <Badge colorScheme="success" variant="subtle" pill dot>
                      Ready
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* All Dependencies Matrix */}
        <div className="section-title-wrap">
          <Typography variant="h2">
            All Installed Packages &amp; Dependencies
          </Typography>
          <Typography variant="body2" color="muted">
            Compiled build timestamp: <strong>{buildTime}</strong>
          </Typography>
        </div>

        <div className="deps-grid">
          {/* Production Dependencies */}
          <Card variant="elevated" padding="md" className="deps-card">
            <Typography variant="h4" className="deps-card__heading">
              Production Dependencies ({Object.keys(dependencies).length})
            </Typography>
            <div className="deps-list">
              {Object.entries(dependencies).map(([pkg, ver]) => (
                <div key={pkg} className="dep-item">
                  <span className="dep-name">{pkg}</span>
                  <span className="dep-ver">{ver}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Dev Dependencies */}
          <Card variant="elevated" padding="md" className="deps-card">
            <Typography variant="h4" className="deps-card__heading">
              Build &amp; Test Tooling ({Object.keys(devDependencies).length})
            </Typography>
            <div className="deps-list">
              {Object.entries(devDependencies).map(([pkg, ver]) => (
                <div key={pkg} className="dep-item">
                  <span className="dep-name">{pkg}</span>
                  <span className="dep-ver">{ver}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Version Change & Upgrade Playbook */}
        <div className="section-title-wrap">
          <Typography variant="h2">How to Change Library Versions</Typography>
          <Typography variant="body2" color="muted">
            Step-by-step commands to switch versions or publish updates.
          </Typography>
        </div>

        <div className="playbook-grid">
          <Card variant="default" padding="lg" className="playbook-card">
            <Typography variant="h5" className="playbook-title">
              1. Upgrade Frontend to @myorg/ui@0.2.0
            </Typography>
            <Typography variant="body2" color="muted" className="playbook-desc">
              To upgrade this frontend to consume the newer version published in
              Verdaccio:
            </Typography>
            <div className="code-box">
              <code>
                {`cd "c:\\devops\\new project\\my-platform\\frontend"\nnpm install @myorg/ui@0.2.0\nnpm run build`}
              </code>
              <button
                type="button"
                className="code-copy"
                onClick={() =>
                  handleCopy(
                    "cd frontend; npm install @myorg/ui@0.2.0; npm run build",
                  )
                }
              >
                {copiedCmd?.includes("0.2.0") ? "✓ Copied" : "Copy"}
              </button>
            </div>
          </Card>

          <Card variant="default" padding="lg" className="playbook-card">
            <Typography variant="h5" className="playbook-title">
              2. Publish New Version (e.g. 0.3.0)
            </Typography>
            <Typography variant="body2" color="muted" className="playbook-desc">
              To add new components or fixes and publish under a new version:
            </Typography>
            <div className="code-box">
              <code>
                {`cd "c:\\devops\\new project\\my-platform\\infrastructure"\nnode scripts/publish-ui.js 0.3.0`}
              </code>
              <button
                type="button"
                className="code-copy"
                onClick={() =>
                  handleCopy("node infrastructure/scripts/publish-ui.js 0.3.0")
                }
              >
                {copiedCmd?.includes("publish-ui") ? "✓ Copied" : "Copy"}
              </button>
            </div>
          </Card>
        </div>

        {/* Multi-Version Coexistence Timeline */}
        <div className="section-title-wrap">
          <Typography variant="h2">
            Multi-Version Coexistence Timeline
          </Typography>
          <Typography variant="body2" color="muted">
            How previous and current versions coexist in Verdaccio registry.
          </Typography>
        </div>

        <div className="timeline-wrap">
          {VERSION_HISTORY.map((vh) => (
            <div key={vh.version} className="timeline-item">
              <div className="timeline-marker"></div>
              <div className="timeline-content">
                <div className="timeline-head">
                  <Typography variant="h5" className="timeline-ver">
                    v{vh.version}
                  </Typography>
                  <Badge
                    colorScheme={
                      vh.version === uiVersion ? "primary" : "neutral"
                    }
                    variant="subtle"
                    pill
                  >
                    {vh.version === uiVersion
                      ? "Currently Active in Frontend"
                      : vh.tag}
                  </Badge>
                  <span className="timeline-date">{vh.date}</span>
                </div>
                <ul className="timeline-bullets">
                  {vh.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
};
