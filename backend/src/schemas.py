from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class ExampleBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=100)
    description: str = Field(..., min_length=1, max_length=500)
    tags: List[str] = Field(default_factory=list)
    metadata: Dict[str, Any] = Field(default_factory=dict)

class ExampleCreate(ExampleBase):
    pass

class ExampleUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = Field(None, min_length=1, max_length=500)
    tags: Optional[List[str]] = None
    metadata: Optional[Dict[str, Any]] = None

class ExampleResponse(BaseModel):
    id: str
    title: str
    description: str
    tags: List[str]
    metadata: Dict[str, Any]
    createdAt: datetime
    updatedAt: datetime

class Pagination(BaseModel):
    page: int
    limit: int
    total: int
    totalPages: int

class ExampleListResponse(BaseModel):
    data: List[ExampleResponse]
    pagination: Pagination

class HealthResponse(BaseModel):
    status: str
    timestamp: datetime
    version: str
    environment: str
    uptime: float
    database: Dict[str, bool]
