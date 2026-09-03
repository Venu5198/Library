/**
 * @myorg/ui — Public API
 *
 * All exports from this file constitute the public API of the package.
 * Do NOT import internal files directly.
 *
 * Usage:
 *   import { Button, Card, Modal } from "@myorg/ui";
 *   import "@myorg/ui/styles";
 */

// Components
export { Button } from "./components/Button";
export type { ButtonProps, ButtonVariant, ButtonSize } from "./components/Button";

export { Input } from "./components/Input";
export type { InputProps, InputSize, InputVariant } from "./components/Input";

export { Card } from "./components/Card";
export type { CardProps, CardVariant } from "./components/Card";

export { Modal } from "./components/Modal";
export type { ModalProps, ModalSize } from "./components/Modal";

export { Typography } from "./components/Typography";
export type { TypographyProps } from "./components/Typography";

export { Container } from "./components/Container";
export type { ContainerProps, ContainerMaxWidth } from "./components/Container";

export { Badge } from "./components/Badge";
export type { BadgeProps, BadgeVariant, BadgeColorScheme } from "./components/Badge";

// Theme tokens
export { theme, colors, spacing, typography, borderRadius, shadows, transitions } from "./theme";
export type { Theme } from "./theme";
