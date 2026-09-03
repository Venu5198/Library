from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import logging
from src.config import settings
from src.database import connect_to_mongo, close_mongo_connection
from src.routes.health import router as health_router
from src.routes.examples import router as examples_router

# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO),
    format='{"time":"%(asctime)s","level":"%(levelname)s","name":"%(name)s","message":"%(message)s"}'
)
logger = logging.getLogger("backend.main")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting up FastAPI application...")
    await connect_to_mongo()
    yield
    logger.info("Shutting down FastAPI application...")
    await close_mongo_connection()

app = FastAPI(
    title="MyPlatform API",
    description="FastAPI Backend for MyPlatform",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(health_router)
app.include_router(examples_router)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error processing {request.method} {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"statusCode": 500, "error": "InternalServerError", "message": "An unexpected server error occurred"}
    )
