import { useCallback, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "expo-router";

import api from "@/src/services/api";

type ApiResponse<T> = {
  success?: boolean;
  message?: string;
  data?: T;
};

export default function NotificationBadge() {
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const carregarTotal = useCallback(async () => {
    try {
      setLoading(true);

      const response = await api.get<ApiResponse<number>>(
        "/notificacoes/nao-lidas/count"
      );

      const valor = Number(response?.data?.data ?? 0);
      setTotal(Number.isNaN(valor) ? 0 : valor);
    } catch (error: any) {
      console.log(
        "❌ Erro ao carregar badge de notificações:",
        error?.response?.data || error?.message || error
      );
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarTotal();
    }, [carregarTotal])
  );

  if (loading && total <= 0) {
    return (
      <View style={styles.loadingBox}>
        <ActivityIndicator size="small" color="#fff" />
      </View>
    );
  }

  if (total <= 0) {
    return null;
  }

  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{total > 99 ? "99+" : total}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#d32f2f",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
    position: "absolute",
    top: -6,
    right: -10,
    zIndex: 10,
  },
  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
  },
  loadingBox: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#d32f2f",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: -6,
    right: -10,
    zIndex: 10,
  },
});