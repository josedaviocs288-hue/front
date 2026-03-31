import { api } from "@/src/services/api";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type PontoColeta = {
  id: string | number;
  nome: string;
  latitude: number;
  longitude: number;
};

type RespostaMapa = {
  pontosFixos?: PontoColeta[];
};

export default function EscolhaDoacao() {
  const [loading, setLoading] = useState(true);
  const [quantidadePontos, setQuantidadePontos] = useState(0);
  const [erroInfo, setErroInfo] = useState("");

  useEffect(() => {
    carregarResumo();
  }, []);

  async function carregarResumo() {
    try {
      setLoading(true);
      setErroInfo("");

      const { data } = await api.get<RespostaMapa>("/mapa/home");

      const pontos = Array.isArray(data?.pontosFixos) ? data.pontosFixos : [];
      setQuantidadePontos(pontos.length);
    } catch (error: any) {
      console.log("❌ ERRO AO CARREGAR RESUMO DA DOAÇÃO:", error?.response?.data || error?.message);
      setErroInfo("Não foi possível carregar os pontos fixos agora.");
      setQuantidadePontos(0);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.screen}>
      <View style={styles.headerCard}>
        <Text style={styles.title}>Escolha a forma de doação</Text>
        <Text style={styles.subtitle}>
          Você pode levar até um ponto fixo ou pedir que o coletor passe na sua casa.
        </Text>
      </View>

      <View style={styles.card}>
        <View style={styles.infoBox}>
          {loading ? (
            <View style={styles.infoRow}>
              <ActivityIndicator size="small" color="#2e7d32" />
              <Text style={styles.infoText}>Carregando opções...</Text>
            </View>
          ) : erroInfo ? (
            <Text style={styles.infoError}>{erroInfo}</Text>
          ) : (
            <Text style={styles.infoText}>
              {quantidadePontos > 0
                ? `Há ${quantidadePontos} ponto(s) fixo(s) disponível(is) no mapa.`
                : "Você também pode doar em pontos fixos quando estiverem disponíveis."}
            </Text>
          )}
        </View>

        <Pressable
          style={[styles.optionButton, styles.fixedButton]}
          onPress={() => router.push("/doacao/fixa")}
        >
          <Text style={styles.optionEmoji}>♻️</Text>
          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>Doação na lixeira</Text>
            <Text style={styles.optionDescription}>
              Leve seus recicláveis até um ponto fixo de coleta.
            </Text>
          </View>
        </Pressable>

        <Pressable
          style={[styles.optionButton, styles.homeButton]}
          onPress={() => router.push("/doacao/casa")}
        >
          <Text style={styles.optionEmoji}>🏠</Text>
          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>Doação em casa</Text>
            <Text style={styles.optionDescription}>
              Registre sua localização para um coletor ir até você.
            </Text>
          </View>
        </Pressable>

        <Pressable style={styles.secondaryButton} onPress={() => router.back()}>
          <Text style={styles.secondaryButtonText}>⬅ Voltar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#eef5f0",
    padding: 16,
  },
  headerCard: {
    backgroundColor: "#2e7d32",
    borderRadius: 22,
    padding: 20,
    marginBottom: 16,
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    color: "#e7f7ea",
    fontSize: 15,
    lineHeight: 22,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  infoBox: {
    backgroundColor: "#f6fbf7",
    borderWidth: 1,
    borderColor: "#dbe8dd",
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  infoText: {
    color: "#33523b",
    fontSize: 14,
    fontWeight: "600",
  },
  infoError: {
    color: "#b00020",
    fontSize: 14,
    fontWeight: "600",
  },
  optionButton: {
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  fixedButton: {
    backgroundColor: "#edf8ee",
    borderWidth: 1,
    borderColor: "#b8dfbf",
  },
  homeButton: {
    backgroundColor: "#eef6ff",
    borderWidth: 1,
    borderColor: "#bfdcff",
  },
  optionEmoji: {
    fontSize: 28,
    marginRight: 14,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    color: "#111827",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  optionDescription: {
    color: "#4b5563",
    fontSize: 14,
    lineHeight: 20,
  },
  secondaryButton: {
    marginTop: 4,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: "center",
    backgroundColor: "#e9eef3",
  },
  secondaryButtonText: {
    color: "#334155",
    fontSize: 16,
    fontWeight: "bold",
  },
});