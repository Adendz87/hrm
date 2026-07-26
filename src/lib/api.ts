import type { Article, UploadResponse, GenerateResponse, GenerateParams, LoginParams, LoginResponse, NewsListResponse, NewsItem, UpdateParams, DepartmentPayload, DepartmentRecord, RegisterEmployeePayload, RegisterEmployeeResponse, UserRecord, RolePayload, RoleRecord, ContractRecord, CreateContractParams } from "./types";
import { clearAuth } from "./auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

// ─── Central fetch wrapper ───────────────────────────────────────────────────
// Khi nhận 401: thử refresh token → retry request gốc → nếu vẫn fail thì /login
let refreshPromise: Promise<boolean> | null = null;

async function tryRefresh(): Promise<boolean> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const res = await fetch(`${BASE_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });
      return res.ok;
    } catch {
      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

async function apiFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const res = await fetch(input, init);

  if (res.status === 401) {
    const urlString = typeof input === "string" ? input : input.toString();

    // Nếu chính endpoint /auth/refresh bị 401 thì không thử refresh lại nữa
    if (urlString.includes("/auth/refresh")) {
      clearAuth();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }

    // Thử refresh access token (các request đồng thời sẽ dùng chung 1 promise refresh)
    const refreshed = await tryRefresh();

    if (refreshed) {
      // Retry request gốc với cookie mới (server đã set qua Set-Cookie)
      const retryRes = await fetch(input, init);
      if (retryRes.status !== 401) return retryRes;
    }

    // Refresh cũng fail → đăng xuất
    clearAuth();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
  }

  return res;
}

// ─── Auth ───────────────────────────────────────────────────────────────────

export async function login(params: LoginParams): Promise<LoginResponse> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  const data = await res.json();

  if (!res.ok || data.error) {
    throw new Error(data?.message?.[0] || "Đăng nhập thất bại");
  }

  return data.data;
}

export async function getDepartments(): Promise<DepartmentRecord[]> {
  const res = await apiFetch(`${BASE_URL}/department`, {
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message?.[0] || data?.error);
  }

  return Array.isArray(data) ? data : (data.data ?? []);
}

export async function getUsers(): Promise<UserRecord[]> {
  const res = await apiFetch(`${BASE_URL}/users`, {
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message?.[0] || data?.error);
  }

  return data.data ?? [];
}

export async function getUserDetail(id: string): Promise<UserRecord> {
  const res = await apiFetch(`${BASE_URL}/users/detail?id=${id}`, {
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message?.[0] || data?.error);
  }

  return data.userWithoutPassword ?? data.data;
}

export async function createDepartment(
  payload: DepartmentPayload,
): Promise<DepartmentRecord> {
  const res = await apiFetch(`${BASE_URL}/department`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message?.[0] || data?.error);
  }

  return data.data;
}

export async function updateDepartment(
  id: string,
  payload: Partial<DepartmentPayload>,
): Promise<DepartmentRecord> {
  const res = await apiFetch(`${BASE_URL}/department/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message?.[0] || data?.error);
  }

  return data.data ?? data;
}

export async function deleteDepartment(id: string): Promise<void> {
  const res = await apiFetch(`${BASE_URL}/department/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.message?.[0] || data?.error || "Xóa phòng ban thất bại.");
  }
}

export async function getRoles(): Promise<RoleRecord[]> {
  const res = await apiFetch(`${BASE_URL}/role`, {
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message?.[0] || data?.error);
  }

  return Array.isArray(data) ? data : (data.data ?? []);
}

export async function createRole(payload: RolePayload): Promise<RoleRecord> {
  const res = await apiFetch(`${BASE_URL}/role`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message?.[0] || data?.error);
  }

  return data.data ?? data;
}

export async function updateRole(
  id: string,
  payload: Partial<RolePayload>,
): Promise<RoleRecord> {
  const res = await apiFetch(`${BASE_URL}/role/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message?.[0] || data?.error || "Cập nhật vai trò thất bại.");
  }

  return data.data ?? data;
}

export async function deleteRole(id: string): Promise<void> {
  const res = await apiFetch(`${BASE_URL}/role/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.message?.[0] || data?.error || "Xóa vai trò thất bại.");
  }
}


export async function registerEmployee(
  payload: RegisterEmployeePayload,
): Promise<RegisterEmployeeResponse> {
  const res = await apiFetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message?.[0] || data?.error);
  }

  return data.data;
}

// ─── Upload Image ────────────────────────────────────────────────────────────

/**
 * Uploads an image file to the backend.
 * Returns the URL of the uploaded image.
 */
export async function uploadImage(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await apiFetch(`${BASE_URL}/upload`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Upload thất bại");
  }

  return res.json();
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

  const res = await apiFetch(`${BASE_URL}/news-generator/generate`, {
    method: "POST",
    credentials: "include",
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

  const res = await apiFetch(
    `${BASE_URL}/news?page=${page}&limit=${limit}`,
    {
      credentials: "include",
    },
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch articles: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  if (data?.data) {
    return data.data; // The outer object has a `data` field which is the NewsListResponse
  }

  return data as NewsListResponse;
}

export async function logout(): Promise<void> {
  await fetch(`${BASE_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
}

/**
 * Fetches a single article by its slug.
 */
export async function getArticleBySlug(
  slug: string,
): Promise<NewsItem> {
  const res = await apiFetch(`${BASE_URL}/news/${slug}`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch article: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();

  return data?.data ?? data;
}

// ─── Update Article ───────────────────────────────────────────────────────────

/**
 * Updates an existing article by ID.
 */
export async function updateArticle(
  id: string,
  params: UpdateParams,
): Promise<NewsItem> {
  const formData = new FormData();

  if (params.title) formData.append("title", params.title);
  if (params.subtitle) formData.append("subtitle", params.subtitle);
  if (params.date) formData.append("date", params.date);
  if (params.blocks) formData.append("blocks", params.blocks);
  if (params.imageFile) formData.append("image", params.imageFile);

  const res = await apiFetch(`${BASE_URL}/news/${id}`, {
    method: "PATCH",
    credentials: "include",
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`Update failed: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();

  return data?.data ?? data;
}

// ─── Contracts ───────────────────────────────────────────────────────────────

export async function getContracts(): Promise<ContractRecord[]> {
  const res = await apiFetch(`${BASE_URL}/contract`, {
    method: "GET",
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message?.[0] || data?.error || "Không thể tải danh sách hợp đồng.");
  }

  return data.data ?? data;
}

export async function createContract(params: CreateContractParams): Promise<ContractRecord> {
  const formData = new FormData();
  formData.append("employee_id", params.employee_id);
  formData.append("contract_number", params.contract_number);
  formData.append("contract_name", params.contract_name);
  formData.append("type", params.type);
  formData.append("salary", String(params.salary));
  formData.append("start_date", params.start_date);
  formData.append("end_date", params.end_date);
  if (params.signed_date) formData.append("signed_date", params.signed_date);
  if (params.note) formData.append("note", params.note);
  if (params.file) formData.append("file", params.file);

  const res = await apiFetch(`${BASE_URL}/contract`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message?.[0] || data?.error || "Tạo hợp đồng thất bại.");
  }

  return data.data ?? data;
}

