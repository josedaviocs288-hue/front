import { http } from "@/src/api/http";

export async function criarAvaliacao(payload: {
  coletaId: number;
  nota: number;
  comentario?: string;
}) {
  return http.post<any>("/avaliacoes", {
    coletaId: payload.coletaId,
    nota: payload.nota,
    comentario: payload.comentario ?? "",
  });
}

