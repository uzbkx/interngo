const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

export function getApiBase() {
  return API_BASE;
}

export async function apiFetch(
  path: string,
  options?: RequestInit
): Promise<Response> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options?.headers,
  };

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  // Auto-redirect on 401 (expired token)
  if (res.status === 401 && typeof window !== "undefined") {
    localStorage.removeItem("accessToken");
    // Try refresh
    const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    if (refreshRes.ok) {
      const data = await refreshRes.json();
      localStorage.setItem("accessToken", data.accessToken);
      // Retry original request
      return fetch(`${API_BASE}${path}`, {
        ...options,
        headers: {
          ...headers,
          Authorization: `Bearer ${data.accessToken}`,
        },
        credentials: "include",
      });
    }
    window.location.href = "/auth/login";
  }

  return res;
}

// Server-side fetch (no auth token needed for public endpoints)
export async function serverFetch(path: string): Promise<Response> {
  const internalUrl =
    process.env.API_INTERNAL_URL || API_BASE;
  return fetch(`${internalUrl}${path}`, {
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
  });
}
