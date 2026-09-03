import React from "react";
import "./Typography.css";

type TypographyVariant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "body1"
  | "body2"
  | "caption"
  | "overline"
  | "label"
  | "code";

type TypographyColor =
  "default" | "muted" | "primary" | "success" | "warning" | "error" | "inherit";

type TypographyAlign = "left" | "center" | "right" | "justify";

type TypographyWeight = "normal" | "medium" | "semibold" | "bold";

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  /** Semantic/style variant */
  variant?: TypographyVariant;
  /** Override the rendered HTML element */
  as?: React.ElementType;
  /** Color variant */
  color?: TypographyColor;
  /** Text alignment */
  align?: TypographyAlign;
  /** Font weight override */
  weight?: TypographyWeight;
  /** Truncate text with ellipsis */
  truncate?: boolean;
  children: React.ReactNode;
}

const variantElementMap: Record<TypographyVariant, React.ElementType> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  body1: "p",
  body2: "p",
  caption: "span",
  overline: "span",
  label: "span",
  code: "code",
};

export const Typography: React.FC<TypographyProps> = ({
  variant = "body1",
  as,
  color = "default",
  align,
  weight,
  truncate = false,
  children,
  className = "",
  ...props
}) => {
  const Component = as ?? variantElementMap[variant];

  const classes = [
    "myorg-text",
    `myorg-text--${variant}`,
    `myorg-text--color-${color}`,
    align ? `myorg-text--align-${align}` : "",
    weight ? `myorg-text--weight-${weight}` : "",
    truncate ? "myorg-text--truncate" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
};

Typography.displayName = "Typography";
