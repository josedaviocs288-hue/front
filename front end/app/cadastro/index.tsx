import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView
} from "react-native";
import { router } from "expo-router";
import { styles } from "@/src/styles/cadastroStyles"
// TEMP: desativado enquanto o backend não está rodando
// import { registerUser } from "@/src/services/userService";
import { isEmailValid, isCpfValid, isPasswordStrong } from "@/src/utils/validators";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setAuthToken } from "@/src/api/http";

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [tipo, setTipo] = useState<"doador" | "coletor" | "">("");

  function validarCPFLocal(cpf: string): boolean {
    return isCpfValid(cpf);
  }

  function formatarCPF(value: string) {
    let v = value.replace(/\D/g, "");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    setCpf(v);
  }

  async function cadastrar() {
    if (!nome || !email || !cpf || !senha || !tipo) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    if (!isEmailValid(email)) {
      Alert.alert("Erro", "E-mail inválido.");
      return;
    }

    if (!validarCPFLocal(cpf)) {
      Alert.alert("Erro", "CPF inválido.");
      return;
    }

    if (!isPasswordStrong(senha)) {
      Alert.alert("Erro", "Senha muito curta. Mínimo de 6 caracteres.");
      return;
    }

    // ORIGINAL (backend ligado):
    // try {
    //   await registerUser({ nome, email, cpf, senha, tipo: tipo as "doador" | "coletor" });
    //   Alert.alert("Sucesso", "Cadastro realizado com sucesso!", [
    //     { text: "OK", onPress: () => router.replace("/login") }
    //   ]);
    // } catch (e: any) {
    //   const status = e?.status ?? 0;
    //   if (status === 0) {
    //     await AsyncStorage.setItem("@usuario", JSON.stringify({ nome, email, tipo }));
    //     await setAuthToken("dev-offline");
    //     Alert.alert("Modo offline", "Cadastro simulado sem backend. Você será redirecionado para o login.");
    //     router.replace("/login");
    //   } else {
    //     const msg = (e?.message as string) || "Erro ao cadastrar. Tente novamente.";
    //     Alert.alert("Erro", msg);
    //   }
    // }

    // TEMP: comentar chamada de API e salvar localmente para habilitar fluxo
    await AsyncStorage.setItem("@usuario", JSON.stringify({ nome, email, tipo }));
    await setAuthToken("dev-offline");
    Alert.alert("Modo offline", "Cadastro simulado sem backend. Você será redirecionado para o login.");
    router.replace("/login");
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Cadastro</Text>

        <TextInput
          style={styles.input}
          placeholder="Nome completo"
          value={nome}
          onChangeText={setNome}
        />

        <TextInput
          style={styles.input}
          placeholder="E-mail"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="CPF"
          keyboardType="numeric"
          value={cpf}
          maxLength={14}
          onChangeText={formatarCPF}
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        <View style={styles.selectContainer}>
          <TouchableOpacity
            style={[
              styles.option,
              tipo === "doador" && styles.optionActive
            ]}
            onPress={() => setTipo("doador")}
          >
            <Text style={styles.optionText}>Doador</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.option,
              tipo === "coletor" && styles.optionActive
            ]}
            onPress={() => setTipo("coletor")}
          >
            <Text style={styles.optionText}>Coletor</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={cadastrar}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace("/login")}>
          <Text style={styles.link}>Já tem conta? Faça login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
