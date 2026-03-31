import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";

import MapaHome from "@/src/components/MapaHome";
import { Navbar } from "@/src/components/navbar";
import SideMenu from "@/src/components/SideMenu";

type TipoUsuario = "COLETOR" | "DOADOR" | "";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [tipoUsuario, setTipoUsuario] = useState<TipoUsuario>("");

  useEffect(() => {
    carregarTipoUsuario();
  }, []);

  async function carregarTipoUsuario() {
    try {
      const tipoSalvo = await AsyncStorage.getItem("tipoUsuario");

      if (tipoSalvo === "COLETOR" || tipoSalvo === "DOADOR") {
        setTipoUsuario(tipoSalvo);
      } else {
        setTipoUsuario("DOADOR");
      }
    } catch (error) {
      console.log("Erro ao carregar tipo do usuário:", error);
      setTipoUsuario("DOADOR");
    }
  }

  function handleBotaoPrincipal() {
    if (tipoUsuario === "COLETOR") {
      router.push("/coletas");
    } else {
      router.push("/doacao");
    }
  }

  return (
    <View style={styles.container}>
      <Navbar
        onMenuPress={() => setMenuOpen(true)}
        onNotificationPress={() => router.push("/notificacoes")}
      />

      <SideMenu visible={menuOpen} onClose={() => setMenuOpen(false)} />

      <View style={styles.content}>
        <MapaHome
          tipoUsuario={tipoUsuario === "" ? "DOADOR" : tipoUsuario}
          onAcaoPrincipal={handleBotaoPrincipal}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    ...(Platform.OS !== "web" ? { paddingTop: 16 } : {}),
  },
  content: {
    flex: 1,
  },
});