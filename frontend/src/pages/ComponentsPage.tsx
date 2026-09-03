import React, { useState } from "react";
import {
  Button,
  Card,
  Modal,
  Input,
  Typography,
  Container,
  Badge,
} from "@myorg/ui";
import "./ComponentsPage.css";

export const ComponentsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [inputError, setInputError] = useState("");

  const handleInputSubmit = () => {
    if (!inputValue.trim()) {
      setInputError("This field cannot be empty.");
    } else {
      setInputError("");
      setIsModalOpen(true);
    }
  };

  return (
    <div className="components-page fade-in">
      <Container maxWidth="xl">
        <div className="components-page__header">
          <Typography variant="overline" color="primary">
            @myorg/ui@0.1.0
          </Typography>
          <Typography variant="h1">Component Library</Typography>
          <Typography variant="body1" color="muted">
            All components are independently versioned, published to Verdaccio,
            and consumed by this frontend via exact version pinning.
          </Typography>
        </div>

        <div className="components-page__sections">
          {/* Buttons */}
          <section className="component-section">
            <Card
              variant="default"
              padding="lg"
              header={
                <div className="section-header">
                  <Typography variant="h4">Button</Typography>
                  <Badge colorScheme="success" variant="subtle">
                    v0.1.0
                  </Badge>
                </div>
              }
            >
              <div className="component-row">
                <Typography variant="label" color="muted">
                  Variants
                </Typography>
                <div className="component-demo">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="danger">Danger</Button>
                </div>
              </div>
              <div className="component-row">
                <Typography variant="label" color="muted">
                  Sizes
                </Typography>
                <div className="component-demo component-demo--center">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                </div>
              </div>
              <div className="component-row">
                <Typography variant="label" color="muted">
                  States
                </Typography>
                <div className="component-demo">
                  <Button loading>Loading</Button>
                  <Button disabled>Disabled</Button>
                  <Button fullWidth>Full Width</Button>
                </div>
              </div>
            </Card>
          </section>

          {/* Inputs */}
          <section className="component-section">
            <Card
              variant="default"
              padding="lg"
              header={
                <div className="section-header">
                  <Typography variant="h4">Input</Typography>
                  <Badge colorScheme="success" variant="subtle">
                    v0.1.0
                  </Badge>
                </div>
              }
            >
              <div className="component-row">
                <div className="input-demo">
                  <Input
                    label="Email address"
                    type="email"
                    placeholder="you@example.com"
                    helperText="We'll never share your email."
                    fullWidth
                  />
                  <Input
                    label="Password"
                    type="text"
                    placeholder="Enter a value"
                    value={inputValue}
                    onChange={(e) => {
                      setInputValue(e.target.value);
                      if (e.target.value) setInputError("");
                    }}
                    error={inputError}
                    fullWidth
                  />
                  <Button variant="primary" onClick={handleInputSubmit}>
                    Submit (shows modal)
                  </Button>
                </div>
              </div>
            </Card>
          </section>

          {/* Badges */}
          <section className="component-section">
            <Card
              variant="default"
              padding="lg"
              header={
                <div className="section-header">
                  <Typography variant="h4">Badge</Typography>
                  <Badge colorScheme="success" variant="subtle">
                    v0.1.0
                  </Badge>
                </div>
              }
            >
              <div className="component-row">
                <Typography variant="label" color="muted">
                  Color Schemes
                </Typography>
                <div className="component-demo">
                  <Badge colorScheme="primary">Primary</Badge>
                  <Badge colorScheme="neutral">Neutral</Badge>
                  <Badge colorScheme="success">Success</Badge>
                  <Badge colorScheme="warning">Warning</Badge>
                  <Badge colorScheme="error">Error</Badge>
                  <Badge colorScheme="info">Info</Badge>
                </div>
              </div>
              <div className="component-row">
                <Typography variant="label" color="muted">
                  Variants
                </Typography>
                <div className="component-demo">
                  <Badge variant="subtle">Subtle</Badge>
                  <Badge variant="solid">Solid</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge pill>Pill</Badge>
                  <Badge dot colorScheme="success">
                    Online
                  </Badge>
                </div>
              </div>
            </Card>
          </section>

          {/* Typography */}
          <section className="component-section">
            <Card
              variant="default"
              padding="lg"
              header={
                <div className="section-header">
                  <Typography variant="h4">Typography</Typography>
                  <Badge colorScheme="success" variant="subtle">
                    v0.1.0
                  </Badge>
                </div>
              }
            >
              <div className="typography-demo">
                <Typography variant="h1">Heading 1 — 2.25rem/700</Typography>
                <Typography variant="h2">Heading 2 — 1.875rem/700</Typography>
                <Typography variant="h3">Heading 3 — 1.5rem/600</Typography>
                <Typography variant="h4">Heading 4 — 1.25rem/600</Typography>
                <Typography variant="body1">
                  Body 1 — Regular paragraph text at 1rem/400 with comfortable
                  line-height.
                </Typography>
                <Typography variant="body2">
                  Body 2 — Smaller body text at 0.875rem.
                </Typography>
                <Typography variant="caption">
                  Caption — 0.75rem, used for metadata and annotations.
                </Typography>
                <Typography variant="overline">
                  Overline — Uppercase label
                </Typography>
                <Typography variant="code">
                  {'const x = "code snippet"'}
                </Typography>
              </div>
            </Card>
          </section>

          {/* Cards */}
          <section className="component-section">
            <Card
              variant="default"
              padding="lg"
              header={
                <div className="section-header">
                  <Typography variant="h4">Card</Typography>
                  <Badge colorScheme="success" variant="subtle">
                    v0.1.0
                  </Badge>
                </div>
              }
            >
              <div className="cards-demo">
                <Card variant="default" padding="md">
                  <Typography variant="body2">Default Card</Typography>
                </Card>
                <Card variant="outlined" padding="md">
                  <Typography variant="body2">Outlined Card</Typography>
                </Card>
                <Card variant="elevated" padding="md">
                  <Typography variant="body2">Elevated Card</Typography>
                </Card>
                <Card variant="filled" padding="md">
                  <Typography variant="body2">Filled Card</Typography>
                </Card>
                <Card
                  variant="default"
                  padding="md"
                  interactive
                  onClick={() => setIsModalOpen(true)}
                >
                  <Typography variant="body2">
                    Interactive Card (click me)
                  </Typography>
                </Card>
              </div>
            </Card>
          </section>
        </div>
      </Container>

      {/* Modal demo */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Component Showcase"
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setIsModalOpen(false)}>
              Confirm
            </Button>
          </>
        }
      >
        <Typography variant="body1">
          This Modal is part of{" "}
          <Typography as="span" variant="code">
            @myorg/ui@0.1.0
          </Typography>
          . It supports ESC key, backdrop click, animations, and ARIA dialog
          semantics.
        </Typography>
        {inputValue && (
          <Typography
            variant="body2"
            color="muted"
            style={{ marginTop: "1rem" }}
          >
            You entered: <strong>{inputValue}</strong>
          </Typography>
        )}
      </Modal>
    </div>
  );
};
