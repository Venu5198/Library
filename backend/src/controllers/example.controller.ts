import type { FastifyRequest, FastifyReply } from "fastify";
import * as exampleRepo from "../repositories/example.repository.js";
import { toExampleResponse } from "../models/example.model.js";
import type {
  CreateExampleInput,
  UpdateExampleInput,
  ExampleIdParam,
  ListExamplesQuery,
} from "../schemas/example.schema.js";

export async function listExamples(
  request: FastifyRequest<{ Querystring: ListExamplesQuery }>,
  reply: FastifyReply
): Promise<void> {
  const { page, limit, search, tag } = request.query;

  const result = await exampleRepo.findAll({ page, limit, search, tag });

  reply.send({
    data: result.data.map(toExampleResponse),
    pagination: {
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: result.totalPages,
    },
  });
}

export async function getExampleById(
  request: FastifyRequest<{ Params: ExampleIdParam }>,
  reply: FastifyReply
): Promise<void> {
  const { id } = request.params;
  const example = await exampleRepo.findById(id);

  if (!example) {
    return reply.status(404).send({
      statusCode: 404,
      error: "Not Found",
      message: `Example with id '${id}' not found`,
    });
  }

  reply.send(toExampleResponse(example));
}

export async function createExample(
  request: FastifyRequest<{ Body: CreateExampleInput }>,
  reply: FastifyReply
): Promise<void> {
  const example = await exampleRepo.create(request.body);
  reply.status(201).send(toExampleResponse(example));
}

export async function updateExample(
  request: FastifyRequest<{ Params: ExampleIdParam; Body: UpdateExampleInput }>,
  reply: FastifyReply
): Promise<void> {
  const { id } = request.params;
  const updated = await exampleRepo.updateById(id, request.body);

  if (!updated) {
    return reply.status(404).send({
      statusCode: 404,
      error: "Not Found",
      message: `Example with id '${id}' not found`,
    });
  }

  reply.send(toExampleResponse(updated));
}

export async function deleteExample(
  request: FastifyRequest<{ Params: ExampleIdParam }>,
  reply: FastifyReply
): Promise<void> {
  const { id } = request.params;
  const deleted = await exampleRepo.deleteById(id);

  if (!deleted) {
    return reply.status(404).send({
      statusCode: 404,
      error: "Not Found",
      message: `Example with id '${id}' not found`,
    });
  }

  reply.status(204).send();
}
