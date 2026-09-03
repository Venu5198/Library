import pytest
from httpx import AsyncClient, ASGITransport
from src.main import app
from src.database import connect_to_mongo, close_mongo_connection

@pytest.fixture
def anyio_backend():
    return 'asyncio'

@pytest.fixture(autouse=True)
async def init_db():
    await connect_to_mongo()
    yield
    await close_mongo_connection()

@pytest.mark.anyio
async def test_health_live():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/health/live")
    assert response.status_code == 200
    assert response.json()["status"] == "alive"

@pytest.mark.anyio
async def test_health_check():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert "database" in data
    assert "uptime" in data

@pytest.mark.anyio
async def test_validation_error_on_create():
    # Empty title should fail validation
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/api/examples", json={"title": "", "description": "test"})
    assert response.status_code == 422

@pytest.mark.anyio
async def test_invalid_objectid():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/examples/invalid-id-123")
    assert response.status_code == 400

@pytest.mark.anyio
async def test_examples_crud():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # Create
        create_res = await ac.post("/api/examples", json={
            "title": "Pytest Created Example",
            "description": "Integration test created via Pytest with FastAPI and Motor",
            "tags": ["pytest", "fastapi"]
        })
        assert create_res.status_code == 201
        created_data = create_res.json()
        assert "id" in created_data
        item_id = created_data["id"]

        # Get by ID
        get_res = await ac.get(f"/api/examples/{item_id}")
        assert get_res.status_code == 200
        assert get_res.json()["title"] == "Pytest Created Example"

        # Update
        put_res = await ac.put(f"/api/examples/{item_id}", json={"title": "Updated Title"})
        assert put_res.status_code == 200
        assert put_res.json()["title"] == "Updated Title"

        # Delete
        del_res = await ac.delete(f"/api/examples/{item_id}")
        assert del_res.status_code == 204
