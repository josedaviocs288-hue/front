import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Platform, StyleSheet, View, TouchableOpacity, Text } from "react-native";

import { Navbar } from "../../src/components/navbar";
import SideMenu from "../../src/components/SideMenu";

export default function MenuPrincipal() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [tipoUsuario, setTipoUsuario] = useState<"doador" | "coletor" | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await AsyncStorage.getItem("@usuario");
        if (data) {
          const u = JSON.parse(data);
          setTipoUsuario(u?.tipo ?? null);
        }
      } catch {}
    })();
  }, []);

  return (
    <View style={styles.container}>
      {/* NAVBAR */}
      <Navbar
        onMenuPress={() => setMenuOpen(true)}
        onNotificationPress={() => router.push("/notificacoes")}
      />

      {/* SIDE MENU GLOBAL */}
      <SideMenu
        visible={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      {/* CONTEÚDO PRINCIPAL */}
      <View style={styles.content}>
        {/* Aqui entra o mapa, botões ou qualquer conteúdo da tela principal */}
      </View>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => {
            if (tipoUsuario === "coletor") {
              router.push("/(tabs)/coletor");
            } else {
              router.push("/(tabs)/doacao");
            }
          }}
        >
          <Text style={styles.actionText}>
            {tipoUsuario === "coletor" ? "Ver coletas disponíveis" : "Faça sua doação"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    ...(Platform.OS !== "web" && {
      paddingTop: 16,
    }),
  },
  content: {
    flex: 1,
    ...(Platform.OS !== "web" && {
      paddingHorizontal: 8,
    }),
  },
  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 20,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  actionBtn: {
    backgroundColor: "#4caf50",
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 26,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  actionText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
