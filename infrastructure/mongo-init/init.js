#!/usr/bin/env node
/**
 * MongoDB initialization script.
 * Creates the myapp database, examples collection, and indexes.
 * This runs inside the mongo container via the init script mount.
 */
db = db.getSiblingDB("myapp");

// Create the examples collection
db.createCollection("examples");

// Create indexes
db.examples.createIndex({ title: "text", description: "text" }, { background: true });
db.examples.createIndex({ tags: 1 }, { background: true });
db.examples.createIndex({ createdAt: -1 }, { background: true });

// Seed initial documents if empty
if (db.examples.countDocuments() === 0) {
  db.examples.insertMany([
    {
      title: "Getting Started with MyPlatform",
      description: "This example demonstrates the full-stack local development platform. Built with Fastify, MongoDB, and React.",
      tags: ["getting-started", "tutorial", "platform"],
      metadata: { featured: true, difficulty: "beginner" },
      createdAt: new Date("2024-01-10T10:00:00Z"),
      updatedAt: new Date("2024-01-10T10:00:00Z")
    },
    {
      title: "UI Library Integration",
      description: "Demonstrates consuming @myorg/ui from Verdaccio. Frontend uses exact version pinning.",
      tags: ["ui-library", "verdaccio", "npm"],
      metadata: { featured: true, difficulty: "intermediate" },
      createdAt: new Date("2024-01-11T10:00:00Z"),
      updatedAt: new Date("2024-01-11T10:00:00Z")
    },
    {
      title: "Docker Compose Orchestration",
      description: "All services orchestrated via docker-compose.yml: frontend, backend, MongoDB, Verdaccio.",
      tags: ["docker", "compose", "infrastructure"],
      metadata: { featured: false, difficulty: "intermediate" },
      createdAt: new Date("2024-01-12T10:00:00Z"),
      updatedAt: new Date("2024-01-12T10:00:00Z")
    },
    {
      title: "GCP Migration Readiness",
      description: "Architecture designed for zero-code-change migration to Cloud Run, Artifact Registry, and MongoDB Atlas.",
      tags: ["gcp", "cloud-run", "migration"],
      metadata: { featured: true, difficulty: "advanced" },
      createdAt: new Date("2024-01-13T10:00:00Z"),
      updatedAt: new Date("2024-01-13T10:00:00Z")
    },
    {
      title: "Semantic Versioning with @myorg/ui",
      description: "Demonstrates how @myorg/ui@0.1.0 and @myorg/ui@0.2.0 coexist in Verdaccio with independent consumers.",
      tags: ["versioning", "semver", "npm"],
      metadata: { featured: false, difficulty: "beginner" },
      createdAt: new Date("2024-01-14T10:00:00Z"),
      updatedAt: new Date("2024-01-14T10:00:00Z")
    }
  ]);
  print("MongoDB seed complete: inserted 5 example documents.");
}
