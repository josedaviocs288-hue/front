import { http } from "@/src/api/http";

export type RegisterRequest = {
  nome: string;
  email: string;
  cpf: string;
  senha: string;
  tipo: "doador" | "coletor";
};

export async function registerUser(payload: RegisterRequest) {
  const body = {
    nome: payload.nome,
    email: payload.email.trim().toLowerCase(),
    cpf: payload.cpf.replace(/\D/g, ""),
    senha: payload.senha,
    tipo: payload.tipo === "doador" ? "CLIENTE" : "COLETOR",
  };
  return http.post<any>("/auth/register", body);
}

