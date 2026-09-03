import React from "react";
import "./Container.css";

export type ContainerMaxWidth = "sm" | "md" | "lg" | "xl" | "2xl" | "full";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Maximum width constraint */
  maxWidth?: ContainerMaxWidth;
  /** Center content horizontally */
  centered?: boolean;
  /** Horizontal padding */
  padded?: boolean;
}

export const Container: React.FC<ContainerProps> = ({
  maxWidth = "xl",
  centered = true,
  padded = true,
  children,
  className = "",
  ...props
}) => {
  const classes = [
    "myorg-container",
    `myorg-container--${maxWidth}`,
    centered ? "myorg-container--centered" : "",
    padded ? "myorg-container--padded" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

Container.displayName = "Container";
