#!/usr/bin/env node
/**
 * db-seed.js — Cross-platform database seed script.
 *
 * Runs the backend seed script via tsx against the running MongoDB.
 * Requires MongoDB to be running (either via Docker Compose or locally).
 *
 * Usage:
 *   node infrastructure/scripts/db-seed.js
 *
 * Environment:
 *   MONGODB_URI   — defaults to mongodb://localhost:27017
 *   DATABASE_NAME — defaults to myapp
 */

import { execSync } from "child_process";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BACKEND_DIR = resolve(__dirname, "../../backend");

const MONGODB_URI = process.env.MONGODB_URI ?? "mongodb://localhost:27017";
const DATABASE_NAME = process.env.DATABASE_NAME ?? "myapp";

console.log("═══════════════════════════════════════════════════");
console.log("  Database Seed");
console.log("═══════════════════════════════════════════════════\n");

console.log(`→ MongoDB: ${MONGODB_URI}`);
console.log(`→ Database: ${DATABASE_NAME}\n`);

try {
  execSync("npm run db:seed", {
    cwd: BACKEND_DIR,
    stdio: "inherit",
    env: {
      ...process.env,
      MONGODB_URI,
      DATABASE_NAME,
      NODE_ENV: "development",
    },
  });
  console.log("\n✓ Database seeded successfully.");
} catch (err) {
  console.error("\n✗ Seed failed:", err.message);
  console.error("\nMake sure MongoDB is running:");
  console.error("  docker compose up mongodb");
  process.exit(1);
}
