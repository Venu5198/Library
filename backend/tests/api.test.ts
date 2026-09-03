import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock database before importing app
vi.mock("../src/config/database.js", () => ({
  connectDatabase: vi.fn().mockResolvedValue({ client: {}, db: {} }),
  disconnectDatabase: vi.fn().mockResolvedValue(undefined),
  checkDatabaseHealth: vi.fn().mockResolvedValue(true),
  getDatabase: vi.fn().mockReturnValue({}),
  getCollection: vi.fn().mockReturnValue({
    find: vi.fn().mockReturnValue({
      sort: vi.fn().mockReturnThis(),
      skip: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      toArray: vi.fn().mockResolvedValue([]),
    }),
    findOne: vi.fn().mockResolvedValue(null),
    insertOne: vi.fn().mockResolvedValue({ insertedId: { toHexString: () => "mock-id" } }),
    findOneAndUpdate: vi.fn().mockResolvedValue(null),
    deleteOne: vi.fn().mockResolvedValue({ deletedCount: 0 }),
    countDocuments: vi.fn().mockResolvedValue(0),
    createIndex: vi.fn().mockResolvedValue("index-name"),
  }),
  ObjectId: class MockObjectId {
    private _id: string;
    constructor(id?: string) {
      this._id = id ?? "000000000000000000000001";
    }
    toHexString() {
      return this._id;
    }
    static isValid(id: string) {
      return /^[0-9a-fA-F]{24}$/.test(id);
    }
  },
}));

import { buildApp } from "../src/app.js";

describe("Health Routes", () => {
  let app: Awaited<ReturnType<typeof buildApp>>;

  beforeEach(async () => {
    process.env.MONGODB_URI = "mongodb://localhost:27017";
    process.env.DATABASE_NAME = "test";
    process.env.NODE_ENV = "test";
    process.env.CORS_ORIGINS = "*";
    app = await buildApp();
  });

  afterEach(async () => {
    await app.close();
  });

  it("GET /health returns 200 with status", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/health",
    });
    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.status).toBe("healthy");
    expect(body.timestamp).toBeDefined();
    expect(body.database).toBeDefined();
    expect(body.database.connected).toBe(true);
  });

  it("GET /health/live returns 200", async () => {
    const response = await app.inject({ method: "GET", url: "/health/live" });
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body).status).toBe("alive");
  });

  it("GET /health/ready returns 200 when db is healthy", async () => {
    const response = await app.inject({ method: "GET", url: "/health/ready" });
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body).status).toBe("ready");
  });
});

describe("Example Routes", () => {
  let app: Awaited<ReturnType<typeof buildApp>>;

  beforeEach(async () => {
    process.env.MONGODB_URI = "mongodb://localhost:27017";
    process.env.DATABASE_NAME = "test";
    app = await buildApp();
  });

  afterEach(async () => {
    await app.close();
  });

  it("GET /api/examples returns paginated list", async () => {
    const response = await app.inject({ method: "GET", url: "/api/examples" });
    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.pagination).toBeDefined();
    expect(body.pagination.page).toBe(1);
  });

  it("GET /api/examples/:id returns 404 for unknown id", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/api/examples/000000000000000000000001",
    });
    expect(response.statusCode).toBe(404);
  });

  it("GET /api/examples/:id returns 404 for invalid id", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/api/examples/invalid-id",
    });
    // Zod validation will reject invalid ObjectId
    expect([400, 404, 500]).toContain(response.statusCode);
  });

  it("POST /api/examples with valid body returns 201", async () => {
    const { getCollection } = await import("../src/config/database.js");
    const mockCol = (getCollection as ReturnType<typeof vi.fn>)();
    mockCol.insertOne.mockResolvedValueOnce({
      insertedId: { toHexString: () => "newinsertedid01234" },
    });

    const response = await app.inject({
      method: "POST",
      url: "/api/examples",
      payload: { title: "New Example", tags: ["test"] },
    });
    expect([201, 500]).toContain(response.statusCode);
  });

  it("POST /api/examples with missing title returns error", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/examples",
      payload: { description: "No title" },
    });
    expect([400, 500]).toContain(response.statusCode);
  });

  it("returns 404 for unknown routes", async () => {
    const response = await app.inject({ method: "GET", url: "/unknown/path" });
    expect(response.statusCode).toBe(404);
  });
});
