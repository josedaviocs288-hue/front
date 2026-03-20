import { http } from "@/src/api/http";

export type ChatMessage = {
  id: number;
  coletaId: number;
  remetenteEmail: string;
  texto: string;
  enviadoEm: string;
};

export async function chatHistorico(coletaId: number): Promise<ChatMessage[]> {
  return http.get<ChatMessage[]>(`/chat/coleta/${coletaId}`);
}

