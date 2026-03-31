import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "@recicleplus_token";
const USER_TYPE_KEY = "@recicleplus_user_type";

// ================= TOKEN =================

export async function setToken(token: string): Promise<void> {
  const valor = String(token || "").trim();

  await AsyncStorage.setItem(TOKEN_KEY, valor);
  await AsyncStorage.setItem("token", valor);
}

export async function getToken(): Promise<string | null> {
  const token = await AsyncStorage.getItem(TOKEN_KEY);

  if (token) return token;

  return await AsyncStorage.getItem("token");
}

export async function removeToken(): Promise<void> {
  await AsyncStorage.removeItem(TOKEN_KEY);
  await AsyncStorage.removeItem("token");
}

// ================= TIPO USUÁRIO =================

export async function setUserType(tipo: string): Promise<void> {
  const valor = String(tipo || "").trim().toUpperCase();

  await AsyncStorage.setItem(USER_TYPE_KEY, valor);

  await AsyncStorage.setItem("tipoUsuario", valor);
  await AsyncStorage.setItem("tipo", valor);
  await AsyncStorage.setItem("@tipoUsuario", valor);
}

export async function getUserType(): Promise<string | null> {
  const tipo1 = await AsyncStorage.getItem(USER_TYPE_KEY);
  if (tipo1) return tipo1;

  const tipo2 = await AsyncStorage.getItem("tipoUsuario");
  if (tipo2) return tipo2;

  const tipo3 = await AsyncStorage.getItem("tipo");
  if (tipo3) return tipo3;

  return await AsyncStorage.getItem("@tipoUsuario");
}

export async function removeUserType(): Promise<void> {
  await AsyncStorage.removeItem(USER_TYPE_KEY);

  await AsyncStorage.removeItem("tipoUsuario");
  await AsyncStorage.removeItem("tipo");
  await AsyncStorage.removeItem("@tipoUsuario");
}