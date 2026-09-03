import React, { forwardRef, useId } from "react";
import "./Input.css";

export type InputSize = "sm" | "md" | "lg";
export type InputVariant = "default" | "filled" | "flushed";

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Label for the input field */
  label?: string;
  /** Helper text shown below input */
  helperText?: string;
  /** Error message (shows error state when set) */
  error?: string;
  /** Size variant */
  size?: InputSize;
  /** Visual variant */
  variant?: InputVariant;
  /** Left adornment icon/element */
  leftAdornment?: React.ReactNode;
  /** Right adornment icon/element */
  rightAdornment?: React.ReactNode;
  /** Render as full-width block */
  fullWidth?: boolean;
  /** Mark field as required visually */
  required?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      size = "md",
      variant = "default",
      leftAdornment,
      rightAdornment,
      fullWidth = false,
      required = false,
      id: externalId,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = externalId ?? generatedId;
    const helperId = `${id}-helper`;
    const errorId = `${id}-error`;
    const hasError = Boolean(error);

    const wrapperClasses = ["myorg-input-wrapper", fullWidth ? "myorg-input-wrapper--full-width" : ""]
      .filter(Boolean)
      .join(" ");

    const fieldClasses = [
      "myorg-input-field",
      `myorg-input-field--${size}`,
      `myorg-input-field--${variant}`,
      hasError ? "myorg-input-field--error" : "",
      disabled ? "myorg-input-field--disabled" : "",
      leftAdornment ? "myorg-input-field--has-left" : "",
      rightAdornment ? "myorg-input-field--has-right" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={wrapperClasses}>
        {label && (
          <label className="myorg-input-label" htmlFor={id}>
            {label}
            {required && (
              <span className="myorg-input-required" aria-hidden="true">
                {" "}
                *
              </span>
            )}
          </label>
        )}
        <div className="myorg-input-container">
          {leftAdornment && (
            <span className="myorg-input-adornment myorg-input-adornment--left" aria-hidden="true">
              {leftAdornment}
            </span>
          )}
          <input
            ref={ref}
            id={id}
            className={fieldClasses}
            disabled={disabled}
            required={required}
            aria-invalid={hasError}
            aria-describedby={
              [hasError ? errorId : null, helperText ? helperId : null]
                .filter(Boolean)
                .join(" ") || undefined
            }
            {...props}
          />
          {rightAdornment && (
            <span className="myorg-input-adornment myorg-input-adornment--right" aria-hidden="true">
              {rightAdornment}
            </span>
          )}
        </div>
        {hasError && (
          <p id={errorId} className="myorg-input-error" role="alert">
            {error}
          </p>
        )}
        {!hasError && helperText && (
          <p id={helperId} className="myorg-input-helper">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
