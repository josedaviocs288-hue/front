import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Checkbox from "expo-checkbox";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { fazerLogin } from "../../src/services/auth";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [lembrar, setLembrar] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  async function entrar() {
    try {
      setErro("");

      if (!email.trim() || !senha.trim()) {
        setErro("Preencha email e senha.");
        return;
      }

      setCarregando(true);

      const response = await fazerLogin(email, senha);
      console.log("✅ LOGIN OK:", response);

      Alert.alert("Sucesso", "Login realizado com sucesso!");
      router.replace("/home");
    } catch (err: any) {
      console.log("❌ ERRO LOGIN:", err?.response?.data || err?.message);

      if (err?.response?.status === 401) {
        setErro("Email ou senha inválidos.");
      } else if (!err?.response) {
        setErro("Sem conexão com o servidor.");
      } else {
        setErro(
          err?.response?.data?.message || "Não foi possível fazer login."
        );
      }
    } finally {
      setCarregando(false);
    }
  }

  return (
    <LinearGradient colors={["#67d35f", "#35bfd0"]} style={styles.gradient}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          <View style={styles.card}>
            
            {/* 🔥 CORREÇÃO AQUI */}
            <Image
              source={require("../../src/assets/images/logo-recicle-plus.png")}
              style={styles.logo}
              resizeMode="contain"
            />

            <Text style={styles.titulo}>RECICLE+</Text>
            <Text style={styles.subtitulo}>Reciclagem Sustentável!</Text>
            <Text style={styles.descricao}>
              Faça login para continuar ajudando o meio ambiente
            </Text>

            <View style={styles.inputBox}>
              <Text style={styles.inputIcon}>📧</Text>
              <TextInput
                placeholder="seu@email.com"
                placeholderTextColor="#8b8b8b"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
              />
            </View>

            <View style={styles.inputBox}>
              <Text style={styles.inputIcon}>🔒</Text>
              <TextInput
                placeholder="Digite sua senha"
                placeholderTextColor="#8b8b8b"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry
                style={styles.input}
              />
            </View>

            <View style={styles.row}>
              <View style={styles.checkboxArea}>
                <Checkbox value={lembrar} onValueChange={setLembrar} />
                <Text style={styles.checkboxText}>Lembrar de mim</Text>
              </View>

              <Pressable
                onPress={() =>
                  Alert.alert(
                    "Aviso",
                    "Tela de recuperação ainda não implementada."
                  )
                }
              >
                <Text style={styles.linkSenha}>Esqueceu a senha?</Text>
              </Pressable>
            </View>

            {erro ? <Text style={styles.erro}>{erro}</Text> : null}

            <Pressable
              onPress={entrar}
              disabled={carregando}
              style={styles.botaoWrap}
            >
              <LinearGradient
                colors={["#63d654", "#2eb8d5"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.botao}
              >
                {carregando ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.botaoTexto}>Entrar no App</Text>
                )}
              </LinearGradient>
            </Pressable>

            <View style={styles.rodape}>
              <Text style={styles.rodapeTexto}>Não tem cadastro? </Text>
              <Pressable onPress={() => router.push("/cadastro")}>
                <Text style={styles.rodapeLink}>Crie sua conta</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  card: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#fff",
    borderRadius: 28,
    paddingHorizontal: 24,
    paddingVertical: 30,
    alignItems: "center",
    elevation: 8,
  },
  logo: {
    width: 180,
    height: 70,
    marginBottom: 6,
  },
  titulo: {
    fontSize: 20,
    fontWeight: "800",
    color: "#38b96a",
    marginTop: 4,
  },
  subtitulo: {
    fontSize: 17,
    fontWeight: "700",
    color: "#55b96e",
    marginTop: 4,
  },
  descricao: {
    textAlign: "center",
    color: "#555",
    fontSize: 15,
    marginTop: 18,
    marginBottom: 22,
  },
  inputBox: {
    width: "100%",
    height: 56,
    borderWidth: 1,
    borderColor: "#d8d8d8",
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  inputIcon: { fontSize: 18, marginRight: 10 },
  input: { flex: 1, fontSize: 16 },
  row: {
    width: "100%",
    marginBottom: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  checkboxArea: { flexDirection: "row", alignItems: "center" },
  checkboxText: { marginLeft: 8 },
  linkSenha: {
    color: "#2d47c7",
    textDecorationLine: "underline",
  },
  erro: {
    width: "100%",
    color: "#d62828",
    marginBottom: 12,
    textAlign: "center",
  },
  botaoWrap: { width: "100%" },
  botao: {
    width: "100%",
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  botaoTexto: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "800",
  },
  rodape: {
    flexDirection: "row",
    marginTop: 26,
  },
  rodapeTexto: { fontSize: 16 },
  rodapeLink: {
    color: "#28a9c7",
    fontSize: 16,
    fontWeight: "700",
  },
});