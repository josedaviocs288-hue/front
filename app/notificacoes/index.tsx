import { styles } from "@/src/styles/notificacoesStyles";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { Navbar } from "../../src/components/navbar";
import SideMenu from "../../src/components/SideMenu";

export default function Notificacoes() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  // Mock de notificações
  const [notificacoes, setNotificacoes] = useState([
    { id: "1", mensagem: "Nova coleta disponível perto de você." },
    { id: "2", mensagem: "Sua doação foi confirmada com sucesso." }
  ]);

  function excluir(id: string) {
    setNotificacoes(prev => prev.filter(n => n.id !== id));
  }

  return (
    <View style={styles.container}>
      <Navbar
        onMenuPress={() => setMenuOpen(true)}
      />

      <SideMenu
        visible={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      <FlatList
        contentContainerStyle={styles.list}
        data={notificacoes}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <Text style={styles.empty}>Nenhuma notificação.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.text}>{item.mensagem}</Text>

            <View style={styles.actions}>
              <TouchableOpacity style={styles.viewBtn}>
                <Text style={styles.btnText}>Visualizar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => excluir(item.id)}
              >
                <Text style={styles.btnText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Footer */}
      <TouchableOpacity
        style={styles.footer}
        onPress={() => router.replace("/home")}
      >
        <Text style={styles.footerText}>Voltar ao menu</Text>
      </TouchableOpacity>
    </View>
  );
}
