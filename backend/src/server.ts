import { buildApp } from "./app.js";
import { config } from "./config/env.js";
import { disconnectDatabase, type MinimalLogger } from "./config/database.js";

async function start(): Promise<void> {
  const app = await buildApp();

  // ── Graceful shutdown ────────────────────────────────────────────────
  const shutdown = async (signal: string): Promise<void> => {
    app.log.info({ signal }, "Received shutdown signal — shutting down gracefully");

    try {
      await app.close();
      await disconnectDatabase(app.log as unknown as MinimalLogger);
      app.log.info("Graceful shutdown complete");
      process.exit(0);
    } catch (err) {
      app.log.error({ err }, "Error during shutdown");
      process.exit(1);
    }
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));

  process.on("unhandledRejection", (reason) => {
    app.log.error({ reason }, "Unhandled promise rejection — shutting down");
    shutdown("unhandledRejection");
  });

  process.on("uncaughtException", (err) => {
    app.log.error({ err }, "Uncaught exception — shutting down");
    shutdown("uncaughtException");
  });

  // ── Start listening ──────────────────────────────────────────────────
  try {
    await app.listen({ port: config.PORT, host: config.HOST });
    app.log.info(
      {
        host: config.HOST,
        port: config.PORT,
        env: config.NODE_ENV,
        health: `http://${config.HOST === "0.0.0.0" ? "localhost" : config.HOST}:${config.PORT}/health`,
      },
      "Server started"
    );
  } catch (err) {
    app.log.error({ err }, "Fatal: Failed to start server");
    process.exit(1);
  }
}

start();
