import Constants from "expo-constants";
import { Platform } from "react-native";

type Extra = {
  apiBaseUrl?: string;
  apiTimeoutMs?: number;
};

const extra = (Constants?.expoConfig?.extra || {}) as Extra;

function defaultBaseUrl() {
  if (Platform.OS === "android") return "http://10.0.2.2:8080";
  if (Platform.OS === "ios") return "http://localhost:8080";
  return "http://localhost:8080";
}

export const ENV = {
  apiBaseUrl: (extra.apiBaseUrl || "").trim() || defaultBaseUrl(),
  apiTimeoutMs: extra.apiTimeoutMs ?? 10000,
};

export function buildUrl(path: string) {
  const base = ENV.apiBaseUrl.replace(/\/+$/, "");
  const p = path.replace(/^\/+/, "");
  return `${base}/${p}`;
}

