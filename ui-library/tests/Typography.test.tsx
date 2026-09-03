import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Typography } from "@/components/Typography";

describe("Typography", () => {
  it("renders h1 as h1 tag", () => {
    render(<Typography variant="h1">Heading 1</Typography>);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("renders body1 as paragraph", () => {
    const { container } = render(<Typography variant="body1">Body text</Typography>);
    expect(container.querySelector("p")).toBeInTheDocument();
  });

  it("applies color class", () => {
    const { container } = render(
      <Typography color="primary">Colored</Typography>
    );
    expect(container.firstChild).toHaveClass("myorg-text--color-primary");
  });

  it("applies alignment class", () => {
    const { container } = render(
      <Typography align="center">Centered</Typography>
    );
    expect(container.firstChild).toHaveClass("myorg-text--align-center");
  });

  it("truncates text with class", () => {
    const { container } = render(
      <Typography truncate>Long text</Typography>
    );
    expect(container.firstChild).toHaveClass("myorg-text--truncate");
  });

  it("renders as custom element using 'as' prop", () => {
    const { container } = render(
      <Typography as="span">Custom element</Typography>
    );
    expect(container.querySelector("span")).toBeInTheDocument();
  });
});
