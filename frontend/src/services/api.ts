/**
 * API service layer — all backend communication goes through here.
 * The VITE_API_URL environment variable controls the target.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

export interface ApiError {
  statusCode: number;
  error: string;
  message: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

export interface Example {
  id: string;
  title: string;
  description?: string;
  tags: string[];
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface HealthStatus {
  status: "healthy" | "degraded";
  timestamp: string;
  version: string;
  environment: string;
  uptime: number;
  database: {
    connected: boolean;
  };
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${path}`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    let errorBody: ApiError;
    try {
      errorBody = await response.json();
    } catch {
      errorBody = {
        statusCode: response.status,
        error: "Request Failed",
        message: response.statusText,
      };
    }
    throw errorBody;
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

// ── API functions ──────────────────────────────────────────────────────

export async function getHealth(): Promise<HealthStatus> {
  return request<HealthStatus>("/health");
}

export async function getExamples(params?: {
  page?: number;
  limit?: number;
  search?: string;
  tag?: string;
}): Promise<PaginatedResponse<Example>> {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.search) query.set("search", params.search);
  if (params?.tag) query.set("tag", params.tag);

  const qs = query.toString();
  return request<PaginatedResponse<Example>>(
    `/api/examples${qs ? `?${qs}` : ""}`,
  );
}

export async function getExampleById(id: string): Promise<Example> {
  return request<Example>(`/api/examples/${id}`);
}

export async function createExample(data: {
  title: string;
  description?: string;
  tags?: string[];
}): Promise<Example> {
  return request<Example>("/api/examples", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function deleteExample(id: string): Promise<void> {
  return request<void>(`/api/examples/${id}`, { method: "DELETE" });
}
