import { fazerCadastro } from "@/src/services/auth";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [tipo, setTipo] = useState<"DOADOR" | "COLETOR">("DOADOR");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function formatarCpf(valor: string) {
    const numeros = valor.replace(/\D/g, "").slice(0, 11);

    return numeros
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1-$2");
  }

  async function handleCadastro() {
    if (loading) return;

    setError("");

    const nomeLimpo = nome.trim();
    const emailLimpo = email.trim().toLowerCase();
    const cpfLimpo = cpf.replace(/\D/g, "");
    const senhaLimpa = senha.trim();
    const tipoLimpo = tipo.trim().toUpperCase();

    if (!nomeLimpo || !emailLimpo || !cpfLimpo || !senhaLimpa) {
      setError("Preencha todos os campos.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(emailLimpo)) {
      setError("Digite um e-mail válido.");
      return;
    }

    if (cpfLimpo.length !== 11) {
      setError("Digite um CPF válido com 11 números.");
      return;
    }

    if (senhaLimpa.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    try {
      setLoading(true);

      console.log("📤 CADASTRO:", {
        nome: nomeLimpo,
        email: emailLimpo,
        cpf: cpfLimpo,
        senha: senhaLimpa,
        tipo: tipoLimpo,
      });

      const resposta = await fazerCadastro(
        nomeLimpo,
        emailLimpo,
        cpfLimpo,
        senhaLimpa,
        tipoLimpo
      );

      console.log("✅ CADASTRO OK:", resposta);

      router.replace("/login");
    } catch (err: any) {
      console.log("❌ ERRO CADASTRO COMPLETO:", err);
      console.log("❌ STATUS CADASTRO:", err?.response?.status);
      console.log("❌ DATA CADASTRO:", err?.response?.data);
      console.log("❌ MESSAGE CADASTRO:", err?.message);

      if (err?.response?.status === 400) {
        setError(
          err?.response?.data?.message ||
            err?.response?.data?.errors?.email ||
            err?.response?.data?.errors?.cpf ||
            err?.response?.data?.errors?.senha ||
            "Dados inválidos."
        );
      } else if (err?.response?.status === 409) {
        setError(
          err?.response?.data?.message || "E-mail ou CPF já cadastrados."
        );
      } else if (!err?.response) {
        setError("Sem conexão com o servidor.");
      } else {
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Erro ao fazer cadastro."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#09B388",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
      }}
    >
      <View
        style={{
          width: "100%",
          maxWidth: 540,
          backgroundColor: "#F7F7F7",
          borderRadius: 20,
          paddingHorizontal: 24,
          paddingVertical: 30,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.18,
          shadowRadius: 12,
          elevation: 10,
        }}
      >
        <Text
          style={{
            fontSize: 26,
            fontWeight: "700",
            textAlign: "center",
            color: "#0C6B5A",
            marginBottom: 28,
          }}
        >
          Cadastro
        </Text>

        <TextInput
          value={nome}
          onChangeText={setNome}
          placeholder="Nome completo"
          placeholderTextColor="#8F8F8F"
          autoCapitalize="words"
          editable={!loading}
          style={{
            height: 52,
            borderBottomWidth: 1,
            borderBottomColor: "#B7D3CC",
            marginBottom: 22,
            fontSize: 16,
            color: "#1F1F1F",
            backgroundColor: "transparent",
          }}
        />

        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="E-mail"
          placeholderTextColor="#8F8F8F"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          editable={!loading}
          style={{
            height: 52,
            borderBottomWidth: 1,
            borderBottomColor: "#B7D3CC",
            marginBottom: 22,
            fontSize: 16,
            color: "#1F1F1F",
            backgroundColor: "transparent",
          }}
        />

        <TextInput
          value={cpf}
          onChangeText={(texto) => setCpf(formatarCpf(texto))}
          placeholder="CPF"
          placeholderTextColor="#8F8F8F"
          keyboardType="numeric"
          maxLength={14}
          editable={!loading}
          style={{
            height: 52,
            borderBottomWidth: 1,
            borderBottomColor: "#B7D3CC",
            marginBottom: 22,
            fontSize: 16,
            color: "#1F1F1F",
            backgroundColor: "transparent",
          }}
        />

        <TextInput
          value={senha}
          onChangeText={setSenha}
          placeholder="Senha"
          placeholderTextColor="#8F8F8F"
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          editable={!loading}
          style={{
            height: 52,
            borderBottomWidth: 1,
            borderBottomColor: "#B7D3CC",
            marginBottom: 26,
            fontSize: 16,
            color: "#1F1F1F",
            backgroundColor: "transparent",
          }}
        />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 26,
          }}
        >
          <TouchableOpacity
            onPress={() => setTipo("DOADOR")}
            disabled={loading}
            style={{
              flex: 1,
              height: 56,
              borderRadius: 10,
              borderWidth: 1.5,
              borderColor: "#39B89B",
              backgroundColor: "#F7F7F7",
              justifyContent: "center",
              alignItems: "center",
              marginRight: 8,
            }}
          >
            <Text
              style={{
                color: "#2CA98D",
                fontWeight: "600",
                fontSize: 16,
              }}
            >
              Doador
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setTipo("COLETOR")}
            disabled={loading}
            style={{
              flex: 1,
              height: 56,
              borderRadius: 10,
              borderWidth: 1.5,
              borderColor: "#39B89B",
              backgroundColor: "#F7F7F7",
              justifyContent: "center",
              alignItems: "center",
              marginLeft: 8,
            }}
          >
            <Text
              style={{
                color: "#2CA98D",
                fontWeight: "600",
                fontSize: 16,
              }}
            >
              Coletor
            </Text>
          </TouchableOpacity>
        </View>

        {error ? (
          <Text
            style={{
              color: "#D93025",
              marginBottom: 14,
              textAlign: "center",
              fontSize: 14,
            }}
          >
            {error}
          </Text>
        ) : null}

        <TouchableOpacity
          onPress={handleCadastro}
          disabled={loading}
          style={{
            backgroundColor: "#0B6B59",
            height: 56,
            borderRadius: 8,
            justifyContent: "center",
            alignItems: "center",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text
              style={{
                color: "#FFFFFF",
                fontWeight: "700",
                fontSize: 16,
                letterSpacing: 0.4,
              }}
            >
              Cadastrar
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.replace("/login")}
          disabled={loading}
          style={{ marginTop: 22 }}
        >
          <Text
            style={{
              textAlign: "center",
              color: "#2FAF91",
              fontSize: 15,
              fontWeight: "500",
            }}
          >
            Já tem conta? Faça login
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}