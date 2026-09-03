import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "@/components/Badge";

describe("Badge", () => {
  it("renders children", () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText("New")).toBeInTheDocument();
  });

  it("applies default subtle variant", () => {
    const { container } = render(<Badge>Tag</Badge>);
    expect(container.firstChild).toHaveClass("myorg-badge--subtle");
  });

  it("applies solid variant", () => {
    const { container } = render(<Badge variant="solid">Solid</Badge>);
    expect(container.firstChild).toHaveClass("myorg-badge--solid");
  });

  it("applies success color scheme", () => {
    const { container } = render(<Badge colorScheme="success">Active</Badge>);
    expect(container.firstChild).toHaveClass("myorg-badge--success");
  });

  it("applies pill class", () => {
    const { container } = render(<Badge pill>Pill</Badge>);
    expect(container.firstChild).toHaveClass("myorg-badge--pill");
  });

  it("renders dot indicator", () => {
    const { container } = render(<Badge dot>Online</Badge>);
    expect(container.querySelector(".myorg-badge__dot")).toBeInTheDocument();
  });
});
