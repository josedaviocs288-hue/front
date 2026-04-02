import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "@recicleplus_token";
const USER_TYPE_KEY = "@recicleplus_user_type";

// ================= TOKEN =================

export async function setToken(token: string): Promise<void> {
  const valor = String(token || "").trim();

  if (!valor) return;

  await AsyncStorage.multiSet([
    [TOKEN_KEY, valor],
    ["token", valor],
  ]);
}

export async function getToken(): Promise<string | null> {
  const token =
    (await AsyncStorage.getItem(TOKEN_KEY)) ||
    (await AsyncStorage.getItem("token"));

  if (!token || token.trim() === "") return null;

  return token;
}

export async function removeToken(): Promise<void> {
  await AsyncStorage.multiRemove([TOKEN_KEY, "token"]);
}

// ================= TIPO USUÁRIO =================

export async function setUserType(tipo: string): Promise<void> {
  const valor = String(tipo || "").trim().toUpperCase();

  if (!valor) return;

  await AsyncStorage.multiSet([
    [USER_TYPE_KEY, valor],
    ["tipoUsuario", valor],
    ["tipo", valor],
    ["@tipoUsuario", valor],
  ]);
}

export async function getUserType(): Promise<string | null> {
  const tipo =
    (await AsyncStorage.getItem(USER_TYPE_KEY)) ||
    (await AsyncStorage.getItem("tipoUsuario")) ||
    (await AsyncStorage.getItem("tipo")) ||
    (await AsyncStorage.getItem("@tipoUsuario"));

  if (!tipo || tipo.trim() === "") return null;

  return tipo;
}

export async function removeUserType(): Promise<void> {
  await AsyncStorage.multiRemove([
    USER_TYPE_KEY,
    "tipoUsuario",
    "tipo",
    "@tipoUsuario",
  ]);
}