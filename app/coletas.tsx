import { getUserType } from "@/src/services/token";
import { api } from "@/src/services/api";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Usuario = {
  id?: number;
  nome?: string;
  email?: string;
};

type StatusDoacao =
  | "PENDENTE"
  | "ACEITA"
  | "EM_ROTA"
  | "EM_ANDAMENTO"
  | "CONCLUIDA"
  | "CANCELADA"
  | string;

type Doacao = {
  id: number;
  doador?: Usuario | null;
  coletor?: Usuario | null;
  status?: StatusDoacao;
  quantidadeDescricao?: string | null;
  quantidadeKg?: number | null;
  quantidadeUnidades?: number | null;
  tipoQuantidade?: string | null;
  rua?: string | null;
  numero?: string | null;
  bairro?: string | null;
  cidade?: string | null;
  uf?: string | null;
  referencia?: string | null;
  observacoes?: string | null;
  materiais?: string[] | string | null;
  dataHoraSolicitada?: string | null;
  criadoEm?: string | null;
  user?: Usuario | null;
};

type ApiResponse<T> = {
  success?: boolean;
  message?: string;
  data?: T;
  timestamp?: string;
};

type AcaoStatus = "ACEITAR" | "EM_ROTA" | "CONCLUIR";

export default function ColetasScreen() {
  const [tipoUsuario, setTipoUsuario] = useState("");
  const [carregandoTipo, setCarregandoTipo] = useState(true);
  const [doacoes, setDoacoes] = useState<Doacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [erro, setErro] = useState("");
  const [atualizandoId, setAtualizandoId] = useState<number | null>(null);

  useEffect(() => {
    async function carregarTipo() {
      try {
        const tipo = await getUserType();
        const normalizado = String(tipo || "").trim().toUpperCase();

        console.log("🔥 TIPO USUARIO SALVO:", normalizado);
        setTipoUsuario(normalizado || "DOADOR");
      } catch (error) {
        console.log("❌ ERRO AO LER TIPO USUARIO:", error);
        setTipoUsuario("DOADOR");
      } finally {
        setCarregandoTipo(false);
      }
    }

    carregarTipo();
  }, []);

  const extrairListaDoacoes = (payload: unknown): Doacao[] => {
    if (Array.isArray(payload)) return payload as Doacao[];

    const obj = payload as any;

    if (Array.isArray(obj?.data)) return obj.data;
    if (Array.isArray(obj?.content)) return obj.content;
    if (Array.isArray(obj?.doacoes)) return obj.doacoes;

    return [];
  };

  const extrairMensagemErro = (error: any) => {
    return (
      error?.response?.data?.message ||
      error?.response?.data?.detail ||
      error?.message ||
      "Não foi possível concluir a operação."
    );
  };

  const carregarDoacoes = useCallback(async (silencioso = false) => {
    try {
      if (!silencioso) setLoading(true);
      setErro("");

      const response = await api.get<ApiResponse<Doacao[]>>("/doacoes");

      console.log("🔥 RESPOSTA BRUTA /doacoes:", response.data);

      const sucesso = response.data?.success;
      const lista = extrairListaDoacoes(response.data?.data ?? response.data);

      if (sucesso === false) {
        throw new Error(response.data?.message || "Não foi possível carregar as doações.");
      }

      console.log("🔥 DOACOES TRATADAS:", lista);
      console.log("🔥 TOTAL DE DOACOES:", lista.length);

      setDoacoes(lista);
    } catch (error: any) {
      console.log("❌ ERRO DOACOES:", error?.response?.data || error?.message || error);
      setErro(extrairMensagemErro(error));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (carregandoTipo) return;

    if (tipoUsuario === "COLETOR") {
      carregarDoacoes();
    } else {
      setLoading(false);
    }
  }, [tipoUsuario, carregandoTipo, carregarDoacoes]);

  function onRefresh() {
    setRefreshing(true);
    carregarDoacoes(true);
  }

  function formatarData(data?: string | null) {
    if (!data) return "Não informado";
    const d = new Date(data);
    if (Number.isNaN(d.getTime())) return data;
    return d.toLocaleString("pt-BR");
  }

  function montarEndereco(doacao: Doacao) {
    const partes = [doacao.rua, doacao.numero, doacao.bairro, doacao.cidade, doacao.uf]
      .map((item) => (item ?? "").toString().trim())
      .filter(Boolean);

    return partes.join(", ") || "Endereço não informado";
  }

  function materiaisTexto(materiais?: string[] | string | null) {
    if (!materiais) return "Não informado";

    if (Array.isArray(materiais)) {
      return materiais.length > 0 ? materiais.join(", ") : "Não informado";
    }

    if (typeof materiais === "string") {
      if (!materiais.trim()) return "Não informado";

      return materiais
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
        .join(", ");
    }

    return "Não informado";
  }

  function quantidadeTexto(item: Doacao) {
    if (item.quantidadeDescricao?.trim()) return item.quantidadeDescricao;

    if (
      item.quantidadeKg !== null &&
      item.quantidadeKg !== undefined &&
      Number(item.quantidadeKg) > 0
    ) {
      return `${item.quantidadeKg} kg`;
    }

    if (
      item.quantidadeUnidades !== null &&
      item.quantidadeUnidades !== undefined &&
      Number(item.quantidadeUnidades) > 0
    ) {
      return `${item.quantidadeUnidades} unidades`;
    }

    return "Não informada";
  }

  function atualizarListaLocal(id: number, novoStatus: string) {
    setDoacoes((listaAtual) =>
      listaAtual.map((item) =>
        item.id === id ? { ...item, status: novoStatus } : item
      )
    );
  }

  async function atualizarStatus(id: number, acao: AcaoStatus) {
    try {
      setAtualizandoId(id);

      console.log("🚀 CLIQUE BOTÃO:", acao, "ID:", id);

      let rota = "";
      let proximoStatus = "";

      if (acao === "ACEITAR") {
        rota = `/doacoes/${id}/aceitar`;
        proximoStatus = "ACEITA";
      } else if (acao === "EM_ROTA") {
        rota = `/doacoes/${id}/em-rota`;
        proximoStatus = "EM_ROTA";
      } else {
        rota = `/doacoes/${id}/concluir`;
        proximoStatus = "CONCLUIDA";
      }

      console.log("➡️ CHAMANDO ROTA:", rota);

      const response = await api.patch<ApiResponse<any>>(rota);

      console.log("✅ STATUS ATUALIZADO:", response.data);

      if (response.data?.success === false) {
        throw new Error(response.data?.message || "Não foi possível atualizar a doação.");
      }

      const statusReal = response.data?.data?.status || proximoStatus;

      atualizarListaLocal(id, statusReal);

      if (statusReal === "CONCLUIDA") {
        setDoacoes((listaAtual) => listaAtual.filter((item) => item.id !== id));
      }

      Alert.alert("Sucesso", response.data?.message || "Doação atualizada com sucesso.");

      await carregarDoacoes(true);
    } catch (error: any) {
      console.log(
        "❌ ERRO STATUS COMPLETO:",
        error?.response?.data || error?.message || error
      );

      Alert.alert("Erro", extrairMensagemErro(error));
    } finally {
      setAtualizandoId(null);
    }
  }

  function corStatus(status?: string) {
    switch (status) {
      case "PENDENTE":
        return "#f59e0b";
      case "ACEITA":
        return "#2563eb";
      case "EM_ROTA":
      case "EM_ANDAMENTO":
        return "#0ea5e9";
      case "CONCLUIDA":
        return "#16a34a";
      case "CANCELADA":
        return "#dc2626";
      default:
        return "#6b7280";
    }
  }

  const doacoesAtivas = useMemo(() => {
    return doacoes.filter(
      (item) => item.status !== "CONCLUIDA" && item.status !== "CANCELADA"
    );
  }, [doacoes]);

  function renderBotoes(item: Doacao, processando: boolean) {
    if (!item?.id) return null;

    if (item.status === "CONCLUIDA" || item.status === "CANCELADA") {
      return null;
    }

    if (item.status === "PENDENTE") {
      return (
        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.blueButton,
            processando && styles.disabledButton,
          ]}
          onPress={() => atualizarStatus(item.id, "ACEITAR")}
          disabled={processando}
          activeOpacity={0.8}
        >
          <Text style={styles.actionText}>
            {processando ? "Atualizando..." : "Aceitar"}
          </Text>
        </TouchableOpacity>
      );
    }

    if (item.status === "ACEITA") {
      return (
        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.orangeButton,
            processando && styles.disabledButton,
          ]}
          onPress={() => atualizarStatus(item.id, "EM_ROTA")}
          disabled={processando}
          activeOpacity={0.8}
        >
          <Text style={styles.actionText}>
            {processando ? "Atualizando..." : "Em rota"}
          </Text>
        </TouchableOpacity>
      );
    }

    if (item.status === "EM_ROTA" || item.status === "EM_ANDAMENTO") {
      return (
        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.greenButton,
            processando && styles.disabledButton,
          ]}
          onPress={() => atualizarStatus(item.id, "CONCLUIR")}
          disabled={processando}
          activeOpacity={0.8}
        >
          <Text style={styles.actionText}>
            {processando ? "Atualizando..." : "Concluir"}
          </Text>
        </TouchableOpacity>
      );
    }

    return null;
  }

  function renderItem({ item }: { item: Doacao }) {
    const processando = atualizandoId === item.id;
    const nomeDoador =
      item.doador?.nome ||
      item.user?.nome ||
      (item.doador?.id ? `Doador #${item.doador.id}` : "Doador");

    return (
      <View style={styles.card}>
        <View style={styles.cardTop}>
          <Text style={styles.nomeDoador}>{nomeDoador}</Text>
          <View style={[styles.badge, { backgroundColor: corStatus(item.status) }]}>
            <Text style={styles.badgeText}>{item.status || "PENDENTE"}</Text>
          </View>
        </View>

        <Text style={styles.info}>
          <Text style={styles.label}>Materiais: </Text>
          {materiaisTexto(item.materiais)}
        </Text>

        <Text style={styles.info}>
          <Text style={styles.label}>Quantidade: </Text>
          {quantidadeTexto(item)}
        </Text>

        <Text style={styles.info}>
          <Text style={styles.label}>Endereço: </Text>
          {montarEndereco(item)}
        </Text>

        <Text style={styles.info}>
          <Text style={styles.label}>Referência: </Text>
          {item.referencia || "Não informada"}
        </Text>

        <Text style={styles.info}>
          <Text style={styles.label}>Observações: </Text>
          {item.observacoes || "Sem observações"}
        </Text>

        <Text style={styles.info}>
          <Text style={styles.label}>Solicitada em: </Text>
          {formatarData(item.dataHoraSolicitada || item.criadoEm)}
        </Text>

        <View style={styles.actionRow}>{renderBotoes(item, processando)}</View>
      </View>
    );
  }

  if (carregandoTipo || loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#22c55e" />
        <Text style={styles.loadingText}>
          {carregandoTipo ? "Verificando usuário..." : "Carregando doações..."}
        </Text>
      </View>
    );
  }

  if (tipoUsuario !== "COLETOR") {
    return (
      <View style={styles.centered}>
        <Text style={styles.blockTitle}>Área do coletor</Text>
        <Text style={styles.blockText}>
          Essa tela só aparece para usuários cadastrados como coletor.
        </Text>
        <Text style={[styles.blockText, { marginTop: 10 }]}>
          Tipo detectado: {tipoUsuario || "não encontrado"}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Doações dos doadores</Text>
        <Text style={styles.heroSub}>
          Aqui você acompanha as solicitações recebidas.
        </Text>
      </View>

      {erro ? <Text style={styles.erro}>{erro}</Text> : null}

      <FlatList
        data={doacoesAtivas}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={
          doacoesAtivas.length === 0 ? styles.emptyList : styles.list
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>Nenhuma doação ativa</Text>
            <Text style={styles.emptyText}>
              Quando surgirem novas doações pendentes, aceitas ou em rota, elas
              aparecerão aqui.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eef5f0",
  },
  hero: {
    backgroundColor: "#2e7d32",
    paddingHorizontal: 18,
    paddingTop: 22,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  heroTitle: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
  },
  heroSub: {
    color: "#e7f7ea",
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
  },
  erro: {
    color: "#b00020",
    fontWeight: "700",
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  list: {
    padding: 16,
    paddingBottom: 26,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 12,
  },
  nomeDoador: {
    flex: 1,
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  info: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 6,
    lineHeight: 20,
  },
  label: {
    fontWeight: "bold",
    color: "#111827",
  },
  actionRow: {
    marginTop: 14,
    width: "100%",
  },
  actionButton: {
    width: "100%",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  blueButton: {
    backgroundColor: "#2563eb",
  },
  orangeButton: {
    backgroundColor: "#f59e0b",
  },
  greenButton: {
    backgroundColor: "#22c55e",
  },
  disabledButton: {
    opacity: 0.6,
  },
  actionText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  emptyBox: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  emptyText: {
    textAlign: "center",
    color: "#6b7280",
    fontSize: 15,
    lineHeight: 22,
  },
  centered: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#374151",
  },
  blockTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  blockText: {
    textAlign: "center",
    color: "#6b7280",
    fontSize: 15,
    lineHeight: 22,
  },
});