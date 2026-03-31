import AsyncStorage from "@react-native-async-storage/async-storage";
import { Href, router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  Platform,
  Pressable,
  Text,
  View
} from "react-native";
import { styles } from "./styles";

type AppRoute = Href;

type SideMenuProps = {
  visible: boolean;
  onClose: () => void;
};

type Usuario = {
  nome: string;
  foto?: string | null;
};

export default function SideMenu({ visible, onClose }: SideMenuProps) {
  const slideAnim = useRef(new Animated.Value(-260)).current;

  const [shouldRender, setShouldRender] = useState(visible);

  const [usuario, setUsuario] = useState<Usuario>({
    nome: "Usuário",
    foto: null
  });

  /* 🔹 Carregar dados do usuário salvos */
  useEffect(() => {
    carregarUsuario();
  }, [visible]);

  async function carregarUsuario() {
    try {
      const data = await AsyncStorage.getItem("@usuario");
      if (data) {
        const parsed = JSON.parse(data);
        setUsuario({
          nome: parsed.nome || "Usuário",
          foto: parsed.foto || null
        });
      }
    } catch (e) {
      console.log("Erro ao carregar usuário", e);
    }
  }

  /* 🔹 Animação de abrir e fechar (espelhadas) */
  useEffect(() => {
    if (visible) {
      setShouldRender(true);

      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -260,
        duration: 250,
        useNativeDriver: false
      }).start(() => {
        setShouldRender(false);
      });
    }
  }, [visible]);

  function navigate(route: AppRoute) {
    onClose();
    router.push(route);
  }

  function logout() {
    if (Platform.OS === "web") {
      localStorage.removeItem("usuarioLogado");
      sessionStorage.removeItem("usuarioLogado");
    }

    AsyncStorage.removeItem("@usuario");
    router.replace("/login");
  }

  if (!shouldRender) return null;

  return (
    <>
      {/* Overlay */}
      <Pressable style={styles.overlay} onPress={onClose} />

      {/* Menu */}
      <Animated.View style={[styles.menu, { left: slideAnim }]}>
        {usuario.foto ? (
          <Image
            source={{ uri: usuario.foto }}
            style={styles.profilePic}
          />
        ) : (
          <View style={styles.placeholderPic}>
            <Text style={styles.placeholderText}>👤</Text>
          </View>
        )}

        <Text style={styles.nome}>{usuario.nome}</Text>

        <MenuItem
          icon="⭐"
          label="Avalição"
          onPress={() => navigate("/avaliacao")}
        />

        <MenuItem
          icon="👤"
          label="Perfil"
          onPress={() => navigate("/perfil")}
        />
 
        <MenuItem
          icon="⚙"
          label="Configuração"
          onPress={() => navigate("/configuracao")}
        />

        <MenuItem
          icon="💬"
          label="Chat"
          onPress={() => navigate("/chat")}
        />
        
        <MenuItem
          icon="🏆"
          label="Ranking"
          onPress={() => navigate("/ranking")}
        /> 

        <MenuItem
          icon="🔑"
          label="Sair"
          onPress={logout}
        />
      </Animated.View>
    </>
  );
}

/* 🔹 Item reutilizável */
function MenuItem({
  icon,
  label,
  onPress
}: {
  icon: string;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed, hovered }) => [
        styles.item,
        (pressed || hovered) && styles.itemPressed
      ]}
    >
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
}
