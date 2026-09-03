import { Collection, ObjectId, Filter } from "mongodb";
import { getCollection } from "../config/database.js";
import type { ExampleDocument } from "../models/example.model.js";
import type { CreateExampleInput, UpdateExampleInput } from "../schemas/example.schema.js";

const COLLECTION_NAME = "examples";

export interface FindAllOptions {
  page: number;
  limit: number;
  search?: string;
  tag?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

function collection(): Collection<ExampleDocument> {
  return getCollection<ExampleDocument>(COLLECTION_NAME);
}

export async function ensureIndexes(): Promise<void> {
  const col = collection();
  await col.createIndex({ title: "text", description: "text" }, { background: true });
  await col.createIndex({ tags: 1 }, { background: true });
  await col.createIndex({ createdAt: -1 }, { background: true });
}

export async function findAll(
  options: FindAllOptions
): Promise<PaginatedResult<ExampleDocument & { _id: ObjectId }>> {
  const col = collection();
  const { page, limit, search, tag } = options;
  const skip = (page - 1) * limit;

  const filter: Filter<ExampleDocument> = {};

  if (search) {
    filter.$text = { $search: search };
  }

  if (tag) {
    filter.tags = tag;
  }

  const [data, total] = await Promise.all([
    col.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
    col.countDocuments(filter),
  ]);

  return {
    data: data as (ExampleDocument & { _id: ObjectId })[],
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function findById(
  id: string
): Promise<(ExampleDocument & { _id: ObjectId }) | null> {
  if (!ObjectId.isValid(id)) return null;
  const col = collection();
  const result = await col.findOne({ _id: new ObjectId(id) });
  return result as (ExampleDocument & { _id: ObjectId }) | null;
}

export async function create(
  input: CreateExampleInput
): Promise<ExampleDocument & { _id: ObjectId }> {
  const col = collection();
  const now = new Date();
  const doc: ExampleDocument = {
    title: input.title,
    description: input.description,
    tags: input.tags,
    metadata: input.metadata,
    createdAt: now,
    updatedAt: now,
  };

  const result = await col.insertOne(doc);
  return { ...doc, _id: result.insertedId };
}

export async function updateById(
  id: string,
  input: UpdateExampleInput
): Promise<(ExampleDocument & { _id: ObjectId }) | null> {
  if (!ObjectId.isValid(id)) return null;
  const col = collection();

  const updateFields: Partial<ExampleDocument> = { updatedAt: new Date() };
  if (input.title !== undefined) updateFields.title = input.title;
  if (input.description !== undefined) updateFields.description = input.description;
  if (input.tags !== undefined) updateFields.tags = input.tags;
  if (input.metadata !== undefined) updateFields.metadata = input.metadata;

  const result = await col.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: updateFields },
    { returnDocument: "after" }
  );

  return result as (ExampleDocument & { _id: ObjectId }) | null;
}

export async function deleteById(id: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false;
  const col = collection();
  const result = await col.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount === 1;
}
