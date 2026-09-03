import { z } from "zod";

// ── Example entity schemas ──────────────────────────────────────────────

export const createExampleSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be 200 characters or less")
    .trim(),
  description: z
    .string()
    .max(2000, "Description must be 2000 characters or less")
    .trim()
    .optional(),
  tags: z.array(z.string().trim().min(1)).max(10, "Maximum 10 tags allowed").default([]),
  metadata: z.record(z.unknown()).optional(),
});

export const updateExampleSchema = createExampleSchema.partial();

export const exampleIdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId"),
});

export const listExamplesQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  tag: z.string().optional(),
});

// ── Inferred TypeScript types ───────────────────────────────────────────

export type CreateExampleInput = z.infer<typeof createExampleSchema>;
export type UpdateExampleInput = z.infer<typeof updateExampleSchema>;
export type ExampleIdParam = z.infer<typeof exampleIdSchema>;
export type ListExamplesQuery = z.infer<typeof listExamplesQuerySchema>;
