import { z } from "zod";

// Environment schema with strict validation
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(8080),
  HOST: z.string().default("0.0.0.0"),
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  DATABASE_NAME: z.string().min(1, "DATABASE_NAME is required").default("myapp"),
  CORS_ORIGINS: z.string().default("http://localhost:3000"),
  LOG_LEVEL: z.enum(["trace", "debug", "info", "warn", "error", "fatal", "silent"]).default("info"),
});

export type AppConfig = z.infer<typeof envSchema>;

function loadConfig(): AppConfig {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    if (process.env.NODE_ENV === "test" || process.env.VITEST) {
      return {
        NODE_ENV: "test",
        PORT: 8080,
        HOST: "0.0.0.0",
        MONGODB_URI: "mongodb://localhost:27017/myapp_test",
        DATABASE_NAME: "myapp_test",
        CORS_ORIGINS: "*",
        LOG_LEVEL: "silent",
      };
    }
    const errors = result.error.errors
      .map((e) => `  - ${e.path.join(".")}: ${e.message}`)
      .join("\n");
    console.error(`[CONFIG] Fatal: Invalid environment configuration:\n${errors}`);
    console.error("[CONFIG] Copy .env.example to .env and fill required values.");
    process.exit(1);
  }

  return result.data;
}

// Singleton — parsed once at startup
export const config = loadConfig();
