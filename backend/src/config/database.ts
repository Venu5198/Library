import { MongoClient, Db, Collection, Document, ObjectId } from "mongodb";

// Minimal logger interface compatible with both pino and Fastify's logger
export interface MinimalLogger {
  info(obj: Record<string, unknown> | string, msg?: string): void;
  warn(obj: Record<string, unknown> | string, msg?: string): void;
  error(obj: Record<string, unknown> | string, msg?: string): void;
}

export interface DatabaseConnection {
  client: MongoClient;
  db: Db;
}

let connection: DatabaseConnection | null = null;

export async function connectDatabase(
  uri: string,
  dbName: string,
  logger: MinimalLogger
): Promise<DatabaseConnection> {
  if (connection) {
    return connection;
  }

  logger.info({ uri: uri.replace(/\/\/[^:]+:[^@]+@/, "//***:***@"), db: dbName }, "Connecting to MongoDB");

  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  });

  await client.connect();
  const db = client.db(dbName);

  // Verify connection with a ping
  await db.command({ ping: 1 });

  connection = { client, db };
  logger.info({ db: dbName }, "MongoDB connected successfully");

  return connection;
}

export async function disconnectDatabase(logger: MinimalLogger): Promise<void> {
  if (!connection) return;
  logger.info("Disconnecting from MongoDB");
  await connection.client.close();
  connection = null;
  logger.info("MongoDB disconnected");
}

export async function checkDatabaseHealth(logger?: MinimalLogger): Promise<boolean> {
  if (!connection) {
    logger?.warn("Health check: MongoDB not connected");
    return false;
  }

  try {
    await connection.db.command({ ping: 1 });
    return true;
  } catch (err) {
    logger?.error({ err }, "Health check: MongoDB ping failed");
    return false;
  }
}

export function getDatabase(): Db {
  if (!connection) {
    throw new Error("Database not connected. Call connectDatabase() first.");
  }
  return connection.db;
}

export function getCollection<T extends Document>(name: string): Collection<T> {
  return getDatabase().collection<T>(name);
}

export { ObjectId };
