from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List
import os

class Settings(BaseSettings):
    NODE_ENV: str = "development"
    PORT: int = 8080
    HOST: str = "0.0.0.0"
    MONGODB_URI: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "myapp"
    CORS_ORIGINS: str = "http://localhost:3000"
    LOG_LEVEL: str = "info"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    @property
    def cors_origin_list(self) -> List[str]:
        if self.CORS_ORIGINS == "*":
            return ["*"]
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

settings = Settings()
