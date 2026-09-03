/**
 * Test script consuming @myorg/dummy-lib from Verdaccio
 */
import { greet, calculateDiscount, generateSlug, formatCurrency, getLibInfo } from "@myorg/dummy-lib";

console.log("==================================================");
console.log("  Testing @myorg/dummy-lib (Installed from Verdaccio)");
console.log("==================================================\n");

// 1. Library Info
console.log("[1] Library Metadata:");
console.log("   ", getLibInfo());

// 2. Greeting
console.log("\n[2] Greet Function:");
console.log("   ", greet("Venu"));

// 3. Discount Calculator
console.log("\n[3] Discount Calculation ($120 with 25% off):");
const discount = calculateDiscount(120, 25);
console.log("   ", discount);
console.log(`    Original: ${formatCurrency(discount.originalPrice)}`);
console.log(`    Discount: -${formatCurrency(discount.discountAmount)} (${discount.discountPercentage}%)`);
console.log(`    Final:    ${formatCurrency(discount.finalPrice)}`);

// 4. Slug Generator
console.log("\n[4] Slug Generator:");
const slug = generateSlug("How to Build a Local-First Full-Stack Platform in 2026!");
console.log("    Original: 'How to Build a Local-First Full-Stack Platform in 2026!'");
console.log("    Slug:    ", slug);

console.log("\n==================================================");
console.log("  SUCCESS: All @myorg/dummy-lib functions executed!");
console.log("==================================================");
