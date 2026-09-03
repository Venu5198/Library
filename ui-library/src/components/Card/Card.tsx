import React from "react";
import "./Card.css";

export type CardVariant = "default" | "outlined" | "elevated" | "filled";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Visual variant */
  variant?: CardVariant;
  /** Padding size */
  padding?: "none" | "sm" | "md" | "lg";
  /** Make card interactive (hover/focus effects) */
  interactive?: boolean;
  /** Card header content */
  header?: React.ReactNode;
  /** Card footer content */
  footer?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = "default",
  padding = "md",
  interactive = false,
  header,
  footer,
  children,
  className = "",
  onClick,
  ...props
}) => {
  const classes = [
    "myorg-card",
    `myorg-card--${variant}`,
    `myorg-card--padding-${padding}`,
    interactive ? "myorg-card--interactive" : "",
    onClick ? "myorg-card--interactive" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const role = onClick || interactive ? "button" : undefined;
  const tabIndex = onClick || interactive ? 0 : undefined;

  return (
    <div
      className={classes}
      role={role}
      tabIndex={tabIndex}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick(e as unknown as React.MouseEvent<HTMLDivElement>);
              }
            }
          : undefined
      }
      {...props}
    >
      {header && <div className="myorg-card__header">{header}</div>}
      <div className="myorg-card__body">{children}</div>
      {footer && <div className="myorg-card__footer">{footer}</div>}
    </div>
  );
};

Card.displayName = "Card";
