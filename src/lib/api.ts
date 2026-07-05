import type { Article, UploadResponse, GenerateResponse, GenerateParams, LoginParams, LoginResponse, NewsListResponse, NewsItem, UpdateParams, DepartmentPayload, DepartmentRecord, RegisterEmployeePayload, RegisterEmployeeResponse, UserRecord } from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

// ─── Auth ───────────────────────────────────────────────────────────────────

export async function login(params: LoginParams): Promise<LoginResponse> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  const data = await res.json();
  if (!res.ok || data.error) {
    throw new Error(data?.message?.[0] || "Đăng nhập thất bại");
  }

  return data.data;
}

export async function getDepartments(token: string): Promise<DepartmentRecord[]> {
  const res = await fetch(`${BASE_URL}/department`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message?.[0] || data?.error || "Không thể tải phòng ban");
  }

  if (Array.isArray(data)) {
    return data as DepartmentRecord[];
  }

  if (Array.isArray(data?.data)) {
    return data.data as DepartmentRecord[];
  }

  return [];
}

export async function getUsers(token: string): Promise<UserRecord[]> {
  const res = await fetch(`${BASE_URL}/users`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message?.[0] || data?.error || "Không thể tải danh sách nhân viên");
  }

  if (Array.isArray(data)) {
    return data as UserRecord[];
  }

  if (Array.isArray(data?.data)) {
    return data.data as UserRecord[];
  }

  return [];
}

export async function getUserDetail(token: string, id: string): Promise<UserRecord> {
  const res = await fetch(`${BASE_URL}/users/detail?id=${id}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message?.[0] || data?.error || "Không thể tải chi tiết nhân viên");
  }

  return (data?.userWithoutPassword ?? data?.data ?? data) as UserRecord;
}

export async function createDepartment(payload: DepartmentPayload, token: string): Promise<DepartmentRecord> {
  const res = await fetch(`${BASE_URL}/department`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message?.[0] || data?.error || "Tạo phòng ban thất bại");
  }

  return (data?.data ?? data) as DepartmentRecord;
}

export async function registerEmployee(payload: RegisterEmployeePayload, token: string): Promise<RegisterEmployeeResponse> {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok || data.error) {
    throw new Error(data?.message?.[0] || data?.error || "Tạo nhân viên thất bại");
  }

  return (data?.data ?? data) as RegisterEmployeeResponse;
}

// ─── Upload Image ────────────────────────────────────────────────────────────

/**
 * Uploads an image file to the backend.
 * Returns the URL of the uploaded image.
 */
export async function uploadImage(file: File, token: string): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${BASE_URL}/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`Image upload failed: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<UploadResponse>;
}


// ─── Generate Article ─────────────────────────────────────────────────────────

/**
 * Calls the AI generator endpoint and returns generated title, subtitle, and blocks.
 */
export async function generateArticle(params: GenerateParams, token: string): Promise<GenerateResponse> {
  const formData = new FormData();
  formData.append("title", params.title);
  formData.append("subtitle", params.subtitle);
  if (params.text) formData.append("text", params.text);
  formData.append("slug", params.slug);
  formData.append("date", params.date);
  if (params.blocks) formData.append("blocks", params.blocks);
  if (params.imageFile) formData.append("image", params.imageFile);

  const res = await fetch(`${BASE_URL}/news-generator/generate`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`Generate failed: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<GenerateResponse>;
}

// ─── Get Articles ─────────────────────────────────────────────────────────────

/**
 * Fetches the list of articles.
 */
export async function getArticles(token?: string, page = 1, limit = 10): Promise<NewsListResponse> {
  const headers: HeadersInit = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}/news?page=${page}&limit=${limit}`, {
    method: "GET",
    headers,
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch articles: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  if (data?.data) {
    return data.data; // The outer object has a `data` field which is the NewsListResponse
  }
  
  return data as NewsListResponse;
}

/**
 * Fetches a single article by its slug.
 */
export async function getArticleBySlug(slug: string, token?: string): Promise<NewsItem> {
  const headers: HeadersInit = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}/news/${slug}`, {
    method: "GET",
    headers,
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch article: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  if (data?.data) {
    return data.data;
  }
  
  return data as NewsItem;
}

// ─── Update Article ───────────────────────────────────────────────────────────

/**
 * Updates an existing article by ID.
 */
export async function updateArticle(id: string, params: UpdateParams, token: string): Promise<NewsItem> {
  const formData = new FormData();
  if (params.title) formData.append("title", params.title);
  if (params.subtitle) formData.append("subtitle", params.subtitle);
  if (params.date) formData.append("date", params.date);
  if (params.blocks) formData.append("blocks", params.blocks);
  if (params.imageFile) formData.append("image", params.imageFile);

  const res = await fetch(`${BASE_URL}/news/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`Update failed: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  if (data?.data) {
    return data.data;
  }

  return data as NewsItem;
}
