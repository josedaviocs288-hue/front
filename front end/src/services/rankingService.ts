import { http } from "@/src/api/http";

export type RankingItem = {
  id: number;
  nome: string;
  pontos: number;
};

export async function getTopDoadores(limit = 10, tipo = "kg"): Promise<RankingItem[]> {
  return http.get<RankingItem[]>(`/ranking/doadores?limit=${limit}&tipo=${tipo}`);
}

