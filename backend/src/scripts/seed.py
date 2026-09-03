import asyncio
from datetime import datetime, timezone
from motor.motor_asyncio import AsyncIOMotorClient
from src.config import settings

SAMPLE_DOCS = [
    {
        "title": "Getting Started with MyPlatform",
        "description": "This example demonstrates the full-stack local development platform. Built with FastAPI, MongoDB, and React.",
        "tags": ["getting-started", "tutorial", "platform"],
        "metadata": {"featured": True, "difficulty": "beginner"},
        "createdAt": datetime(2024, 1, 10, 10, 0, tzinfo=timezone.utc),
        "updatedAt": datetime(2024, 1, 10, 10, 0, tzinfo=timezone.utc),
    },
    {
        "title": "UI Library Integration",
        "description": "Demonstrates consuming @myorg/ui from Verdaccio. Frontend uses exact version pinning.",
        "tags": ["ui-library", "verdaccio", "npm"],
        "metadata": {"featured": True, "difficulty": "intermediate"},
        "createdAt": datetime(2024, 1, 11, 10, 0, tzinfo=timezone.utc),
        "updatedAt": datetime(2024, 1, 11, 10, 0, tzinfo=timezone.utc),
    },
    {
        "title": "Docker Compose Orchestration",
        "description": "All services orchestrated via docker-compose.yml: frontend, backend, MongoDB, Verdaccio.",
        "tags": ["docker", "compose", "infrastructure"],
        "metadata": {"featured": False, "difficulty": "intermediate"},
        "createdAt": datetime(2024, 1, 12, 10, 0, tzinfo=timezone.utc),
        "updatedAt": datetime(2024, 1, 12, 10, 0, tzinfo=timezone.utc),
    },
    {
        "title": "GCP Migration Readiness",
        "description": "Architecture designed for zero-code-change migration to Cloud Run, Artifact Registry, and MongoDB Atlas.",
        "tags": ["gcp", "cloud-run", "migration"],
        "metadata": {"featured": True, "difficulty": "advanced"},
        "createdAt": datetime(2024, 1, 13, 10, 0, tzinfo=timezone.utc),
        "updatedAt": datetime(2024, 1, 13, 10, 0, tzinfo=timezone.utc),
    },
    {
        "title": "Semantic Versioning with @myorg/ui",
        "description": "Demonstrates how @myorg/ui@0.1.0 and @myorg/ui@0.2.0 coexist in Verdaccio with independent consumers.",
        "tags": ["versioning", "semver", "npm"],
        "metadata": {"featured": False, "difficulty": "beginner"},
        "createdAt": datetime(2024, 1, 14, 10, 0, tzinfo=timezone.utc),
        "updatedAt": datetime(2024, 1, 14, 10, 0, tzinfo=timezone.utc),
    },
]

async def seed_db():
    print(f"[seed] Connecting to {settings.MONGODB_URI} (db: {settings.DATABASE_NAME})...")
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    db = client[settings.DATABASE_NAME]
    examples = db.get_collection("examples")

    count = await examples.count_documents({})
    if count == 0:
        await examples.insert_many(SAMPLE_DOCS)
        print(f"[seed] Successfully inserted {len(SAMPLE_DOCS)} sample documents.")
    else:
        print(f"[seed] Database already contains {count} documents. Skipping seed.")

    client.close()

if __name__ == "__main__":
    asyncio.run(seed_db())
