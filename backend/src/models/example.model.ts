import { ObjectId } from "mongodb";

export interface ExampleDocument {
  _id?: ObjectId;
  title: string;
  description?: string;
  tags: string[];
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExampleResponse {
  id: string;
  title: string;
  description?: string;
  tags: string[];
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export function toExampleResponse(doc: ExampleDocument & { _id: ObjectId }): ExampleResponse {
  return {
    id: doc._id.toHexString(),
    title: doc.title,
    description: doc.description,
    tags: doc.tags,
    metadata: doc.metadata,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}
