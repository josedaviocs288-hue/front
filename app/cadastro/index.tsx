import AsyncStorage from "@react-native-async-storage/async-storage";
import { fazerCadastro } from "@/src/services/auth";
import { api } from "@/src/services/api";
import { removeToken } from "@/src/services/token";
import { styles } from "@/src/styles/cadastroStyles";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type TipoTela = "doador" | "coletor" | "";

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [tipo, setTipo] = useState<TipoTela>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function testarBackend() {
      try {
        const res = await api.get("/");
        console.log("✅ BACKEND OK:", res.data);
      } catch (error: any) {
        console.log("❌ ERRO BACKEND:");
        console.log("message:", error?.message);
        console.log("status:", error?.response?.status);
        console.log("data:", error?.response?.data);
      }
    }

    testarBackend();
  }, []);

  function validarCPF(valor: string): boolean {
    const clean = valor.replace(/\D/g, "");

    if (clean.length !== 11 || /^(\d)\1+$/.test(clean)) {
      return false;
    }

    let soma = 0;
    let resto = 0;

    for (let i = 1; i <= 9; i++) {
      soma += parseInt(clean.substring(i - 1, i), 10) * (11 - i);
    }

    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(clean.substring(9, 10), 10)) {
      return false;
    }

    soma = 0;

    for (let i = 1; i <= 10; i++) {
      soma += parseInt(clean.substring(i - 1, i), 10) * (12 - i);
    }

    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;

    return resto === parseInt(clean.substring(10, 11), 10);
  }

  function validarEmail(valor: string): boolean {
    return /\S+@\S+\.\S+/.test(valor.trim().toLowerCase());
  }

  function formatarCPF(value: string) {
    let v = value.replace(/\D/g, "");
    v = v.slice(0, 11);
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    setCpf(v);
  }

  async function cadastrar() {
    if (loading) return;

    const nomeLimpo = nome.trim();
    const emailLimpo = email.trim().toLowerCase();
    const cpfLimpo = cpf.replace(/\D/g, "");
    const senhaLimpa = senha.trim();

    if (!nomeLimpo || !emailLimpo || !cpfLimpo || !senhaLimpa || !tipo) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    if (nomeLimpo.length < 2) {
      Alert.alert("Erro", "Digite um nome válido.");
      return;
    }

    if (!validarEmail(emailLimpo)) {
      Alert.alert("Erro", "Digite um e-mail válido.");
      return;
    }

    if (!validarCPF(cpfLimpo)) {
      Alert.alert("Erro", "CPF inválido.");
      return;
    }

    if (senhaLimpa.length < 6) {
      Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    const tipoBackend = tipo === "doador" ? "DOADOR" : "COLETOR";

    try {
      setLoading(true);

      await removeToken();
      delete api.defaults.headers.common.Authorization;

      console.log("📤 DADOS TELA CADASTRO:", {
        nome: nomeLimpo,
        email: emailLimpo,
        cpf: cpfLimpo,
        senha: senhaLimpa,
        tipoTela: tipo,
        tipoBackend,
      });

      const resposta = await fazerCadastro(
        nomeLimpo,
        emailLimpo,
        cpfLimpo,
        senhaLimpa,
        tipoBackend
      );

      console.log("✅ CADASTRO OK:", resposta);

      await AsyncStorage.multiSet([
        ["nomeUsuario", nomeLimpo],
        ["emailUsuario", emailLimpo],
        ["cpfUsuario", cpfLimpo],
        ["tipoUsuario", tipoBackend],
      ]);

      console.log("✅ TIPO SALVO NO CADASTRO:", tipoBackend);

      Alert.alert(
        "Sucesso",
        resposta?.message || "Cadastro realizado com sucesso!",
        [
          {
            text: "OK",
            onPress: () => router.replace("/login"),
          },
        ]
      );
    } catch (error: any) {
      console.log("❌ ERRO CADASTRO:", error?.response?.data || error?.message);

      if (error?.response?.status === 409) {
        Alert.alert(
          "Erro",
          error?.response?.data?.message || "E-mail ou CPF já cadastrado."
        );
        return;
      }

      const mensagem =
        error?.response?.data?.message ||
        error?.message ||
        "Erro ao cadastrar.";

      Alert.alert("Erro", mensagem);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Cadastro</Text>

        <TextInput
          style={styles.input}
          placeholder="Nome completo"
          placeholderTextColor="#8a8a8a"
          value={nome}
          onChangeText={setNome}
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#8a8a8a"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="CPF"
          placeholderTextColor="#8a8a8a"
          keyboardType="numeric"
          value={cpf}
          maxLength={14}
          onChangeText={formatarCPF}
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#8a8a8a"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
          autoCapitalize="none"
          autoCorrect={false}
          editable={!loading}
        />

        <View style={styles.selectContainer}>
          <TouchableOpacity
            style={[
              styles.option,
              tipo === "doador" && styles.optionActive,
            ]}
            onPress={() => setTipo("doador")}
            disabled={loading}
          >
            <Text style={styles.optionText}>Doador</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.option,
              tipo === "coletor" && styles.optionActive,
            ]}
            onPress={() => setTipo("coletor")}
            disabled={loading}
          >
            <Text style={styles.optionText}>Coletor</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={cadastrar}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Cadastrando..." : "Cadastrar"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.replace("/login")}
          disabled={loading}
        >
          <Text style={styles.link}>Já tem conta? Faça login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}