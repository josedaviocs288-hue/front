import { Platform } from "react-native";

export type Usuario = {
  nome: string;
  foto?: string;
};

export function getUsuarioLogado(): Usuario {
  if (Platform.OS !== "web") {
    return { nome: "Usuário" };
  }

  const email =
    localStorage.getItem("usuarioLogado") ||
    sessionStorage.getItem("usuarioLogado");

  if (!email) return { nome: "Usuário" };

  const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
  const user = usuarios.find((u: any) => u.email === email);

  if (!user) return { nome: "Usuário" };

  return {
    nome: user.nome || "Usuário",
    foto: user.foto
  };
}
