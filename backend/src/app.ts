import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import type { FastifyInstance } from "fastify";
import { config } from "./config/env.js";
import { connectDatabase, type MinimalLogger } from "./config/database.js";
import { ensureIndexes } from "./repositories/example.repository.js";
import { healthRoutes } from "./routes/health.routes.js";
import { exampleRoutes } from "./routes/example.routes.js";

export async function buildApp(): Promise<FastifyInstance> {
  const fastify = Fastify({
    logger: {
      level: config.LOG_LEVEL,
      // Structured JSON logging — maps cleanly to Google Cloud Logging
      transport:
        config.NODE_ENV === "development"
          ? {
              target: "pino-pretty",
              options: {
                colorize: true,
                translateTime: "SYS:standard",
                ignore: "pid,hostname",
              },
            }
          : undefined,
      // Production: raw JSON on stdout
      serializers: {
        req(request) {
          return {
            method: request.method,
            url: request.url,
            hostname: request.hostname,
            remoteAddress: request.ip,
          };
        },
      },
    },
    trustProxy: true,
    ajv: {
      customOptions: {
        strict: false,
      },
    },
  });

  // ── Security headers ────────────────────────────────────────────────
  await fastify.register(helmet, {
    contentSecurityPolicy: false, // Allow API responses without strict CSP
  });

  // ── CORS ────────────────────────────────────────────────────────────
  const allowedOrigins = config.CORS_ORIGINS.split(",").map((o) => o.trim());
  await fastify.register(cors, {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: Origin '${origin}' not allowed`), false);
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  });

  // ── Global error handler ─────────────────────────────────────────────
  fastify.setErrorHandler((error, request, reply) => {
    const statusCode = error.statusCode ?? 500;
    const isOperational = statusCode < 500;

    if (!isOperational) {
      fastify.log.error(
        { err: error, reqId: request.id, method: request.method, url: request.url },
        "Unhandled server error"
      );
    }

    reply.status(statusCode).send({
      statusCode,
      error: error.name ?? "Error",
      message: isOperational
        ? error.message
        : "An unexpected error occurred. Please try again later.",
      ...(config.NODE_ENV === "development" && !isOperational ? { stack: error.stack } : {}),
    });
  });

  // ── Not found handler ────────────────────────────────────────────────
  fastify.setNotFoundHandler((request, reply) => {
    reply.status(404).send({
      statusCode: 404,
      error: "Not Found",
      message: `Route ${request.method} ${request.url} not found`,
    });
  });

  // ── Routes ───────────────────────────────────────────────────────────
  await fastify.register(healthRoutes);
  await fastify.register(exampleRoutes);

  // ── Database ─────────────────────────────────────────────────────────
  await connectDatabase(config.MONGODB_URI, config.DATABASE_NAME, fastify.log as unknown as MinimalLogger);
  await ensureIndexes();

  // ── Hooks ────────────────────────────────────────────────────────────
  fastify.addHook("onRequest", async (request) => {
    request.log.info({ method: request.method, url: request.url }, "Incoming request");
  });

  return fastify;
}
