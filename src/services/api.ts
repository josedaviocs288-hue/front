import axios, {
  AxiosError,
  AxiosHeaders,
  InternalAxiosRequestConfig,
} from "axios";
import { getToken, removeToken, removeUserType } from "./token";

const baseURL = "https://reciclemais.app.br";

console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("🚀 BASE URL DEFINIDA:", baseURL);
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

export const api = axios.create({
  baseURL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (!config.headers) {
      config.headers = new AxiosHeaders();
    }

    const token = await getToken();

    if (token && token.trim() !== "") {
      config.headers.set("Authorization", `Bearer ${token}`);
    } else {
      config.headers.delete("Authorization");
    }

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📤 REQUISIÇÃO SAINDO");
    console.log("➡️ MÉTODO:", (config.method || "GET").toUpperCase());
    console.log("➡️ BASE URL:", config.baseURL);
    console.log("➡️ ENDPOINT:", config.url);
    console.log("➡️ URL FINAL:", `${config.baseURL ?? ""}${config.url ?? ""}`);
    console.log("🔑 TOKEN:", token ? "EXISTE ✅" : "NÃO EXISTE ❌");

    if (config.data) {
      console.log("📦 BODY:", JSON.stringify(config.data, null, 2));
    }

    return config;
  },
  (error: AxiosError) => {
    console.log("❌ ERRO NA REQUISIÇÃO:", error.message);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("✅ RESPOSTA OK");
    console.log("➡️ STATUS:", response.status);
    console.log(
      "➡️ URL:",
      `${response.config.baseURL ?? ""}${response.config.url ?? ""}`
    );
    console.log("➡️ DADOS:", JSON.stringify(response.data, null, 2));
    return response;
  },
  async (error: AxiosError<any>) => {
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("❌❌❌ ERRO API ❌❌❌");
    console.log("➡️ MESSAGE:", error.message);
    console.log("➡️ CODE:", error.code);

    if (error.config) {
      console.log(
        "➡️ URL FINAL:",
        `${error.config.baseURL ?? ""}${error.config.url ?? ""}`
      );
    }

    if (error.response) {
      console.log("🔥 STATUS:", error.response.status);
      console.log("🔥 DATA:", JSON.stringify(error.response.data, null, 2));

      if (error.response.status === 401) {
        const url = error.config?.url ?? "";
        const rotaPublica =
          url === "/" ||
          url.startsWith("/auth/login") ||
          url.startsWith("/auth/register") ||
          url.startsWith("/actuator/health");

        if (!rotaPublica) {
          await removeToken();
          await removeUserType();
          delete api.defaults.headers.common.Authorization;
        }
      }
    } else if (error.request) {
      console.log("🚨 SEM RESPOSTA DO SERVIDOR");
      console.log("🚨 Isso costuma ser rede, DNS, bloqueio HTTP ou app antigo");
    } else {
      console.log("🚨 ERRO ANTES DE ENVIAR A REQUISIÇÃO");
    }

    return Promise.reject(error);
  }
);

export default api;