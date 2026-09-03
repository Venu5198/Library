# Changelog

All notable changes to `@myorg/ui` will be documented in this file.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versioning follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.2.0] — 2024-01-15

### Added
- **Badge** component with `solid`, `subtle`, `outline` variants across 6 color schemes
- Badge `pill` prop for fully rounded shape
- Badge `dot` prop for status dot indicator
- Badge exported from package public API

### Changed
- Updated package exports to include Badge
- Improved Button focus-visible ring styling

---

## [0.1.0] — 2024-01-10

### Added
- **Button** component with 5 variants: `primary`, `secondary`, `outline`, `ghost`, `danger`
- **Input** component with label, helper text, error state, adornments
- **Card** component with header/body/footer slots and interactive mode
- **Modal** component with ESC key, backdrop click, animations
- **Typography** component with polymorphic `as` prop, 12 variants
- **Container** component with responsive max-width constraints
- Design token system (`theme/tokens.ts`)
- Storybook 8.x setup
- Vitest + Testing Library test suite
- ESLint + Prettier configuration
- Vite library mode build (ESM + CJS + TypeScript declarations)
- Verdaccio publish configuration

---

## [Unreleased]

_Future improvements planned:_
- Select/Dropdown component
- Checkbox, Radio components
- Toast/Notification system
- Table component
- Tabs component
- Dark mode support via CSS custom properties
