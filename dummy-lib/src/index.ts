/**
 * @myorg/dummy-lib
 * A sample library created to test Verdaccio publishing and consuming.
 */

export interface PriceSummary {
  originalPrice: number;
  discountPercentage: number;
  discountAmount: number;
  finalPrice: number;
}

/**
 * Returns a warm greeting message.
 */
export function greet(name: string): string {
  return `Hello, ${name}! Welcome to @myorg/dummy-lib.`;
}

/**
 * Calculates a discounted price and returns detailed summary.
 */
export function calculateDiscount(originalPrice: number, discountPercentage: number): PriceSummary {
  if (originalPrice < 0) throw new Error("Price cannot be negative");
  if (discountPercentage < 0 || discountPercentage > 100) {
    throw new Error("Discount percentage must be between 0 and 100");
  }

  const discountAmount = Math.round((originalPrice * (discountPercentage / 100)) * 100) / 100;
  const finalPrice = Math.round((originalPrice - discountAmount) * 100) / 100;

  return {
    originalPrice,
    discountPercentage,
    discountAmount,
    finalPrice,
  };
}

/**
 * Converts a text title into an SEO-friendly URL slug.
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Formats a numeric amount as currency string.
 */
export function formatCurrency(amount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

/**
 * Returns library metadata.
 */
export function getLibInfo() {
  return {
    name: "@myorg/dummy-lib",
    version: "1.0.0",
    description: "Sample library verified via Verdaccio",
  };
}
