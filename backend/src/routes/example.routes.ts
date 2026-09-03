import type { FastifyInstance } from "fastify";
import * as handlers from "../controllers/example.controller.js";
import {
  createExampleSchema,
  updateExampleSchema,
  exampleIdSchema,
  listExamplesQuerySchema,
} from "../schemas/example.schema.js";

export async function exampleRoutes(fastify: FastifyInstance): Promise<void> {
  // List examples with pagination
  fastify.get("/api/examples", async (request, reply) => {
    const query = listExamplesQuerySchema.parse(request.query);
    (request as typeof request & { query: typeof query }).query = query;
    return handlers.listExamples(
      request as Parameters<typeof handlers.listExamples>[0],
      reply
    );
  });

  // Get one example by ID
  fastify.get<{ Params: { id: string } }>("/api/examples/:id", async (request, reply) => {
    const params = exampleIdSchema.parse(request.params);
    (request as typeof request & { params: typeof params }).params = params;
    return handlers.getExampleById(
      request as Parameters<typeof handlers.getExampleById>[0],
      reply
    );
  });

  // Create a new example
  fastify.post("/api/examples", async (request, reply) => {
    const body = createExampleSchema.parse(request.body);
    (request as typeof request & { body: typeof body }).body = body;
    return handlers.createExample(
      request as Parameters<typeof handlers.createExample>[0],
      reply
    );
  });

  // Update an existing example
  fastify.put<{ Params: { id: string } }>("/api/examples/:id", async (request, reply) => {
    const params = exampleIdSchema.parse(request.params);
    const body = updateExampleSchema.parse(request.body);
    (request as typeof request & { params: typeof params; body: typeof body }).params = params;
    (request as typeof request & { params: typeof params; body: typeof body }).body = body;
    return handlers.updateExample(
      request as Parameters<typeof handlers.updateExample>[0],
      reply
    );
  });

  // Delete an example
  fastify.delete<{ Params: { id: string } }>("/api/examples/:id", async (request, reply) => {
    const params = exampleIdSchema.parse(request.params);
    (request as typeof request & { params: typeof params }).params = params;
    return handlers.deleteExample(
      request as Parameters<typeof handlers.deleteExample>[0],
      reply
    );
  });
}
