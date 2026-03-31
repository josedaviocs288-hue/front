import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { styles } from "@/src/styles/chatStyles";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View
} from "react-native";

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

    const aceita =
      (await AsyncStorage.getItem("coletaAceita")) === "true";

    const msgs = JSON.parse(
      (await AsyncStorage.getItem("chatMensagens")) || "[]"
    );

    setTipoUsuario(tipo);
    setColetaAceita(aceita);
    setMensagens(msgs);
  }

  /* 🔹 Enviar mensagem */
  async function enviarMensagem() {
    if (!coletaAceita || !texto.trim()) return;

    const novaMensagem: Mensagem = {
      remetente: tipoUsuario,
      texto: texto.trim(),
      data: new Date().toISOString()
    };

    const atualizadas = [...mensagens, novaMensagem];
    setMensagens(atualizadas);
    setTexto("");

    await AsyncStorage.setItem(
      "chatMensagens",
      JSON.stringify(atualizadas)
    );

    setTimeout(() => {
      listRef.current?.scrollToEnd({ animated: true });
    }, 100);
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
        <TextInput
          style={styles.input}
          placeholder="Digite sua mensagem..."
          value={texto}
          onChangeText={setTexto}
          editable={coletaAceita}
        />

        <Pressable
          style={[
            styles.btnEnviar,
            !coletaAceita && styles.btnDisabled
          ]}
          onPress={enviarMensagem}
        >
          <Text style={styles.btnEnviarText}>Enviar</Text>
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
