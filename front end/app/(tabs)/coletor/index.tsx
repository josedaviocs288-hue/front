import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { logout } from "@/src/services/authService";
import { historicoColetor, atualizarStatus } from "@/src/services/coletaService";
import * as Linking from "expo-linking";
import { router } from "expo-router";

type Coleta = {
  id: number;
  materiais?: string[];
  referencia?: string;
  status?: string;
};

export default function PainelColetor() {
  const [proximas, setProximas] = useState<Coleta[]>([]);
  const [historico, setHistorico] = useState<Coleta[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const list = await historicoColetor();
        const h: Coleta[] = (list || []).map((c: any) => ({
          id: Number(c.id),
          materiais: c.materiais || [],
          referencia: c.referencia || c.bairro || "",
          status: c.status,
        }));
        setHistorico(h);
        const prox = h.filter((c) => c.status === "PENDENTE" || c.status === "AGENDADA");
        setProximas(prox);
      } catch {
        setHistorico([]);
        setProximas([]);
      }
    })();
  }, []);

  async function coletar(index: number) {
    const item = proximas[index];
    if (!item) return;
    try {
      await atualizarStatus(item.id, "CONCLUIDA");
      const novoHistorico = [{ ...item, status: "CONCLUIDA" }, ...historico];
      setHistorico(novoHistorico);
      const novasProximas = proximas.slice();
      novasProximas.splice(index, 1);
      setProximas(novasProximas);
    } catch {}
  }

  function abrirWhatsApp(item?: Coleta) {
    const text = encodeURIComponent("Olá! Estou disponível para realizar a coleta.");
    const url = `https://wa.me/?text=${text}`;
    Linking.openURL(url);
  }

  async function handleLogout() {
    await logout();
    router.replace("/login");
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🚛 Painel do Coletor</Text>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.main}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📍 Coletas Próximas</Text>
          {proximas.length === 0 ? (
            <Text style={styles.empty}>Nenhuma coleta disponível no momento.</Text>
          ) : (
            proximas.map((c, idx) => (
              <View key={c.id} style={styles.card}>
                <Text style={styles.cardTitle}>
                  {(c.materiais || []).join(", ") || "Recicláveis"}
                </Text>
                <Text style={styles.cardText}>
                  Local: {c.referencia || "N/D"}
                </Text>
                <View style={styles.row}>
                  <TouchableOpacity style={styles.cardBtn} onPress={() => coletar(idx)}>
                    <Text style={styles.cardBtnText}>Marcar como coletada</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.cardBtn, styles.whatsBtn]} onPress={() => abrirWhatsApp(c)}>
                    <Text style={styles.cardBtnText}>WhatsApp</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🗂 Histórico de Coletas</Text>
          {historico.length === 0 ? (
            <Text style={styles.empty}>Você ainda não realizou coletas.</Text>
          ) : (
            historico.map((h) => (
              <View key={h.id} style={styles.card}>
                <Text style={styles.cardTitle}>
                  {(h.materiais || []).join(", ") || "Recicláveis"}
                </Text>
                <Text style={styles.cardText}>
                  Local: {h.referencia || "N/D"}
                </Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0fdf4",
  },
  header: {
    backgroundColor: "#2e7d32",
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },
  logoutBtn: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  logoutText: {
    color: "#2e7d32",
    fontWeight: "bold",
  },
  main: {
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    color: "#2e7d32",
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "600",
  },
  empty: {
    textAlign: "center",
    color: "#777",
    marginTop: 15,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    color: "#388e3c",
    fontSize: 17,
    fontWeight: "600",
  },
  cardText: {
    fontSize: 14,
    marginTop: 5,
  },
  row: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  cardBtn: {
    backgroundColor: "#43a047",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  whatsBtn: {
    backgroundColor: "#25D366",
  },
  cardBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});

