import { http } from "@/src/api/http";

export type NotificationDTO = {
  id: number;
  mensagem: string;
  lida: boolean;
  criadoEm: string;
};

export async function minhasNotificacoes(): Promise<NotificationDTO[]> {
  return http.get<NotificationDTO[]>("/notificacoes/me");
}

export async function marcarLida(id: number) {
  return http.put<void>(`/notificacoes/${id}/lida`);
}

