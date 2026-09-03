import { getCollection } from "../config/database.js";
import type { ExampleDocument } from "../models/example.model.js";

const SEED_DATA: Omit<ExampleDocument, "_id">[] = [
  {
    title: "Getting Started with MyPlatform",
    description:
      "This example demonstrates the full-stack local development platform. Built with Fastify, MongoDB, and React.",
    tags: ["getting-started", "tutorial", "platform"],
    metadata: { featured: true, difficulty: "beginner" },
    createdAt: new Date("2024-01-10T10:00:00Z"),
    updatedAt: new Date("2024-01-10T10:00:00Z"),
  },
  {
    title: "UI Library Integration",
    description:
      "Demonstrates consuming @myorg/ui from Verdaccio. Frontend uses exact version pinning.",
    tags: ["ui-library", "verdaccio", "npm"],
    metadata: { featured: true, difficulty: "intermediate" },
    createdAt: new Date("2024-01-11T10:00:00Z"),
    updatedAt: new Date("2024-01-11T10:00:00Z"),
  },
  {
    title: "Docker Compose Orchestration",
    description:
      "All services orchestrated via docker-compose.yml: frontend, backend, MongoDB, Verdaccio.",
    tags: ["docker", "compose", "infrastructure"],
    metadata: { featured: false, difficulty: "intermediate" },
    createdAt: new Date("2024-01-12T10:00:00Z"),
    updatedAt: new Date("2024-01-12T10:00:00Z"),
  },
  {
    title: "GCP Migration Readiness",
    description:
      "Architecture designed for zero-code-change migration to Cloud Run, Artifact Registry, and MongoDB Atlas.",
    tags: ["gcp", "cloud-run", "migration"],
    metadata: { featured: true, difficulty: "advanced" },
    createdAt: new Date("2024-01-13T10:00:00Z"),
    updatedAt: new Date("2024-01-13T10:00:00Z"),
  },
  {
    title: "Semantic Versioning with @myorg/ui",
    description:
      "Demonstrates how @myorg/ui@0.1.0 and @myorg/ui@0.2.0 coexist in Verdaccio with independent consumers.",
    tags: ["versioning", "semver", "npm"],
    metadata: { featured: false, difficulty: "beginner" },
    createdAt: new Date("2024-01-14T10:00:00Z"),
    updatedAt: new Date("2024-01-14T10:00:00Z"),
  },
];

export async function seed(): Promise<void> {
  console.log("[seed] Starting database seed...");

  const col = getCollection<ExampleDocument>("examples");

  // Only seed if collection is empty
  const count = await col.countDocuments();
  if (count > 0) {
    console.log(`[seed] Collection already has ${count} documents. Skipping seed.`);
    return;
  }

  const result = await col.insertMany(SEED_DATA);
  console.log(`[seed] Inserted ${result.insertedCount} example documents.`);
}
