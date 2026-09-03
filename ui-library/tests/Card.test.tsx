import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Card } from "@/components/Card";

describe("Card", () => {
  it("renders children", () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText("Card content")).toBeInTheDocument();
  });

  it("renders header when provided", () => {
    render(<Card header="Card Title">Body</Card>);
    expect(screen.getByText("Card Title")).toBeInTheDocument();
  });

  it("renders footer when provided", () => {
    render(<Card footer="Footer content">Body</Card>);
    expect(screen.getByText("Footer content")).toBeInTheDocument();
  });

  it("applies variant class", () => {
    const { container } = render(<Card variant="elevated">Content</Card>);
    expect(container.firstChild).toHaveClass("myorg-card--elevated");
  });

  it("applies interactive class and role when onClick provided", () => {
    const handleClick = vi.fn();
    render(<Card onClick={handleClick}>Clickable</Card>);
    const card = screen.getByRole("button");
    expect(card).toBeInTheDocument();
    fireEvent.click(card);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("handles keyboard Enter key for interactive cards", () => {
    const handleClick = vi.fn();
    render(<Card onClick={handleClick}>Keyboard</Card>);
    const card = screen.getByRole("button");
    fireEvent.keyDown(card, { key: "Enter" });
    expect(handleClick).toHaveBeenCalled();
  });
});
