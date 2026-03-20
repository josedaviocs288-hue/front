import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";

import { styles } from "@/src/styles/loginStyles";
// TEMP: desativado enquanto o backend não está rodando
// import { login } from "@/src/services/authService";
import { setAuthToken } from "@/src/api/http";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setError("");
    if (loading) return;
    setLoading(true);

    if (!email || !senha) {
      setError("Preencha todos os campos.");
      setLoading(false);
      return;
    }

    // ORIGINAL (backend ligado):
    // try {
    //   await login({ email, senha });
    //   router.replace("/(tabs)/home");
    // } catch (e: any) {
    //   const message =
    //     (e?.message as string) ||
    //     "Não foi possível fazer login. Tente novamente.";
    //   setError(message);
    // }

    // TEMP: comentar chamada de API e entrar em modo offline
    await AsyncStorage.setItem("@usuario", JSON.stringify({ nome: "Usuário", email, tipo: "doador" }));
    await setAuthToken("dev-offline");
    router.replace("/(tabs)/home");
    setLoading(false);
  }

  return (
    <LinearGradient
      colors={["#6cd34c", "#26a8c9"]}
      style={styles.background}
    >
      <View style={styles.card}>
        <Image
          source={require("../../src/assets/images/logo-recicle-plus.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>RECICLE+</Text>
        <Text style={styles.subtitle}>Reciclagem Sustentável!</Text>
        <Text style={styles.description}>
          Faça login para continuar ajudando o meio ambiente
        </Text>

        {/* Email */}
        <View style={styles.inputGroup}>
          <Text style={styles.icon}>📧</Text>
          <TextInput
            placeholder="seu@email.com"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
          />
        </View>

        {/* Senha */}
        <View style={styles.inputGroup}>
          <Text style={styles.icon}>🔒</Text>
          <TextInput
            placeholder="Digite sua senha"
            value={senha}
            onChangeText={setSenha}
            style={styles.input}
            secureTextEntry
          />
        </View>

        <View style={styles.options}>
          <Text>Lembrar de mim</Text>
          <Text style={styles.link}>Esqueceu a senha?</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar no App</Text>
        </TouchableOpacity>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Text style={styles.signup}>
          Não tem cadastro?{" "}
          <Text
            style={styles.link}
            onPress={() => router.push("/cadastro")}
          >
            Crie sua conta
          </Text>
        </Text>
      </View>
    </LinearGradient>
  );
}
