import { api } from "./api";

export async function getTop10(tipo: "pontos" | "coletas") {
  try {
    console.log("🔍 Buscando ranking:", tipo);

    const response = await api.get(`/ranking/doadores`, {
      params: {
        limit: 10,
        tipo,
      },
    });

    console.log("✅ RESPOSTA:", response.data);

    return response.data;
  } catch (error: any) {
    console.log("❌ ERRO AO BUSCAR RANKING");

    if (error.response) {
      console.log("STATUS:", error.response.status);
      console.log("DATA:", error.response.data);
    } else {
      console.log("SEM RESPOSTA DO SERVIDOR");
    }

    throw error;
  }
}//tudo funcionando e muito e massa