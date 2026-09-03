# @myorg/ui

> MyOrg shared React UI component library — independently versioned, published to Verdaccio locally and Google Artifact Registry in production.

## Installation

```bash
# From local Verdaccio registry
npm install @myorg/ui@0.1.0

# Ensure .npmrc points @myorg scope to registry
# @myorg:registry=http://localhost:4873
```

## Usage

```tsx
import { Button, Card, Modal, Input, Typography, Container } from "@myorg/ui";
import "@myorg/ui/styles";

function App() {
  return (
    <Container maxWidth="lg">
      <Typography variant="h1">Hello World</Typography>
      <Button variant="primary" size="md">Click me</Button>
      <Input label="Email" type="email" />
    </Container>
  );
}
```

## Components

| Component | Description |
|---|---|
| `Button` | Clickable action with 5 variants, 3 sizes, loading state |
| `Input` | Form input with label, error, helper text, adornments |
| `Card` | Content container with header/footer slots |
| `Modal` | Accessible dialog overlay with animations |
| `Typography` | Text renderer with 12 semantic variants |
| `Container` | Layout width constraint with responsive padding |
| `Badge` | Small status indicator (v0.2.0+) |

## Development

```bash
npm install
npm run dev          # Watch mode build
npm run test         # Run tests
npm run storybook    # Open Storybook at http://localhost:6006
npm run build        # Production build
npm run lint         # ESLint
npm run typecheck    # TypeScript check
```

## Versioning & Publishing

See the [infrastructure README](../infrastructure/README.md) for the full publishing workflow.

```bash
# 1. Update version in package.json
# 2. Run verify
npm run verify
# 3. Build
npm run build
# 4. Publish to Verdaccio
npm publish
# 5. Tag in Git
git tag v0.1.0
git push origin v0.1.0
```

## License

MIT
