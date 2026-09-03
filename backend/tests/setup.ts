/**
 * Vitest global setup — sets required environment variables before any test modules load.
 * This runs before vi.mock() calls and module loading.
 */

// Set required env vars so config/env.ts doesn't call process.exit(1)
process.env.MONGODB_URI = process.env.MONGODB_URI ?? "mongodb://localhost:27017";
process.env.DATABASE_NAME = process.env.DATABASE_NAME ?? "test";
process.env.NODE_ENV = process.env.NODE_ENV ?? "test";
process.env.CORS_ORIGINS = process.env.CORS_ORIGINS ?? "*";
process.env.LOG_LEVEL = process.env.LOG_LEVEL ?? "silent";
process.env.PORT = process.env.PORT ?? "0";
