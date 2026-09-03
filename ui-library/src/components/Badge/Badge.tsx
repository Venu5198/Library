import React from "react";
import "./Badge.css";

export type BadgeVariant = "solid" | "subtle" | "outline";
export type BadgeColorScheme =
  | "primary"
  | "neutral"
  | "success"
  | "warning"
  | "error"
  | "info";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Color scheme */
  colorScheme?: BadgeColorScheme;
  /** Visual style variant */
  variant?: BadgeVariant;
  /** Pill shape (fully rounded) */
  pill?: boolean;
  /** Show dot indicator */
  dot?: boolean;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  colorScheme = "primary",
  variant = "subtle",
  pill = false,
  dot = false,
  children,
  className = "",
  ...props
}) => {
  const classes = [
    "myorg-badge",
    `myorg-badge--${variant}`,
    `myorg-badge--${colorScheme}`,
    pill ? "myorg-badge--pill" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={classes} {...props}>
      {dot && <span className="myorg-badge__dot" aria-hidden="true" />}
      {children}
    </span>
  );
};

Badge.displayName = "Badge";
