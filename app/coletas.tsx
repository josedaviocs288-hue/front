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
import { subscribeAtualizacaoGlobal } from "@/src/utils/appEvents";

type Usuario = {
  id?: number;
  nome?: string;
  email?: string;
};

type StatusDoacao =
  | "PENDENTE"
  | "ACEITA"
  | "EM_ROTA"
  | "AGUARDANDO_CONFIRMACAO"
  | "CONCLUIDA"
  | "CANCELADA"
  | string;

type Doacao = {
  id: number;
  doador?: Usuario | null;
  coletor?: Usuario | null;
  doadorId?: number | null;
  doadorNome?: string | null;
  doadorEmail?: string | null;
  coletorId?: number | null;
  coletorNome?: string | null;
  coletorEmail?: string | null;
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
  aceitaEm?: string | null;
  prazoExpiracao?: string | null;
  emRotaEm?: string | null;
  coletaRealizadaEm?: string | null;
  confirmadaEm?: string | null;
  user?: Usuario | null;
};

type ApiResponse<T> = {
  success?: boolean;
  message?: string;
  data?: T;
  timestamp?: string;
};

type AcaoStatus = "ACEITAR" | "EM_ROTA" | "COLETA_REALIZADA";

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
      error?.response?.data?.error ||
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
      throw new Error(
        response.data?.message || "Não foi possível carregar as doações."
      );
    }

    console.log("🔥 DOACOES TRATADAS:", lista);
    console.log("🔥 TOTAL DE DOACOES:", lista.length);

    setDoacoes(lista);
  } catch (error: any) {
    console.log(
      "❌ ERRO DOACOES:",
      error?.response?.data || error?.message || error
    );
    setErro(extrairMensagemErro(error));
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
}, []);

// COLE ESTE BLOCO NOVO AQUI
useEffect(() => {
  const unsubscribe = subscribeAtualizacaoGlobal(() => {
    carregarDoacoes(true);
  });

  return unsubscribe;
}, [carregarDoacoes]);

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
    const partes = [
      doacao.rua,
      doacao.numero,
      doacao.bairro,
      doacao.cidade,
      doacao.uf,
    ]
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
      return `${item.quantidadeUnidades} unidade(s)`;
    }

    if (item.tipoQuantidade?.trim()) {
      return item.tipoQuantidade;
    }

    return "Não informada";
  }

  function normalizarStatus(status?: string | null) {
    return String(status || "").trim().toUpperCase();
  }

  function atualizarListaLocal(id: number, novoStatus: string) {
    const statusNormalizado = normalizarStatus(novoStatus);

    if (statusNormalizado === "CONCLUIDA" || statusNormalizado === "CANCELADA") {
      setDoacoes((listaAtual) => listaAtual.filter((item) => item.id !== id));
      return;
    }

    setDoacoes((listaAtual) =>
      listaAtual.map((item) =>
        item.id === id ? { ...item, status: statusNormalizado } : item
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
        rota = `/doacoes/${id}/coleta-realizada`;
        proximoStatus = "AGUARDANDO_CONFIRMACAO";
      }

      console.log("➡️ CHAMANDO ROTA:", rota);

      const response = await api.patch<ApiResponse<any>>(rota);

      console.log("✅ STATUS ATUALIZADO:", response.data);

      if (response.data?.success === false) {
        throw new Error(
          response.data?.message || "Não foi possível atualizar a doação."
        );
      }

      const dataResponse = response.data?.data as { status?: string } | undefined;

      const statusReal = dataResponse?.status || proximoStatus;

      atualizarListaLocal(id, statusReal);

      Alert.alert(
        "Sucesso",
        response.data?.message || "Doação atualizada com sucesso."
      );

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
    switch (normalizarStatus(status)) {
      case "PENDENTE":
        return "#f59e0b";
      case "ACEITA":
        return "#2563eb";
      case "EM_ROTA":
        return "#0ea5e9";
      case "AGUARDANDO_CONFIRMACAO":
        return "#7c3aed";
      case "CONCLUIDA":
        return "#16a34a";
      case "CANCELADA":
        return "#dc2626";
      default:
        return "#6b7280";
    }
  }

  function textoStatus(status?: string) {
    switch (normalizarStatus(status)) {
      case "PENDENTE":
        return "Pendente";
      case "ACEITA":
        return "Aceita";
      case "EM_ROTA":
        return "Em rota";
      case "AGUARDANDO_CONFIRMACAO":
        return "Aguardando confirmação";
      case "CONCLUIDA":
        return "Concluída";
      case "CANCELADA":
        return "Cancelada";
      default:
        return "Indefinido";
    }
  }

  const doacoesAtivas = useMemo(() => {
    return doacoes.filter((item) => {
      const status = normalizarStatus(item.status);

      return (
        status === "PENDENTE" ||
        status === "ACEITA" ||
        status === "EM_ROTA" ||
        status === "AGUARDANDO_CONFIRMACAO"
      );
    });
  }, [doacoes]);

  function renderBotoes(item: Doacao, processando: boolean) {
    if (!item?.id) return null;

    const status = normalizarStatus(item.status);

    if (
      status === "CONCLUIDA" ||
      status === "CANCELADA" ||
      status === "AGUARDANDO_CONFIRMACAO"
    ) {
      return null;
    }

    if (status === "PENDENTE") {
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

    if (status === "ACEITA") {
      return (
        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.routeButton,
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

    if (status === "EM_ROTA") {
      return (
        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.greenButton,
            processando && styles.disabledButton,
          ]}
          onPress={() => atualizarStatus(item.id, "COLETA_REALIZADA")}
          disabled={processando}
          activeOpacity={0.8}
        >
          <Text style={styles.actionText}>
            {processando ? "Atualizando..." : "Coleta realizada"}
          </Text>
        </TouchableOpacity>
      );
    }

    return null;
  }

  function renderInfoTempo(item: Doacao) {
    const status = normalizarStatus(item.status);

    if (status === "AGUARDANDO_CONFIRMACAO") {
      return (
        <Text style={styles.info}>
          <Text style={styles.label}>Situação: </Text>
          Aguardando confirmação do doador
        </Text>
      );
    }

    if (status === "EM_ROTA" && item.emRotaEm) {
      return (
        <Text style={styles.info}>
          <Text style={styles.label}>Em rota desde: </Text>
          {formatarData(item.emRotaEm)}
        </Text>
      );
    }

    if (status === "ACEITA" && item.aceitaEm) {
      return (
        <>
          <Text style={styles.info}>
            <Text style={styles.label}>Aceita em: </Text>
            {formatarData(item.aceitaEm)}
          </Text>

          <Text style={styles.info}>
            <Text style={styles.label}>Reserva até: </Text>
            {formatarData(item.prazoExpiracao)}
          </Text>
        </>
      );
    }

    return null;
  }

  function renderItem({ item }: { item: Doacao }) {
    const processando = atualizandoId === item.id;

    const nomeDoador =
      item.doadorNome ||
      item.doador?.nome ||
      item.user?.nome ||
      (item.doadorId ? `Doador #${item.doadorId}` : "Doador");

    return (
      <View style={styles.card}>
        <View style={styles.cardTop}>
          <Text style={styles.nomeDoador}>{nomeDoador}</Text>

          <View
            style={[styles.badge, { backgroundColor: corStatus(item.status) }]}
          >
            <Text style={styles.badgeText}>{textoStatus(item.status)}</Text>
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

        {renderInfoTempo(item)}

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
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Coletas</Text>
        <Text style={styles.subtitle}>
          Acompanhe e atualize suas coletas ativas
        </Text>
      </View>

      {!!erro && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{erro}</Text>
        </View>
      )}

      <FlatList
        data={doacoesAtivas}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.listContent,
          doacoesAtivas.length === 0 && styles.emptyListContent,
        ]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>Nenhuma coleta ativa</Text>
            <Text style={styles.emptyText}>
              Quando houver doações disponíveis ou em andamento, elas aparecerão aqui.
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
    backgroundColor: "#f7f8fa",
  },
  header: {
    paddingTop: 18,
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: "#6b7280",
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    gap: 10,
  },
  nomeDoador: {
    flex: 1,
    fontSize: 17,
    fontWeight: "800",
    color: "#111827",
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  badgeText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
  },
  info: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 8,
    lineHeight: 20,
  },
  label: {
    fontWeight: "700",
    color: "#111827",
  },
  actionRow: {
    marginTop: 10,
  },
  actionButton: {
    minHeight: 46,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  blueButton: {
    backgroundColor: "#2563eb",
  },
  routeButton: {
    backgroundColor: "#0ea5e9",
  },
  greenButton: {
    backgroundColor: "#16a34a",
  },
  disabledButton: {
    opacity: 0.6,
  },
  actionText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 15,
  },
  centered: {
    flex: 1,
    backgroundColor: "#f7f8fa",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: "#374151",
  },
  blockTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 8,
  },
  blockText: {
    textAlign: "center",
    color: "#6b7280",
    fontSize: 15,
    lineHeight: 22,
  },
  emptyBox: {
    alignItems: "center",
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 8,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 15,
    color: "#6b7280",
    lineHeight: 22,
  },
  errorBox: {
    margin: 16,
    marginBottom: 0,
    backgroundColor: "#fee2e2",
    borderWidth: 1,
    borderColor: "#fecaca",
    borderRadius: 12,
    padding: 12,
  },
  errorText: {
    color: "#991b1b",
    fontSize: 14,
    fontWeight: "600",
  },
});