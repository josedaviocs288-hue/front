import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function DoacaoFixa() {
  const [tipoReciclavel, setTipoReciclavel] = useState("");
  const [tipoQuantidade, setTipoQuantidade] = useState("quilo");
  const [quantidade, setQuantidade] = useState("");
  const [lixeira, setLixeira] = useState("");
  const [qrValido, setQrValido] = useState(false);

  const unidadeLabel = useMemo(() => {
    return tipoQuantidade === "quilo" ? "kg" : "unidades";
  }, [tipoQuantidade]);

  function lerQRCode() {
    Alert.alert("QR Code", "QR Code lido com sucesso!");
    setQrValido(true);
  }

  function registrarDoacao() {
    const quantidadeLimpa = quantidade.trim().replace(",", ".");

    if (!tipoReciclavel || !quantidadeLimpa || !lixeira) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    if (Number(quantidadeLimpa) <= 0 || Number.isNaN(Number(quantidadeLimpa))) {
      Alert.alert("Erro", "Digite uma quantidade válida.");
      return;
    }

    if (!qrValido) {
      Alert.alert("Atenção", "Você precisa ler o QR Code da lixeira.");
      return;
    }

    Alert.alert(
      "Sucesso",
      `Doação registrada com sucesso!\n\nMaterial: ${tipoReciclavel}\nQuantidade: ${quantidadeLimpa} ${unidadeLabel}`
    );

    setQrValido(false);
    setTipoReciclavel("");
    setTipoQuantidade("quilo");
    setQuantidade("");
    setLixeira("");
  }

  const formularioValido =
    !!tipoReciclavel &&
    !!quantidade.trim() &&
    !!lixeira &&
    qrValido &&
    !Number.isNaN(Number(quantidade.trim().replace(",", "."))) &&
    Number(quantidade.trim().replace(",", ".")) > 0;

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <Text style={styles.heroBadge}>♻️ RECICLE+</Text>
          <Text style={styles.title}>Doação na Lixeira</Text>
          <Text style={styles.subtitle}>
            Informe o material reciclável, a quantidade e o ponto de coleta.
            Depois valide a doação lendo o QR Code da lixeira.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Dados da Doação</Text>

          <Text style={styles.label}>Tipo de reciclável</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={tipoReciclavel}
              onValueChange={(value) => setTipoReciclavel(value)}
            >
              <Picker.Item label="Selecione o material" value="" />
              <Picker.Item label="Plástico" value="PLÁSTICO" />
              <Picker.Item label="Vidro" value="VIDRO" />
              <Picker.Item label="Papel" value="PAPEL" />
              <Picker.Item label="Metal" value="METAL" />
              <Picker.Item label="Eletrônico" value="ELETRÔNICO" />
            </Picker>
          </View>

          <Text style={styles.label}>Forma de medição</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={tipoQuantidade}
              onValueChange={(value) => setTipoQuantidade(value)}
            >
              <Picker.Item label="Quilo (kg)" value="quilo" />
              <Picker.Item label="Unidade" value="unidade" />
            </Picker>
          </View>

          <Text style={styles.label}>Quantidade</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              keyboardType="numeric"
              placeholder={
                tipoQuantidade === "quilo"
                  ? "Ex: 2,5"
                  : "Ex: 8"
              }
              placeholderTextColor="#8b8b8b"
              value={quantidade}
              onChangeText={setQuantidade}
            />
            <View style={styles.unitBox}>
              <Text style={styles.unitText}>{unidadeLabel}</Text>
            </View>
          </View>

          <Text style={styles.helperText}>
            {tipoQuantidade === "quilo"
              ? "Digite o peso aproximado do material reciclável."
              : "Digite a quantidade de itens recicláveis."}
          </Text>

          <Text style={styles.label}>Local da lixeira</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={lixeira}
              onValueChange={(value) => setLixeira(value)}
            >
              <Picker.Item label="Selecione o ponto de coleta" value="" />
              <Picker.Item label="Escola Municipal Itarema" value="escola" />
              <Picker.Item label="Praça Central" value="praca" />
              <Picker.Item label="Mercado Público" value="mercado" />
              <Picker.Item
                label="Secretaria de Meio Ambiente"
                value="secretaria"
              />
              <Picker.Item label="Posto de Saúde" value="posto" />
            </Picker>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Validação</Text>

          <View
            style={[
              styles.statusBox,
              qrValido ? styles.statusBoxSuccess : styles.statusBoxPending,
            ]}
          >
            <Text style={styles.statusTitle}>Status do QR Code</Text>
            <Text style={styles.statusText}>
              {qrValido
                ? "✅ QR Code validado com sucesso"
                : "⚠️ QR Code ainda não foi lido"}
            </Text>
          </View>

          <Pressable style={[styles.button, styles.qrButton]} onPress={lerQRCode}>
            <Text style={styles.buttonText}>📷 Ler QR Code</Text>
          </Pressable>

          <Pressable
            style={[
              styles.button,
              styles.primaryButton,
              !formularioValido && styles.buttonDisabled,
            ]}
            onPress={registrarDoacao}
          >
            <Text style={styles.buttonText}>Registrar Doação</Text>
          </Pressable>

          <Pressable
            style={styles.secondaryButton}
            onPress={() => router.back()}
          >
            <Text style={styles.secondaryButtonText}>⬅ Voltar</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f4f8f7",
  },
  container: {
    padding: 18,
    paddingBottom: 30,
  },
  heroCard: {
    backgroundColor: "#0f766e",
    borderRadius: 24,
    padding: 20,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  heroBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#ffffff22",
    color: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 12,
  },
  title: {
    fontSize: 25,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: "#e8fffb",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 18,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#16302b",
    marginBottom: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#23413b",
    marginBottom: 8,
    marginTop: 10,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#d9e5e2",
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#f9fbfb",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d9e5e2",
    borderRadius: 14,
    backgroundColor: "#f9fbfb",
    overflow: "hidden",
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    color: "#1b2b28",
  },
  unitBox: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: "#e8f5f2",
    borderLeftWidth: 1,
    borderLeftColor: "#d9e5e2",
  },
  unitText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0f766e",
  },
  helperText: {
    fontSize: 12,
    color: "#6b7d79",
    marginTop: 8,
  },
  statusBox: {
    borderRadius: 16,
    padding: 16,
    marginTop: 4,
    marginBottom: 16,
    borderWidth: 1,
  },
  statusBoxSuccess: {
    backgroundColor: "#ecfdf5",
    borderColor: "#bbf7d0",
  },
  statusBoxPending: {
    backgroundColor: "#fff7ed",
    borderColor: "#fed7aa",
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#203633",
    marginBottom: 6,
  },
  statusText: {
    fontSize: 14,
    color: "#314a45",
  },
  button: {
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  qrButton: {
    backgroundColor: "#14b8a6",
  },
  primaryButton: {
    backgroundColor: "#0f766e",
  },
  buttonDisabled: {
    opacity: 0.75,
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
  },
  secondaryButton: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#cfe1dd",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  secondaryButtonText: {
    color: "#23413b",
    fontSize: 15,
    fontWeight: "700",
  },
});