import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Input } from "@/components/Input";

describe("Input", () => {
  it("renders an input element", () => {
    render(<Input />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("renders label when provided", () => {
    render(<Input label="Email" />);
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("renders required indicator", () => {
    render(<Input label="Name" required />);
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("renders helper text", () => {
    render(<Input helperText="Use your work email" />);
    expect(screen.getByText("Use your work email")).toBeInTheDocument();
  });

  it("renders error message", () => {
    render(<Input error="This field is required" />);
    expect(screen.getByText("This field is required")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("marks input as invalid when error is set", () => {
    render(<Input error="Invalid input" />);
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
  });

  it("does not render helper text when error is present", () => {
    render(<Input helperText="Helper" error="Error!" />);
    expect(screen.queryByText("Helper")).not.toBeInTheDocument();
    expect(screen.getByText("Error!")).toBeInTheDocument();
  });

  it("is disabled when disabled prop is set", () => {
    render(<Input disabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("forwards ref to input element", () => {
    const ref = { current: null } as React.RefObject<HTMLInputElement>;
    render(<Input ref={ref} />);
    expect(ref.current?.tagName).toBe("INPUT");
  });

  it("passes additional props to input", () => {
    render(<Input placeholder="Enter value" data-testid="custom-input" />);
    expect(screen.getByTestId("custom-input")).toHaveAttribute("placeholder", "Enter value");
  });
});
