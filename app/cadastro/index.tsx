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
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const tipo = "DOADOR";

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

    if (!nomeLimpo || !emailLimpo || !cpfLimpo || !senhaLimpa) {
      setError("Preencha todos os campos.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(emailLimpo)) {
      setError("Digite um e-mail válido.");
      return;
    }

    if (cpfLimpo.length !== 11) {
      setError("Digite um CPF válido.");
      return;
    }

    if (senhaLimpa.length < 6) {
      setError("Senha mínima de 6 caracteres.");
      return;
    }

    try {
      setLoading(true);

      await fazerCadastro(
        nomeLimpo,
        emailLimpo,
        cpfLimpo,
        senhaLimpa,
        tipo
      );

      router.replace("/login");
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Erro ao fazer cadastro."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#12A67E",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
      }}
    >
      <View
        style={{
          width: "100%",
          maxWidth: 500,
          backgroundColor: "#F2F2F2",
          borderRadius: 20,
          paddingHorizontal: 28,
          paddingVertical: 30,
          elevation: 8,
        }}
      >
        <Text
          style={{
            fontSize: 24,
            fontWeight: "700",
            textAlign: "center",
            color: "#0C6B5A",
            marginBottom: 30,
          }}
        >
          Cadastro
        </Text>

        <Text
          style={{
            color: "#7A7A7A",
            fontSize: 14,
            marginBottom: 6,
          }}
        >
          Nome completo
        </Text>
        <TextInput
          value={nome}
          onChangeText={setNome}
          placeholder=""
          style={{
            borderBottomWidth: 1,
            borderBottomColor: "#B8C9C4",
            marginBottom: 24,
            paddingVertical: 8,
            fontSize: 16,
            color: "#333",
          }}
        />

        <Text
          style={{
            color: "#7A7A7A",
            fontSize: 14,
            marginBottom: 6,
          }}
        >
          E-mail
        </Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder=""
          keyboardType="email-address"
          autoCapitalize="none"
          style={{
            borderBottomWidth: 1,
            borderBottomColor: "#B8C9C4",
            marginBottom: 24,
            paddingVertical: 8,
            fontSize: 16,
            color: "#333",
          }}
        />

        <Text
          style={{
            color: "#7A7A7A",
            fontSize: 14,
            marginBottom: 6,
          }}
        >
          CPF
        </Text>
        <TextInput
          value={cpf}
          onChangeText={(t) => setCpf(formatarCpf(t))}
          placeholder=""
          keyboardType="numeric"
          style={{
            borderBottomWidth: 1,
            borderBottomColor: "#B8C9C4",
            marginBottom: 24,
            paddingVertical: 8,
            fontSize: 16,
            color: "#333",
          }}
        />

        <Text
          style={{
            color: "#7A7A7A",
            fontSize: 14,
            marginBottom: 6,
          }}
        >
          Senha
        </Text>
        <TextInput
          value={senha}
          onChangeText={setSenha}
          placeholder=""
          secureTextEntry
          style={{
            borderBottomWidth: 1,
            borderBottomColor: "#B8C9C4",
            marginBottom: 24,
            paddingVertical: 8,
            fontSize: 16,
            color: "#333",
          }}
        />

        {error ? (
          <Text
            style={{
              color: "red",
              marginBottom: 14,
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
            backgroundColor: "#0C6B5A",
            paddingVertical: 15,
            borderRadius: 8,
            alignItems: "center",
            marginTop: 8,
            marginBottom: 18,
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text
              style={{
                color: "#FFF",
                fontWeight: "700",
                fontSize: 16,
              }}
            >
              Cadastrar
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace("/login")}>
          <Text
            style={{
              textAlign: "center",
              color: "#22A884",
              fontSize: 15,
            }}
          >
            Já tem conta? Faça login
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}