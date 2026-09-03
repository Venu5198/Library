import React, { useEffect, useCallback, useId } from "react";
import "./Modal.css";

export type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

export interface ModalProps {
  /** Whether the modal is visible */
  isOpen: boolean;
  /** Callback when modal should close */
  onClose: () => void;
  /** Modal title */
  title?: string;
  /** Modal size */
  size?: ModalSize;
  /** Whether clicking the backdrop closes the modal */
  closeOnBackdropClick?: boolean;
  /** Whether pressing Escape closes the modal */
  closeOnEsc?: boolean;
  /** Footer content (typically action buttons) */
  footer?: React.ReactNode;
  /** Hide the close button */
  hideCloseButton?: boolean;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  size = "md",
  closeOnBackdropClick = true,
  closeOnEsc = true,
  footer,
  hideCloseButton = false,
  children,
}) => {
  const titleId = useId();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (closeOnEsc && e.key === "Escape") {
        onClose();
      }
    },
    [closeOnEsc, onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      className="myorg-modal-overlay"
      onClick={closeOnBackdropClick ? onClose : undefined}
      aria-modal="true"
      role="dialog"
      aria-labelledby={title ? titleId : undefined}
    >
      <div
        className={`myorg-modal myorg-modal--${size}`}
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        {(title || !hideCloseButton) && (
          <div className="myorg-modal__header">
            {title && (
              <h2 id={titleId} className="myorg-modal__title">
                {title}
              </h2>
            )}
            {!hideCloseButton && (
              <button
                type="button"
                className="myorg-modal__close"
                onClick={onClose}
                aria-label="Close modal"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        )}
        <div className="myorg-modal__body">{children}</div>
        {footer && <div className="myorg-modal__footer">{footer}</div>}
      </div>
    </div>
  );
};

Modal.displayName = "Modal";
