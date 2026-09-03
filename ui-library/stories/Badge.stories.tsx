import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "../src/components/Badge";

const meta: Meta<typeof Badge> = {
  title: "Components/Badge",
  component: Badge,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: "New", colorScheme: "primary", variant: "subtle" },
};

export const Solid: Story = {
  args: { children: "Active", colorScheme: "success", variant: "solid" },
};

export const Outline: Story = {
  args: { children: "Pending", colorScheme: "warning", variant: "outline" },
};

export const WithDot: Story = {
  args: { children: "Online", colorScheme: "success", dot: true },
};

export const Pill: Story = {
  args: { children: "Beta", colorScheme: "info", pill: true },
};

export const AllColorSchemes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
      <Badge colorScheme="primary">Primary</Badge>
      <Badge colorScheme="neutral">Neutral</Badge>
      <Badge colorScheme="success">Success</Badge>
      <Badge colorScheme="warning">Warning</Badge>
      <Badge colorScheme="error">Error</Badge>
      <Badge colorScheme="info">Info</Badge>
    </div>
  ),
};
