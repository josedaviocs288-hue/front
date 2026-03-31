import { styles } from "@/src/styles/configuracaoStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";

type Tema = "claro" | "escuro";

export default function Configuracao() {
  const [tema, setTema] = useState<Tema>("claro");
  const [senha, setSenha] = useState("");

  /* 🔹 Carregar configurações */
  useEffect(() => {
    carregarConfiguracoes();
  }, []);

  async function carregarConfiguracoes() {
    try {
      const temaSalvo = await AsyncStorage.getItem("@tema");
      if (temaSalvo === "claro" || temaSalvo === "escuro") {
        setTema(temaSalvo);
      }
    } catch {
      Alert.alert("Erro", "Falha ao carregar configurações.");
    }
  }

  /* 🔹 Histórico */
  async function adicionarAoHistorico(atividade: string, descricao: string) {
    const historicoSalvo = await AsyncStorage.getItem("@historico");
    const historico = historicoSalvo ? JSON.parse(historicoSalvo) : [];

    historico.push({
      data: new Date().toLocaleString(),
      atividade,
      descricao,
    });

    await AsyncStorage.setItem("@historico", JSON.stringify(historico));
  }

  /* 🔹 Salvar configurações */
  async function salvarConfiguracoes() {
    try {
      const temaSalvo = await AsyncStorage.getItem("@tema");

      /* 🔐 Senha */
      if (senha) {
        if (senha.length < 6) {
          Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres.");
          return;
        }

        const confirmar = await new Promise<boolean>((resolve) => {
          Alert.alert("Confirmação", "Deseja realmente alterar sua senha?", [
            {
              text: "Cancelar",
              style: "cancel",
              onPress: () => resolve(false),
            },
            { text: "Confirmar", onPress: () => resolve(true) },
          ]);
        });

        if (!confirmar) return;

        await adicionarAoHistorico(
          "Alteração de Senha",
          "Senha alterada com sucesso.",
        );
        setSenha("");
      }

      /* 🎨 Tema */
      if (tema !== temaSalvo) {
        await AsyncStorage.setItem("@tema", tema);
        await adicionarAoHistorico(
          "Alteração de Tema",
          `Tema alterado para ${tema}.`,
        );
      }

      Alert.alert("Sucesso", "Configurações salvas com sucesso!");
    } catch {
      Alert.alert("Erro", "Não foi possível salvar as configurações.");
    }
  }

  /* 🔹 Limpar dados */
  function limparDados() {
    Alert.alert("Confirmação", "Deseja apagar todos os dados do usuário?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Apagar",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.clear();
          Alert.alert("Dados apagados com sucesso");
          router.replace("/login");
        },
      },
    ]);
  }

  return (
    <View style={[styles.page, tema === "escuro" && styles.pageDark]}>
      <Text style={[styles.title, tema === "escuro" && styles.textDark]}>
        ⚙ Configurações
      </Text>

      <View style={[styles.card, tema === "escuro" && styles.cardDark]}>
        <Text style={[styles.label, tema === "escuro" && styles.textDark]}>
          🎨 Tema
        </Text>

        <View
          style={[
            styles.pickerWrapper,
            tema === "escuro" && styles.pickerWrapperDark,
          ]}
        >
          <Picker
            selectedValue={tema}
            onValueChange={(value) => setTema(value as Tema)}
          >
            <Picker.Item label="Claro" value="claro" />
            <Picker.Item label="Escuro" value="escuro" />
          </Picker>
        </View>

        <Text style={[styles.label, tema === "escuro" && styles.textDark]}>
          🔑 Alterar senha
        </Text>

        <TextInput
          placeholder="Digite a nova senha"
          placeholderTextColor={tema === "escuro" ? "#aaa" : "#666"}
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
          style={[styles.input, tema === "escuro" && styles.inputDark]}
        />

        <Pressable style={styles.button} onPress={salvarConfiguracoes}>
          <Text style={styles.buttonText}>💾 Salvar Configurações</Text>
        </Pressable>

        <Pressable style={[styles.button, styles.danger]} onPress={limparDados}>
          <Text style={styles.buttonText}>🗑 Limpar dados do usuário</Text>
        </Pressable>

        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.buttonText}>⬅ Voltar</Text>
        </Pressable>
      </View>
    </View>
  );
}
