import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "./api";
import {
  removeToken,
  removeUserType,
  setToken,
  setUserType,
} from "./token";

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
}

export interface AuthResponseData {
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

  if (valor === "COLETOR") return "COLETOR";
  return "DOADOR";
}

function extrairAuthData(body: any): AuthResponseData {
  if (body?.data && typeof body.data === "object") {
    return {
      token: body.data.token,
      id: body.data.id,
      nome: body.data.nome,
      email: body.data.email,
      cpf: body.data.cpf,
      tipo: body.data.tipo,
    };
  }

  return {
    token: body?.token,
    id: body?.id,
    nome: body?.nome,
    email: body?.email,
    cpf: body?.cpf,
    tipo: body?.tipo,
  };
}

export async function salvarUsuario(usuario: Usuario): Promise<void> {
  const usuarioNormalizado: Usuario = {
    ...usuario,
    nome: String(usuario.nome || "").trim(),
    email: String(usuario.email || "").trim().toLowerCase(),
    tipo: normalizarTipo(String(usuario.tipo || "DOADOR")),
    cpf: usuario.cpf ? normalizarCpf(String(usuario.cpf)) : undefined,
  };

  await AsyncStorage.setItem(USER_KEY, JSON.stringify(usuarioNormalizado));

  await AsyncStorage.multiSet([
    ["nomeUsuario", usuarioNormalizado.nome],
    ["emailUsuario", usuarioNormalizado.email],
    ["tipoUsuario", String(usuarioNormalizado.tipo)],
    ["tipo", String(usuarioNormalizado.tipo)],
    ["@tipoUsuario", String(usuarioNormalizado.tipo)],
  ]);

  if (usuarioNormalizado.id != null) {
    await AsyncStorage.multiSet([
      ["usuarioId", String(usuarioNormalizado.id)],
      ["idUsuario", String(usuarioNormalizado.id)],
    ]);
  }

  if (usuarioNormalizado.cpf) {
    await AsyncStorage.setItem("cpfUsuario", usuarioNormalizado.cpf);
  }
}

export async function obterUsuario(): Promise<Usuario | null> {
  const data = await AsyncStorage.getItem(USER_KEY);
  return data ? JSON.parse(data) : null;
}

export async function removerUsuario(): Promise<void> {
  await AsyncStorage.multiRemove([
    USER_KEY,
    "nomeUsuario",
    "emailUsuario",
    "tipoUsuario",
    "tipo",
    "@tipoUsuario",
    "usuarioId",
    "idUsuario",
    "cpfUsuario",
  ]);
}

export async function carregarSessaoSalva(): Promise<void> {
  const token = await AsyncStorage.getItem("@recicleplus_token");

  if (token && token.trim() !== "") {
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
): Promise<ApiResponse<AuthResponseData>> {
  const payload: CadastroRequest = {
    nome: String(nome || "").trim(),
    email: normalizarEmail(email),
    cpf: normalizarCpf(cpf),
    senha: normalizarSenha(senha),
    tipo: normalizarTipo(tipo),
  };

  console.log("📤 CADASTRO PAYLOAD:", payload);

  const response = await api.post<ApiResponse<AuthResponseData>>(
    "/auth/register",
    payload
  );

  console.log("📥 CADASTRO RESPONSE:", response.data);

  const body = response.data || {};
  const data = extrairAuthData(body);

  return {
    ...body,
    data,
  };
}

export async function fazerLogin(
  email: string,
  senha: string
): Promise<ApiResponse<AuthResponseData>> {
  const payload: LoginRequest = {
    email: normalizarEmail(email),
    senha: normalizarSenha(senha),
  };

  console.log("📤 LOGIN PAYLOAD:", payload);

  const response = await api.post<ApiResponse<AuthResponseData>>(
    "/auth/login",
    payload
  );

  console.log("📥 LOGIN RESPONSE BRUTA:", response.data);

  const body = response.data || {};
  const data = extrairAuthData(body);

  const token = String(data?.token || "").trim();

  if (!token) {
    throw new Error("Backend não retornou token no login.");
  }

  const usuario: Usuario = {
    id: data.id,
    nome: String(data?.nome || "").trim(),
    email: String(data?.email || payload.email).trim().toLowerCase(),
    cpf: data?.cpf ? normalizarCpf(data.cpf) : undefined,
    tipo: normalizarTipo(String(data?.tipo || "DOADOR")),
  };

  await setToken(token);
  await setUserType(String(usuario.tipo));
  await salvarUsuario(usuario);

  api.defaults.headers.common.Authorization = `Bearer ${token}`;

  console.log("✅ USUÁRIO SALVO:", usuario);
  console.log("✅ TOKEN SALVO:", token);

  return {
    ...body,
    data: {
      token,
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      cpf: usuario.cpf,
      tipo: String(usuario.tipo),
    },
  };
}