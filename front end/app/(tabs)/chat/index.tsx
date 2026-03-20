import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { styles } from "@/src/styles/chatStyles";
import { FlatList, KeyboardAvoidingView, Platform, Pressable, Text, View } from "react-native";
import { chatHistorico } from "@/src/services/chatService";
import * as Linking from "expo-linking";

type Mensagem = {
  remetente: "doador" | "coletor";
  texto: string;
  data: string;
};

export default function ChatScreen() {
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [texto, setTexto] = useState("");
  const [coletaAceita, setColetaAceita] = useState(false);
  const [tipoUsuario, setTipoUsuario] = useState<"doador" | "coletor">("doador");
  const { coletaId } = useLocalSearchParams<{ coletaId?: string }>();

  const listRef = useRef<FlatList>(null);

  /* 🔹 Carregar estado inicial */
  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    const tipo =
      ((await AsyncStorage.getItem("tipoUsuario")) as
        | "doador"
        | "coletor") || "doador";

    let aceita = (await AsyncStorage.getItem("coletaAceita")) === "true";

    let msgs: Mensagem[] = [];
    if (coletaId) {
      try {
        const list = await chatHistorico(Number(coletaId));
        msgs = list.map(m => ({
          remetente: m.remetenteEmail === "coletor" ? "coletor" : "doador",
          texto: m.texto,
          data: m.enviadoEm,
        }));
        aceita = true;
      } catch {}
    } else {
      msgs = JSON.parse((await AsyncStorage.getItem("chatMensagens")) || "[]");
    }

    setTipoUsuario(tipo);
    setColetaAceita(aceita);
    setMensagens(msgs);
  }

 

  function abrirWhatsApp() {
    const text = encodeURIComponent("Olá! Vamos conversar sobre a coleta.");
    const url = `https://wa.me/?text=${text}`;
    Linking.openURL(url);
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chat - Ecoltarema</Text>
      </View>

      {/* Mensagens */}
      {coletaAceita ? (
        <FlatList
          ref={listRef}
          data={mensagens}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={styles.chatContainer}
          renderItem={({ item }) => (
            <View
              style={[
                styles.msg,
                item.remetente === tipoUsuario
                  ? styles.remetente
                  : styles.destinatario
              ]}
            >
              <Text
                style={
                  item.remetente === tipoUsuario
                    ? styles.msgTextWhite
                    : styles.msgTextDark
                }
              >
                {item.texto}
              </Text>
            </View>
          )}
        />
      ) : (
        <View style={styles.chatBloqueado}>
          <Text style={styles.msgAviso}>
            Chat indisponível até a coleta ser aceita.
          </Text>
        </View>
      )}

      {/* Input */}
      <View style={styles.inputContainer}>
        <Pressable style={styles.btnEnviar} onPress={abrirWhatsApp}>
          <Text style={styles.btnEnviarText}>Abrir WhatsApp</Text>
        </Pressable>
      </View>

      {/* Voltar */}
      <Pressable
        style={styles.btnVoltar}
        onPress={() => router.back()}
      >
        <Text style={styles.btnVoltarText}>⬅ Voltar ao Menu</Text>
      </Pressable>
    </KeyboardAvoidingView>
  );
}
