import { http } from "@/src/api/http";

export type ColetaCreatePayload = {
  materiais: string[];
  quantidadeKg?: number;
  quantidadeUnidades?: number;
  referencia?: string;
  bairro?: string;
};

function mapMaterial(label: string): string {
  const m = label.toLowerCase();
  if (m.includes("plást")) return "PLASTICO";
  if (m.includes("vidr")) return "VIDRO";
  if (m.includes("pap")) return "PAPEL";
  if (m.includes("metal")) return "METAL";
  if (m.includes("eletr")) return "ELETRONICO";
  return "PAPEL";
}

export async function criarColetaCasa(params: {
  tipoReciclavel: string;
  tipoQuantidade: "quilo" | "unidade";
  quantidade: string;
  localizacao: string;
}) {
  const payload: any = {
    materiais: [mapMaterial(params.tipoReciclavel)],
    quantidadeDescricao:
      params.tipoQuantidade === "quilo" ? "peso em kg" : "unidades",
    referencia: params.localizacao,
  };
  if (params.tipoQuantidade === "quilo") {
    payload.quantidadeKg = Number(params.quantidade.replace(",", "."));
  } else {
    payload.quantidadeUnidades = Number(params.quantidade);
  }
  return http.post<any>("/coletas", payload);
}

export async function criarColetaFixa(params: {
  tipoReciclavel: string;
  tipoQuantidade: "quilo" | "unidade";
  quantidade: string;
  lixeira: string;
}) {
  const payload: any = {
    materiais: [mapMaterial(params.tipoReciclavel)],
    quantidadeDescricao:
      params.tipoQuantidade === "quilo" ? "peso em kg" : "unidades",
    referencia: `Lixeira: ${params.lixeira}`,
  };
  if (params.tipoQuantidade === "quilo") {
    payload.quantidadeKg = Number(params.quantidade.replace(",", "."));
  } else {
    payload.quantidadeUnidades = Number(params.quantidade);
  }
  return http.post<any>("/coletas", payload);
}

export async function historicoColetor(): Promise<any[]> {
  return http.get<any[]>("/coletas/coletor/me");
}

export async function atualizarStatus(id: number, status: string) {
  return http.patch<any>(`/coletas/${id}/status?status=${encodeURIComponent(status)}`);
}
