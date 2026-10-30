const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export type ArticleStatus = "publish" | "draft" | "thrash";

export interface Article {
  id: number;
  title: string;
  content: string;
  category: string;
  status: ArticleStatus;
  created_date: string;
  updated_date: string;
}

export interface ArticlePayload {
  title: string;
  content: string;
  category: string;
  status: ArticleStatus;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string>;
}

async function request<T>(
  path: string,
  options?: RequestInit,
): Promise<{ data: T | null; error: ApiError | null }> {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers ?? {}),
      },
    });

    if (res.status === 204) {
      return { data: null, error: null };
    }

    const json = await res.json();

    if (!res.ok) {
      return {
        data: null,
        error: json as ApiError,
      };
    }

    return { data: json as T, error: null };
  } catch (err) {
    return {
      data: null,
      error: { message: err instanceof Error ? err.message : "Network error" },
    };
  }
}

export async function listArticles(limit: number, offset: number) {
  return request<Article[]>(`/article/${limit}/${offset}`, {
    cache: "no-store",
  });
}

export async function getArticle(id: number) {
  return request<Article>(`/article/${id}`, { cache: "no-store" });
}

export async function createArticle(payload: ArticlePayload) {
  return request<Article>("/article/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateArticle(id: number, payload: ArticlePayload) {
  return request<Article>(`/article/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteArticle(id: number) {
  return request<null>(`/article/${id}`, { method: "DELETE" });
}
