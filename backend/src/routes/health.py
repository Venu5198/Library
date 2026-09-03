from fastapi import APIRouter, Response, status
from datetime import datetime, timezone
import time
from src.database import check_db_health
from src.config import settings

router = APIRouter(tags=["Health"])

START_TIME = time.time()

@router.get("/health")
async def health_check():
    db_connected = await check_db_health()
    uptime = time.time() - START_TIME
    
    return {
        "status": "healthy" if db_connected else "degraded",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "version": "1.0.0",
        "environment": settings.NODE_ENV,
        "uptime": round(uptime, 2),
        "database": {
            "connected": db_connected
        }
    }

@router.get("/health/live")
async def liveness():
    return {
        "status": "alive",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

@router.get("/health/ready")
async def readiness(response: Response):
    db_connected = await check_db_health()
    if not db_connected:
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE
        return {"status": "not ready", "reason": "database unavailable"}
    
    return {
        "status": "ready",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
