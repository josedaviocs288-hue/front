import AsyncStorage from "@react-native-async-storage/async-storage";
import { ENV, buildUrl } from "@/src/config/env";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type ApiError = {
  status: number;
  message: string;
  details?: any;
};

let tokenCache: string | null = null;

export async function setAuthToken(token: string) {
  tokenCache = token;
  await AsyncStorage.setItem("@token", token);
}

export async function clearAuthToken() {
  tokenCache = null;
  await AsyncStorage.removeItem("@token");
}

async function getToken() {
  if (tokenCache !== null) return tokenCache;
  const t = await AsyncStorage.getItem("@token");
  tokenCache = t;
  return t;
}

async function request<T>(
  method: HttpMethod,
  path: string,
  body?: any,
  initHeaders?: Record<string, string>
): Promise<T> {
  const url = buildUrl(path);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ENV.apiTimeoutMs);

  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(initHeaders || {}),
  };

  const token = await getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const res = await fetch(url, {
      method,
      signal: controller.signal,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    clearTimeout(timeout);

    const text = await res.text();
    const isJson = (res.headers.get("content-type") || "").includes("application/json");
    const data = isJson && text ? JSON.parse(text) : (text as any);

    if (!res.ok) {
      const err: ApiError = {
        status: res.status,
        message: (data && (data.message || data.error)) || res.statusText,
        details: data,
      };
      throw err;
    }

    const unwrapped = (data && typeof data === "object" && "data" in data) ? (data as any).data : data;
    return unwrapped as T;
  } catch (e: any) {
    if (e?.name === "AbortError") {
      const err: ApiError = { status: 0, message: "Tempo de requisição excedido" };
      throw err;
    }
    throw e;
  }
}

export const http = {
  get: <T>(path: string, headers?: Record<string, string>) =>
    request<T>("GET", path, undefined, headers),
  post: <T>(path: string, body?: any, headers?: Record<string, string>) =>
    request<T>("POST", path, body, headers),
  put: <T>(path: string, body?: any, headers?: Record<string, string>) =>
    request<T>("PUT", path, body, headers),
  patch: <T>(path: string, body?: any, headers?: Record<string, string>) =>
    request<T>("PATCH", path, body, headers),
  delete: <T>(path: string, headers?: Record<string, string>) =>
    request<T>("DELETE", path, undefined, headers),
};
