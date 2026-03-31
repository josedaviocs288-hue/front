import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { fazerLogin } from "@/src/services/auth";
import { styles } from "@/src/styles/loginStyles";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (loading) return;

    setError("");

    const emailLimpo = email.trim().toLowerCase();
    const senhaLimpa = senha.trim();

    if (!emailLimpo || !senhaLimpa) {
      setError("Preencha todos os campos.");
      return;
    }

    try {
      setLoading(true);

      console.log("📤 LOGIN TELA:", {
        email: emailLimpo,
        senha: senhaLimpa,
      });

      const resposta = await fazerLogin(emailLimpo, senhaLimpa);

      console.log("📥 LOGIN RESPONSE COMPLETA:", resposta);
      console.log("📥 LOGIN RESPONSE DATA:", resposta?.data);

      const data = resposta?.data || {};

      const token = String(data?.token || "").trim();
      const nome = String(data?.nome || "").trim();
      const emailUsuario = String(data?.email || emailLimpo).trim().toLowerCase();
      const idUsuario = data?.id != null ? String(data.id) : "";
      const tipo = String(data?.tipo || "").trim().toUpperCase();

      if (!token) {
        throw new Error("Token não veio na resposta do login.");
      }

      await AsyncStorage.multiSet([
        ["@recicleplus_token", token],
        ["token", token],

        ["nomeUsuario", nome],
        ["emailUsuario", emailUsuario],

        ["usuarioId", idUsuario],
        ["idUsuario", idUsuario],

        ["tipoUsuario", tipo],
        ["tipo", tipo],
        ["@tipoUsuario", tipo],
      ]);

      const tokenSalvo = await AsyncStorage.getItem("@recicleplus_token");
      const tipoSalvo = await AsyncStorage.getItem("tipoUsuario");

      console.log("✅ TOKEN SALVO:", tokenSalvo);
      console.log("✅ TIPO SALVO:", tipoSalvo);
      console.log("👤 NOME:", nome);
      console.log("📧 EMAIL:", emailUsuario);
      console.log("🆔 ID:", idUsuario);
      console.log("👤 TIPO:", tipo);

      router.replace("/home");
    } catch (err: any) {
      console.log("❌ ERRO LOGIN:", err?.response?.data || err?.message || err);

      if (err?.response?.status === 401) {
        setError("Email ou senha inválidos.");
      } else if (
        err?.message?.includes("Network") ||
        err?.message?.includes("timeout")
      ) {
        setError("Sem conexão com o servidor.");
      } else {
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Erro ao fazer login."
        );
      }
    } finally {
      setLoading(false);
    }
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

        <View style={styles.inputGroup}>
          <Text style={styles.icon}>📧</Text>
          <TextInput
            placeholder="seu@gmail.com"
            placeholderTextColor="#8a8a8a"
            value={email}
            onChangeText={setEmail}
            style={[styles.input, { color: "#333", flex: 1 }]}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.icon}>🔒</Text>
          <TextInput
            placeholder="Digite sua senha"
            placeholderTextColor="#8a8a8a"
            value={senha}
            onChangeText={setSenha}
            style={[styles.input, { color: "#333", flex: 1 }]}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
          />
        </View>

        <View style={styles.options}>
          <Text style={{ color: "#444" }}>Lembrar de mim</Text>
          <Text style={styles.link}>Esqueceu a senha?</Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Entrar no App</Text>
          )}
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