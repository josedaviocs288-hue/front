import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { styles } from "@/src/styles/configuracaoStyles"
import { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  Text,
  TextInput,
  View
} from "react-native";
import { Picker } from "@react-native-picker/picker";

type Tema = "claro" | "escuro";

export default function Configuracao() {
  const [tema, setTema] = useState<Tema>("claro");
  const [senha, setSenha] = useState("");

  /* 🔹 Carregar configurações salvas */
  useEffect(() => {
    carregarConfiguracoes();
  }, []);

  async function carregarConfiguracoes() {
    const temaSalvo = await AsyncStorage.getItem("@tema");
    if (temaSalvo === "escuro" || temaSalvo === "claro") {
      setTema(temaSalvo);
    }
  }

  /* 🔹 Salvar no histórico */
  async function adicionarAoHistorico(
    atividade: string,
    descricao: string
  ) {
    const historicoSalvo = await AsyncStorage.getItem("@historico");
    const historico = historicoSalvo
      ? JSON.parse(historicoSalvo)
      : [];

    historico.push({
      data: new Date().toLocaleString(),
      atividade,
      descricao
    });

    await AsyncStorage.setItem(
      "@historico",
      JSON.stringify(historico)
    );
  }

  /* 🔹 Salvar configurações */
  async function salvarConfiguracoes() {
    if (senha) {
      await adicionarAoHistorico(
        "Alteração de Senha",
        "Senha alterada com sucesso."
      );
      setSenha("");
    }

    await AsyncStorage.setItem("@tema", tema);
    await adicionarAoHistorico(
      "Alteração de Tema",
      `Tema alterado para ${tema}.`
    );

    Alert.alert("Sucesso", "Configurações salvas!");
  }

  /* 🔹 Limpar dados */
  async function limparDados() {
    Alert.alert(
      "Confirmação",
      "Deseja apagar todos os dados do usuário?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Apagar",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.clear();
            Alert.alert("Dados apagados com sucesso");
            router.replace("/login");
          }
        }
      ]
    );
  }

  return (
    <View
      style={[
        styles.page,
        tema === "escuro" && styles.pageDark
      ]}
    >
      <Text
        style={[
          styles.title,
          tema === "escuro" && styles.textDark
        ]}
      >
        ⚙ Configurações
      </Text>

      <View
        style={[
          styles.card,
          tema === "escuro" && styles.cardDark
        ]}
      >
        {/* Tema */}
        <Text
          style={[
            styles.label,
            tema === "escuro" && styles.textDark
          ]}
        >
          🎨 Tema
        </Text>

        <View
          style={[
            styles.pickerWrapper,
            tema === "escuro" && styles.inputDark
          ]}
        >
          <Picker
            selectedValue={tema}
            onValueChange={(value) =>
              setTema(value as Tema)
            }
          >
            <Picker.Item label="Claro" value="claro" />
            <Picker.Item label="Escuro" value="escuro" />
          </Picker>
        </View>

        {/* Senha */}
        <Text
          style={[
            styles.label,
            tema === "escuro" && styles.textDark
          ]}
        >
          🔑 Alterar senha
        </Text>

        <TextInput
          placeholder="Digite a nova senha"
          placeholderTextColor={
            tema === "escuro" ? "#aaa" : "#666"
          }
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
          style={[
            styles.input,
            tema === "escuro" && styles.inputDark
          ]}
        />

        {/* Botões */}
        <Pressable style={styles.button} onPress={salvarConfiguracoes}>
          <Text style={styles.buttonText}>
            💾 Salvar Configurações
          </Text>
        </Pressable>

        <Pressable
          style={[styles.button, styles.danger]}
          onPress={limparDados}
        >
          <Text style={styles.buttonText}>
            🗑 Limpar dados do usuário
          </Text>
        </Pressable>

        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>⬅ Voltar</Text>
        </Pressable>
      </View>
    </View>
  );
}
