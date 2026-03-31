import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "./api";
import { setToken, removeToken, setUserType, removeUserType } from "./token";

const USER_KEY = "@recicleplus_user";

export type TipoUsuario = "DOADOR" | "COLETOR";

export interface Usuario {
  id?: number;
  nome: string;
  email: string;
  cpf?: string;
  tipo: TipoUsuario | string;
}

export interface CadastroRequest {
  nome: string;
  email: string;
  cpf: string;
  senha: string;
  tipo: string;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface ApiResponse<T = any> {
  success?: boolean;
  message?: string;
  data?: T;
  status?: number;
  code?: string;
  path?: string;
  timestamp?: string;
  traceId?: string;

  token?: string;
  id?: number;
  nome?: string;
  email?: string;
  cpf?: string;
  tipo?: string;
}

export interface LoginResponseData {
  id?: number;
  nome?: string;
  email?: string;
  cpf?: string;
  tipo?: string;
  token?: string;
}

function normalizarEmail(email: string): string {
  return String(email || "").trim().toLowerCase();
}

function normalizarSenha(senha: string): string {
  return String(senha || "").trim();
}

function normalizarCpf(cpf: string): string {
  return String(cpf || "").replace(/\D/g, "");
}

function normalizarTipo(tipo: string): TipoUsuario {
  const valor = String(tipo || "").trim().toUpperCase();

  if (valor === "DOADOR") return "DOADOR";
  if (valor === "COLETOR") return "COLETOR";

  return valor as TipoUsuario;
}

export async function salvarUsuario(usuario: Usuario): Promise<void> {
  const tipo = String(usuario.tipo || "").trim().toUpperCase();
  const nome = String(usuario.nome || "").trim();
  const email = String(usuario.email || "").trim().toLowerCase();

  const usuarioNormalizado: Usuario = {
    ...usuario,
    nome,
    email,
    tipo,
  };

  await AsyncStorage.setItem(USER_KEY, JSON.stringify(usuarioNormalizado));

  await AsyncStorage.setItem("nomeUsuario", nome);
  await AsyncStorage.setItem("emailUsuario", email);
  await AsyncStorage.setItem("tipoUsuario", tipo);
  await AsyncStorage.setItem("tipo", tipo);
  await AsyncStorage.setItem("@tipoUsuario", tipo);

  if (usuario.id != null) {
    await AsyncStorage.setItem("usuarioId", String(usuario.id));
    await AsyncStorage.setItem("idUsuario", String(usuario.id));
  }

  if (usuario.cpf) {
    await AsyncStorage.setItem("cpfUsuario", String(usuario.cpf));
  }
}

export async function obterUsuario(): Promise<Usuario | null> {
  const data = await AsyncStorage.getItem(USER_KEY);
  return data ? JSON.parse(data) : null;
}

export async function removerUsuario(): Promise<void> {
  await AsyncStorage.removeItem(USER_KEY);
  await AsyncStorage.removeItem("nomeUsuario");
  await AsyncStorage.removeItem("emailUsuario");
  await AsyncStorage.removeItem("tipoUsuario");
  await AsyncStorage.removeItem("tipo");
  await AsyncStorage.removeItem("@tipoUsuario");
  await AsyncStorage.removeItem("usuarioId");
  await AsyncStorage.removeItem("idUsuario");
  await AsyncStorage.removeItem("cpfUsuario");
}

export async function carregarSessaoSalva(): Promise<void> {
  const token = await AsyncStorage.getItem("@recicleplus_token");

  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    console.log("✅ Token carregado no app");
  } else {
    delete api.defaults.headers.common.Authorization;
    console.log("ℹ️ Nenhum token salvo");
  }
}

export async function logout(): Promise<void> {
  await removeToken();
  await removeUserType();
  await removerUsuario();
  delete api.defaults.headers.common.Authorization;
  console.log("🚪 Logout realizado");
}

export async function fazerCadastro(
  nome: string,
  email: string,
  cpf: string,
  senha: string,
  tipo: string
): Promise<ApiResponse> {
  const payload: CadastroRequest = {
    nome: String(nome || "").trim(),
    email: normalizarEmail(email),
    cpf: normalizarCpf(cpf),
    senha: normalizarSenha(senha),
    tipo: normalizarTipo(tipo),
  };

  console.log("📤 CADASTRO PAYLOAD:", payload);

  const response = await api.post<ApiResponse>("/auth/register", payload);

  console.log("📥 CADASTRO RESPONSE:", response.data);

  return response.data;
}

export async function fazerLogin(email: string, senha: string) {
  const payload: LoginRequest = {
    email: normalizarEmail(email),
    senha: normalizarSenha(senha),
  };

  console.log("📤 LOGIN PAYLOAD:", payload);

  const response = await api.post<ApiResponse<LoginResponseData>>(
    "/auth/login",
    payload
  );

  console.log("📥 LOGIN RESPONSE BRUTA:", response.data);

  const body = response.data || {};

  const data: LoginResponseData =
    body?.data && typeof body.data === "object"
      ? body.data
      : {
          token: body.token,
          id: body.id,
          nome: body.nome,
          email: body.email,
          cpf: body.cpf,
          tipo: body.tipo,
        };

  const token = String(data?.token || "").trim();

  if (!token) {
    throw new Error("Backend não retornou token no login.");
  }

  const usuario: Usuario = {
    id: data.id,
    nome: String(data?.nome || "").trim(),
    email: String(data?.email || payload.email).trim().toLowerCase(),
    cpf: data?.cpf,
    tipo: normalizarTipo(String(data?.tipo || "")),
  };

  await setToken(token);
  await setUserType(String(usuario.tipo || ""));
  await salvarUsuario(usuario);

  api.defaults.headers.common.Authorization = `Bearer ${token}`;

  console.log("✅ USUÁRIO SALVO:", usuario);
  console.log("✅ TOKEN SALVO:", token);

  return {
    data: {
      token,
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      cpf: usuario.cpf,
      tipo: usuario.tipo,
    },
  };
}