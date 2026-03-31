import axios, {
  AxiosError,
  AxiosHeaders,
  InternalAxiosRequestConfig,
} from "axios";
import { getToken, removeToken, removeUserType } from "./token";

// 🔥 DEBUG ENV
const ENV_API = process.env.EXPO_PUBLIC_API_URL;

console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("🌐 ENV API URL (RAW):", ENV_API);
console.log("🌐 TYPE:", typeof ENV_API);
console.log("🌐 LENGTH:", ENV_API?.length);

// 🔥 BASE URL FINAL
const baseURL =
  ENV_API && ENV_API.trim() !== ""
    ? ENV_API.trim()
    : "http://52.67.41.235:8080";

console.log("🚀 BASE URL DEFINIDA:", baseURL);
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

export const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔐 INTERCEPTOR REQUEST
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (!config.headers) {
      config.headers = new AxiosHeaders();
    }

    const token = await getToken();

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📤 REQUISIÇÃO SAINDO");
    console.log("➡️ MÉTODO:", (config.method || "GET").toUpperCase());
    console.log("➡️ BASE URL:", config.baseURL);
    console.log("➡️ ENDPOINT:", config.url);
    console.log(
      "➡️ URL FINAL:",
      `${config.baseURL ?? ""}${config.url ?? ""}`
    );
    console.log("🔑 TOKEN:", token ? "EXISTE ✅" : "NÃO EXISTE ❌");

    if (token && token.trim() !== "") {
      config.headers.set("Authorization", `Bearer ${token}`);
    } else {
      config.headers.delete("Authorization");
    }

    if (config.params) {
      console.log("📎 PARAMS:", config.params);
    }

    if (config.data) {
      console.log("📦 BODY:", config.data);
    }

    return config;
  },
  (error: AxiosError) => {
    console.log("❌ ERRO NA REQUISIÇÃO:", error.message);
    return Promise.reject(error);
  }
);

// 📥 INTERCEPTOR RESPONSE
api.interceptors.response.use(
  (response) => {
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("✅ RESPOSTA OK");
    console.log("➡️ STATUS:", response.status);
    console.log(
      "➡️ URL:",
      `${response.config.baseURL ?? ""}${response.config.url ?? ""}`
    );
    console.log("➡️ DADOS:", response.data);
    return response;
  },
  async (error: AxiosError) => {
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("❌❌❌ ERRO API ❌❌❌");

    console.log("➡️ MESSAGE:", error.message);
    console.log("➡️ CODE:", error.code);

    if (error.config) {
      console.log("➡️ URL FINAL:",
        `${error.config.baseURL ?? ""}${error.config.url ?? ""}`
      );
    }

    if (error.response) {
      console.log("🔥 STATUS:", error.response.status);
      console.log("🔥 DATA:", error.response.data);

      if (error.response.status === 401) {
        const url = error.config?.url ?? "";

        const rotaPublica =
          url === "/" ||
          url.startsWith("/auth/login") ||
          url.startsWith("/auth/register");

        if (!rotaPublica) {
          console.log("🔒 TOKEN EXPIRADO → LIMPANDO");
          await removeToken();
          await removeUserType();
        }
      }
    } else if (error.request) {
      console.log("🚨 SEM RESPOSTA DO SERVIDOR");
      console.log("🚨 POSSÍVEL CAUSA:");
      console.log("➡️ API OFFLINE");
      console.log("➡️ URL ERRADA");
      console.log("➡️ CORS / BLOQUEIO");
    }

    return Promise.reject(error);
  }
);

export default api;