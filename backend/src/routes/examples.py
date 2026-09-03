from fastapi import APIRouter, HTTPException, status, Query, Response
from typing import Optional, List
from bson import ObjectId
from datetime import datetime, timezone
from src.database import db
from src.schemas import (
    ExampleCreate,
    ExampleUpdate,
    ExampleResponse,
    ExampleListResponse,
    Pagination
)

router = APIRouter(prefix="/api/examples", tags=["Examples"])

def format_doc(doc: dict) -> ExampleResponse:
    return ExampleResponse(
        id=str(doc["_id"]),
        title=doc["title"],
        description=doc["description"],
        tags=doc.get("tags", []),
        metadata=doc.get("metadata", {}),
        createdAt=doc.get("createdAt", datetime.now(timezone.utc)),
        updatedAt=doc.get("updatedAt", datetime.now(timezone.utc))
    )

@router.get("", response_model=ExampleListResponse)
async def list_examples(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    tag: Optional[str] = Query(None)
):
    collection = db.db.get_collection("examples")
    filter_query = {}

    if search:
        filter_query["$text"] = {"$search": search}
    if tag:
        filter_query["tags"] = tag

    skip = (page - 1) * limit
    total = await collection.count_documents(filter_query)
    total_pages = (total + limit - 1) // limit if total > 0 else 0

    cursor = collection.find(filter_query).sort("createdAt", -1).skip(skip).limit(limit)
    docs = await cursor.to_list(length=limit)

    return ExampleListResponse(
        data=[format_doc(d) for d in docs],
        pagination=Pagination(
            page=page,
            limit=limit,
            total=total,
            totalPages=total_pages
        )
    )

@router.post("", response_model=ExampleResponse, status_code=status.HTTP_201_CREATED)
async def create_example(payload: ExampleCreate):
    collection = db.db.get_collection("examples")
    now = datetime.now(timezone.utc)
    
    doc = {
        "title": payload.title,
        "description": payload.description,
        "tags": payload.tags,
        "metadata": payload.metadata,
        "createdAt": now,
        "updatedAt": now
    }

    result = await collection.insert_one(doc)
    doc["_id"] = result.inserted_id
    return format_doc(doc)

@router.get("/{example_id}", response_model=ExampleResponse)
async def get_example(example_id: str):
    if not ObjectId.is_valid(example_id):
        raise HTTPException(status_code=400, detail="Invalid ID format")
    
    collection = db.db.get_collection("examples")
    doc = await collection.find_one({"_id": ObjectId(example_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Example not found")
    
    return format_doc(doc)

@router.put("/{example_id}", response_model=ExampleResponse)
async def update_example(example_id: str, payload: ExampleUpdate):
    if not ObjectId.is_valid(example_id):
        raise HTTPException(status_code=400, detail="Invalid ID format")
    
    collection = db.db.get_collection("examples")
    update_data = {k: v for k, v in payload.model_dump().items() if v is not None}
    
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields provided for update")
    
    update_data["updatedAt"] = datetime.now(timezone.utc)
    
    result = await collection.find_one_and_update(
        {"_id": ObjectId(example_id)},
        {"$set": update_data},
        return_document=True
    )
    
    if not result:
        raise HTTPException(status_code=404, detail="Example not found")
        
    return format_doc(result)

@router.delete("/{example_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_example(example_id: str):
    if not ObjectId.is_valid(example_id):
        raise HTTPException(status_code=400, detail="Invalid ID format")
    
    collection = db.db.get_collection("examples")
    result = await collection.delete_one({"_id": ObjectId(example_id)})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Example not found")
        
    return Response(status_code=status.HTTP_204_NO_CONTENT)
