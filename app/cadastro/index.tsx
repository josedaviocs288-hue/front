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
        backgroundColor: "#f2f2f2",
        padding: 20,
        justifyContent: "center",
      }}
    >
      <Text
        style={{
          fontSize: 28,
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: 30,
          color: "#222",
        }}
      >
        RECICLE+
      </Text>

      <Text style={{ color: "#222", marginBottom: 6 }}>Nome</Text>
      <TextInput
        value={nome}
        onChangeText={setNome}
        placeholder="Digite seu nome"
        placeholderTextColor="#666"
        autoCapitalize="words"
        editable={!loading}
        style={{
          borderWidth: 1,
          borderColor: "#999",
          backgroundColor: "#fff",
          marginBottom: 15,
          padding: 12,
          borderRadius: 8,
          color: "#222",
        }}
      />

      <Text style={{ color: "#222", marginBottom: 6 }}>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Digite seu email"
        placeholderTextColor="#666"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        editable={!loading}
        style={{
          borderWidth: 1,
          borderColor: "#999",
          backgroundColor: "#fff",
          marginBottom: 15,
          padding: 12,
          borderRadius: 8,
          color: "#222",
        }}
      />

      <Text style={{ color: "#222", marginBottom: 6 }}>CPF</Text>
      <TextInput
        value={cpf}
        onChangeText={(texto) => setCpf(formatarCpf(texto))}
        placeholder="Digite seu CPF"
        placeholderTextColor="#666"
        keyboardType="numeric"
        maxLength={14}
        editable={!loading}
        style={{
          borderWidth: 1,
          borderColor: "#999",
          backgroundColor: "#fff",
          marginBottom: 15,
          padding: 12,
          borderRadius: 8,
          color: "#222",
        }}
      />

      <Text style={{ color: "#222", marginBottom: 6 }}>Senha</Text>
      <TextInput
        value={senha}
        onChangeText={setSenha}
        placeholder="Digite sua senha"
        placeholderTextColor="#666"
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        editable={!loading}
        style={{
          borderWidth: 1,
          borderColor: "#999",
          backgroundColor: "#fff",
          marginBottom: 15,
          padding: 12,
          borderRadius: 8,
          color: "#222",
        }}
      />

      <Text style={{ color: "#222", marginBottom: 8 }}>Tipo de usuário</Text>

      <View style={{ flexDirection: "row", marginBottom: 10 }}>
        <TouchableOpacity
          onPress={() => setTipo("DOADOR")}
          disabled={loading}
          style={{
            flex: 1,
            backgroundColor: tipo === "DOADOR" ? "orange" : "#fff",
            padding: 12,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: "#999",
            marginRight: 5,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: tipo === "DOADOR" ? "#fff" : "#222",
              fontWeight: "bold",
            }}
          >
            DOADOR
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setTipo("COLETOR")}
          disabled={loading}
          style={{
            flex: 1,
            backgroundColor: tipo === "COLETOR" ? "orange" : "#fff",
            padding: 12,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: "#999",
            marginLeft: 5,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: tipo === "COLETOR" ? "#fff" : "#222",
              fontWeight: "bold",
            }}
          >
            COLETOR
          </Text>
        </TouchableOpacity>
      </View>

      {error ? (
        <Text
          style={{
            color: "red",
            marginBottom: 10,
            textAlign: "center",
          }}
        >
          {error}
        </Text>
      ) : null}

      <TouchableOpacity
        onPress={handleCadastro}
        disabled={loading}
        style={{
          backgroundColor: "orange",
          padding: 15,
          marginTop: 10,
          borderRadius: 8,
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text
            style={{
              textAlign: "center",
              color: "#fff",
              fontWeight: "bold",
            }}
          >
            Cadastrar
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.replace("/login")}
        disabled={loading}
      >
        <Text
          style={{
            marginTop: 15,
            textAlign: "center",
            color: "#222",
          }}
        >
          Já tem conta? Entrar
        </Text>
      </TouchableOpacity>
    </View>
  );
}