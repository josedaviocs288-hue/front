export type PontoColeta = {
  id: string;
  nome: string;
  latitude: number;
  longitude: number;
  endereco?: string;
};

export const PONTOS_FIXOS_PADRAO: PontoColeta[] = [
  {
    id: "ecoponto-centro",
    nome: "Ecoponto Centro",
    latitude: -2.8857,
    longitude: -40.1202,
    endereco: "Centro",
  },
  {
    id: "praca-central",
    nome: "Praça Central",
    latitude: -2.8883,
    longitude: -40.1185,
    endereco: "Praça Central",
  },
  {
    id: "mercado-publico",
    nome: "Mercado Público",
    latitude: -2.8912,
    longitude: -40.121,
    endereco: "Mercado Público",
  },
  {
    id: "secretaria-meio-ambiente",
    nome: "Secretaria de Meio Ambiente",
    latitude: -2.8834,
    longitude: -40.1164,
    endereco: "Secretaria de Meio Ambiente",
  }
];