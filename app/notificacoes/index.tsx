import { emitirAtualizacaoGlobal } from "@/src/utils/appEvents";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect } from "expo-router";

import api from "@/src/services/api";
import { styles } from "@/src/styles/notificacoesStyles";

type Notificacao = {
  id: number;
  titulo: string;
  mensagem: string;
  tipo?: string;
  referenciaId?: number | null;
  acaoDisponivel?: boolean;
  textoAcao?: string | null;
  lida: boolean;
  criadaEm?: string;
};

type ApiResponse<T> = {
  success?: boolean;
  message?: string;
  data?: T;
};

export default function NotificacoesScreen() {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [processandoId, setProcessandoId] = useState<number | null>(null);
  const [marcandoTodas, setMarcandoTodas] = useState(false);

  const carregarNotificacoes = useCallback(async () => {
    try {
      setLoading(true);

      const response = await api.get<ApiResponse<Notificacao[]>>("/notificacoes/me");

      const lista = Array.isArray(response?.data?.data) ? response.data.data : [];

      setNotificacoes(lista);
    } catch (error: any) {
      console.log("❌ Erro ao carregar notificações:", error?.response?.data || error?.message || error);
      Alert.alert("Erro", "Não foi possível carregar as notificações.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarNotificacoes();
  }, [carregarNotificacoes]);

  useFocusEffect(
    useCallback(() => {
      carregarNotificacoes();
    }, [carregarNotificacoes])
  );

  async function marcarComoLida(id: number) {
    try {
      await api.put(`/notificacoes/${id}/lida`);

      setNotificacoes((listaAnterior) =>
        listaAnterior.map((item) =>
          item.id === id ? { ...item, lida: true } : item
        )
      );
    } catch (error: any) {
      console.log("❌ Erro ao marcar como lida:", error?.response?.data || error?.message || error);
    }
  }

  async function marcarTodasComoLidas() {
    try {
      setMarcandoTodas(true);

      await api.put("/notificacoes/lidas");

      setNotificacoes((listaAnterior) =>
        listaAnterior.map((item) => ({ ...item, lida: true }))
      );
    } catch (error: any) {
      console.log("❌ Erro ao marcar todas como lidas:", error?.response?.data || error?.message || error);
      Alert.alert("Erro", "Não foi possível marcar todas como lidas.");
    } finally {
      setMarcandoTodas(false);
    }
  }

  async function confirmarColeta(notificacao: Notificacao) {
    try {
      if (!notificacao.referenciaId) {
        Alert.alert("Erro", "Esta notificação não possui referência de doação.");
        return;
      }

      setProcessandoId(notificacao.id);

      await api.patch(`/doacoes/${notificacao.referenciaId}/confirmar-coleta`);

      if (!notificacao.lida) {
        await marcarComoLida(notificacao.id);
      }

      Alert.alert("Sucesso", "Coleta confirmada com sucesso.");

      await carregarNotificacoes();
    } catch (error: any) {
      console.log("❌ Erro ao confirmar coleta:", error?.response?.data || error?.message || error);
      const mensagem =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Não foi possível confirmar a coleta.";
      Alert.alert("Erro", String(mensagem));
    } finally {
      setProcessandoId(null);
    }
  }

  async function abrirNotificacao(notificacao: Notificacao) {
    try {
      if (!notificacao.lida) {
        await marcarComoLida(notificacao.id);
      }

      Alert.alert(notificacao.titulo || "Notificação", notificacao.mensagem || "");
    } catch (error: any) {
      console.log("❌ Erro ao abrir notificação:", error?.response?.data || error?.message || error);
      Alert.alert("Erro", "Não foi possível abrir a notificação.");
    }
  }

  async function excluirVisualmente(id: number) {
    setNotificacoes((listaAnterior) => listaAnterior.filter((item) => item.id !== id));
  }

  function podeConfirmar(notificacao: Notificacao) {
    return (
      notificacao.tipo === "CONFIRMAR_COLETA" &&
      notificacao.acaoDisponivel === true &&
      !!notificacao.referenciaId
    );
  }

  function renderItem({ item }: { item: Notificacao }) {
    const emProcesso = processandoId === item.id;

    return (
      <View
        style={[
          styles.card,
          !item.lida && {
            borderWidth: 1.5,
            borderColor: "#2e7d32",
          },
        ]}
      >
        <Text style={[styles.text, { fontWeight: "bold", marginBottom: 6 }]}>
          {item.titulo}
        </Text>

        <Text style={styles.text}>{item.mensagem}</Text>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.viewBtn}
            onPress={() => {
              if (podeConfirmar(item)) {
                confirmarColeta(item);
              } else {
                abrirNotificacao(item);
              }
            }}
            disabled={emProcesso}
          >
            {emProcesso ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>
                {podeConfirmar(item)
                  ? item.textoAcao || "Confirmar coleta"
                  : "Ver"}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => excluirVisualmente(item.id)}
            disabled={emProcesso}
          >
            <Text style={styles.btnText}>Remover</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#2e7d32" />
        <Text style={{ marginTop: 12, color: "#333" }}>Carregando notificações...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={notificacoes}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>Você não tem notificações no momento.</Text>
        }
      />

      {notificacoes.length > 0 && (
        <TouchableOpacity
          style={styles.footer}
          onPress={marcarTodasComoLidas}
          disabled={marcandoTodas}
        >
          {marcandoTodas ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.footerText}>Marcar todas como lidas</Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}