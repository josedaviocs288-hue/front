import AsyncStorage from "@react-native-async-storage/async-storage";
import { http, setAuthToken, clearAuthToken } from "@/src/api/http";

export type LoginRequest = {
  email: string;
  senha: string;
};

export type Usuario = {
  id: string;
  nome: string;
  email: string;
  foto?: string | null;
  tipo?: "doador" | "coletor";
};

type LoginResponse = {
  token: string;
  usuario: Usuario;
};

export async function login(payload: LoginRequest): Promise<Usuario> {
  const data = await http.post<LoginResponse>("/auth/login", payload);
  await setAuthToken(data.token);
  const usuario = normalizeUsuario(data.usuario);
  await AsyncStorage.setItem("@usuario", JSON.stringify(usuario));
  return usuario;
}

export async function getProfile(): Promise<Usuario> {
  const me = await http.get<Usuario>("/me");
  const user = normalizeUsuario(me);
  await AsyncStorage.setItem("@usuario", JSON.stringify(user));
  return user;
}

export async function logout(): Promise<void> {
  await clearAuthToken();
  await AsyncStorage.removeItem("@usuario");
}

function normalizeUsuario(u: any): Usuario {
  const tipoBack = (u?.tipo || "").toString().toUpperCase();
  const tipo: "doador" | "coletor" | undefined =
    tipoBack === "CLIENTE" ? "doador" :
    tipoBack === "COLETOR" ? "coletor" : undefined;
  return {
    id: String(u?.id ?? ""),
    nome: String(u?.nome ?? ""),
    email: String(u?.email ?? ""),
    foto: u?.foto ?? null,
    tipo,
  };
}
