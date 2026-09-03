import type { FastifyInstance } from "fastify";
import { checkDatabaseHealth, type MinimalLogger } from "../config/database.js";

export async function healthRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.get(
    "/health",
    {
      schema: {
        description: "Health check endpoint",
        tags: ["System"],
        response: {
          200: {
            type: "object",
            properties: {
              status: { type: "string" },
              timestamp: { type: "string" },
              version: { type: "string" },
              environment: { type: "string" },
              uptime: { type: "number" },
              database: {
                type: "object",
                properties: {
                  connected: { type: "boolean" },
                },
              },
            },
          },
        },
      },
    },
    async (_request, reply) => {
      const dbHealthy = await checkDatabaseHealth(fastify.log as unknown as MinimalLogger);

      const payload = {
        status: dbHealthy ? "healthy" : "degraded",
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version ?? "unknown",
        environment: process.env.NODE_ENV ?? "unknown",
        uptime: Math.floor(process.uptime()),
        database: {
          connected: dbHealthy,
        },
      };

      const statusCode = dbHealthy ? 200 : 503;
      reply.status(statusCode).send(payload);
    }
  );

  // Kubernetes-style liveness probe (always 200 if process is running)
  fastify.get("/health/live", async (_request, reply) => {
    reply.send({ status: "alive", timestamp: new Date().toISOString() });
  });

  // Readiness probe (503 if db not connected)
  fastify.get("/health/ready", async (_request, reply) => {
    const dbHealthy = await checkDatabaseHealth(fastify.log as unknown as MinimalLogger);
    if (!dbHealthy) {
      return reply.status(503).send({ status: "not ready", reason: "database unavailable" });
    }
    reply.send({ status: "ready", timestamp: new Date().toISOString() });
  });
}
