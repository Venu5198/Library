import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AppLayout } from "./layouts/AppLayout";

// Mock @myorg/ui — in tests we don't need Verdaccio
vi.mock("@myorg/ui", () => ({
  Container: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  Button: ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
  }) => <button onClick={onClick}>{children}</button>,
  Badge: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
  Card: ({
    children,
    header,
  }: {
    children: React.ReactNode;
    header?: React.ReactNode;
  }) => (
    <div>
      {header}
      {children}
    </div>
  ),
  Typography: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
  Modal: ({
    children,
    isOpen,
  }: {
    children: React.ReactNode;
    isOpen: boolean;
  }) => (isOpen ? <div role="dialog">{children}</div> : null),
  Input: ({
    label,
    ...props
  }: { label?: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
    <div>
      <label>
        {label}
        <input {...props} />
      </label>
    </div>
  ),
}));

describe("AppLayout", () => {
  it("renders navigation links", () => {
    render(
      <MemoryRouter>
        <AppLayout>
          <div>Content</div>
        </AppLayout>
      </MemoryRouter>,
    );
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Examples")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Components")).toBeInTheDocument();
  });

  it("renders children content", () => {
    render(
      <MemoryRouter>
        <AppLayout>
          <div>Test child content</div>
        </AppLayout>
      </MemoryRouter>,
    );
    expect(screen.getByText("Test child content")).toBeInTheDocument();
  });

  it("renders brand name", () => {
    render(
      <MemoryRouter>
        <AppLayout>
          <div />
        </AppLayout>
      </MemoryRouter>,
    );
    expect(screen.getByText("MyPlatform")).toBeInTheDocument();
  });
});

describe("API Config", () => {
  it("reads VITE_API_URL from environment", async () => {
    const { appConfig } = await import("./config/app");
    expect(typeof appConfig.apiUrl).toBe("string");
  });
});
