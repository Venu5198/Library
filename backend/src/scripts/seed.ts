/**
 * Database seed script.
 * Run: npm run db:seed
 *
 * Seeds the development database with sample data.
 * Idempotent — safe to run multiple times.
 */
import { connectDatabase, disconnectDatabase, type MinimalLogger } from "../config/database.js";
import { config } from "../config/env.js";
import { seed } from "../services/seed.service.js";

const logger: MinimalLogger = {
  info: (obj, msg) => console.log("[INFO]", typeof obj === "string" ? obj : msg, typeof obj === "object" ? obj : ""),
  warn: (obj, msg) => console.warn("[WARN]", typeof obj === "string" ? obj : msg, typeof obj === "object" ? obj : ""),
  error: (obj, msg) => console.error("[ERROR]", typeof obj === "string" ? obj : msg, typeof obj === "object" ? obj : ""),
};

async function main(): Promise<void> {
  try {
    await connectDatabase(config.MONGODB_URI, config.DATABASE_NAME, logger);
    await seed();
    console.log("[seed] Seed completed successfully.");
  } catch (err) {
    console.error("[seed] Seed failed:", err);
    process.exit(1);
  } finally {
    await disconnectDatabase(logger);
  }
}

main();
