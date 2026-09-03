from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from typing import Optional
import logging
from src.config import settings

logger = logging.getLogger("backend.database")

class Database:
    client: Optional[AsyncIOMotorClient] = None
    db: Optional[AsyncIOMotorDatabase] = None

db = Database()

async def connect_to_mongo():
    logger.info(f"Connecting to MongoDB at {settings.MONGODB_URI}")
    db.client = AsyncIOMotorClient(settings.MONGODB_URI)
    db.db = db.client[settings.DATABASE_NAME]
    
    # Ensure indexes on examples collection
    try:
        examples = db.db.get_collection("examples")
        await examples.create_index([("title", "text"), ("description", "text")])
        await examples.create_index([("tags", 1)])
        await examples.create_index([("createdAt", -1)])
        logger.info("MongoDB indexes verified.")
    except Exception as e:
        logger.warning(f"Failed to ensure indexes: {e}")

async def close_mongo_connection():
    if db.client:
        logger.info("Closing MongoDB connection")
        db.client.close()

async def check_db_health() -> bool:
    try:
        if db.client is None:
            return False
        await db.client.admin.command("ping")
        return True
    except Exception as e:
        logger.error(f"MongoDB ping failed: {e}")
        return False
