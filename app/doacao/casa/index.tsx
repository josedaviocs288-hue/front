// @ts-ignore
import { Picker } from "@react-native-picker/picker";
import * as Location from "expo-location";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { api } from "@/src/services/api";
import { getToken } from "@/src/services/token";

function normalizarUF(valor?: string | null) {
  if (!valor) return "CE";

  const v = valor.trim().toUpperCase();

  if (v === "CEARÁ" || v === "CEARA") return "CE";
  return v.length > 2 ? "CE" : v;
}

type TipoQuantidade = "quilo" | "unidade";

export default function DoacaoCasa() {
  const [tipoReciclavel, setTipoReciclavel] = useState("");
  const [tipoQuantidade, setTipoQuantidade] =
    useState<TipoQuantidade>("quilo");
  const [quantidade, setQuantidade] = useState("");
  const [numero, setNumero] = useState("");
  const [referencia, setReferencia] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const [rua, setRua] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [uf, setUf] = useState("");

  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  const [carregandoLocalizacao, setCarregandoLocalizacao] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const quantidadeNumerica = useMemo(() => {
    const valorTratado = quantidade.replace(",", ".");
    return Number(valorTratado);
  }, [quantidade]);

  async function usarMinhaLocalizacao() {
    try {
      setCarregandoLocalizacao(true);

      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permissão negada",
          "Autorize a localização para registrar sua doação."
        );
        return;
      }

      const posicao = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const lat = posicao.coords.latitude;
      const lng = posicao.coords.longitude;

      setLatitude(lat);
      setLongitude(lng);

      try {
        const enderecos = await Location.reverseGeocodeAsync({
          latitude: lat,
          longitude: lng,
        });

        const endereco = enderecos?.[0];

        if (endereco) {
          setRua(endereco.street || endereco.name || "");
          setBairro(endereco.district || endereco.subregion || "");
          setCidade(endereco.city || endereco.subregion || "");
          setUf(normalizarUF(endereco.region || "CE"));

          if (!referencia.trim()) {
            setReferencia(
              [endereco.street, endereco.streetNumber, endereco.district]
                .filter(Boolean)
                .join(", ")
            );
          }

          if (!numero.trim() && endereco.streetNumber) {
            setNumero(String(endereco.streetNumber));
          }
        }
      } catch (geoError: any) {
        console.log(
          "⚠️ Não foi possível converter localização em endereço:",
          geoError?.message
        );
      }

      Alert.alert("Sucesso", "Sua localização foi capturada.");
    } catch (error: any) {
      console.log("❌ ERRO LOCALIZAÇÃO:", error?.message);
      Alert.alert("Erro", "Não foi possível obter sua localização.");
    } finally {
      setCarregandoLocalizacao(false);
    }
  }

  async function registrarDoacao() {
    try {
      const token = await getToken();
      console.log("🔑 TOKEN ANTES DE REGISTRAR:", token);

      if (!token) {
        Alert.alert("Erro", "Sua sessão expirou. Faça login novamente.");
        return;
      }

      if (!tipoReciclavel) {
        Alert.alert("Erro", "Selecione o tipo de reciclável.");
        return;
      }

      if (!quantidade.trim()) {
        Alert.alert("Erro", "Preencha a quantidade.");
        return;
      }

      if (Number.isNaN(quantidadeNumerica) || quantidadeNumerica <= 0) {
        Alert.alert("Erro", "Digite uma quantidade válida.");
        return;
      }

      if (latitude === null || longitude === null) {
        Alert.alert(
          "Erro",
          "Capture sua localização antes de registrar a doação."
        );
        return;
      }

      const payload = {
        materiais: [tipoReciclavel],
        tipoQuantidade: tipoQuantidade === "quilo" ? "KG" : "UNIDADE",
        quantidadeDescricao:
          tipoQuantidade === "quilo"
            ? `${quantidadeNumerica} kg`
            : `${Math.round(quantidadeNumerica)} unidades`,
        quantidadeKg: tipoQuantidade === "quilo" ? quantidadeNumerica : null,
        quantidadeUnidades:
          tipoQuantidade === "unidade" ? Math.round(quantidadeNumerica) : 0,
        rua: rua.trim() || "Não informado",
        numero: numero.trim() || "S/N",
        bairro: bairro.trim() || "Não informado",
        cidade: cidade.trim() || "Itarema",
        uf: normalizarUF(uf),
        referencia: referencia.trim() || null,
        observacoes: observacoes.trim() || null,
        latitude,
        longitude,
      };

      setSalvando(true);

      console.log("📤 ENVIANDO DOAÇÃO:", JSON.stringify(payload, null, 2));

      const response = await api.post("/doacoes/casa", payload);

      console.log("✅ RESPOSTA DOAÇÃO:", response?.data);

      Alert.alert("Doação registrada", "Aguarde a confirmação do coletor.");

      setTipoReciclavel("");
      setTipoQuantidade("quilo");
      setQuantidade("");
      setNumero("");
      setReferencia("");
      setObservacoes("");
      setRua("");
      setBairro("");
      setCidade("");
      setUf("");
      setLatitude(null);
      setLongitude(null);

      router.back();
    } catch (error: any) {
      console.log("❌ ERRO DOAÇÃO STATUS:", error?.response?.status);
      console.log("❌ ERRO DOAÇÃO DATA:", error?.response?.data);
      console.log("❌ ERRO DOAÇÃO MSG:", error?.message);

      Alert.alert(
        "Erro",
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Não foi possível registrar a doação."
      );
    } finally {
      setSalvando(false);
    }
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerCard}>
          <Text style={styles.title}>Faça sua doação</Text>
          <Text style={styles.subtitle}>
            Informe o material, a quantidade e sua localização para o coletor
            encontrar você.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Tipo de reciclável</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={tipoReciclavel}
              onValueChange={(value: string) => setTipoReciclavel(value)}
              style={{ color: tipoReciclavel ? "#111827" : "#9ca3af" }}
            >
              <Picker.Item
                label="Escolha o tipo de doação"
                value=""
                color="#9ca3af"
              />
              <Picker.Item label="Plástico" value="PLASTICO" />
              <Picker.Item label="Vidro" value="VIDRO" />
              <Picker.Item label="Papel" value="PAPEL" />
              <Picker.Item label="Metal" value="METAL" />
              <Picker.Item label="Eletrônico" value="ELETRONICO" />
            </Picker>
          </View>

          <Text style={styles.label}>Doar por</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={tipoQuantidade}
              onValueChange={(value: string) =>
                setTipoQuantidade(value as TipoQuantidade)
              }
              style={{ color: "#111827" }}
            >
              <Picker.Item label="Quilo (kg)" value="quilo" />
              <Picker.Item label="Unidade" value="unidade" />
            </Picker>
          </View>

          <Text style={styles.label}>Quantidade</Text>
          <TextInput
            style={styles.textInput}
            keyboardType="numeric"
            placeholder={
              tipoQuantidade === "quilo"
                ? "Digite a quantidade em kg"
                : "Digite a quantidade em unidades"
            }
            placeholderTextColor="#080808"
            value={quantidade}
            onChangeText={setQuantidade}
          />

          <Text style={styles.label}>Número</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Ex.: 123"
            placeholderTextColor="#090909"
            value={numero}
            onChangeText={setNumero}
          />

          <Text style={styles.label}>Referência do endereço</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Ex.: portão azul, perto da praça"
            placeholderTextColor="#0d0d0d"
            value={referencia}
            onChangeText={setReferencia}
          />

          <Text style={styles.label}>Observações</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            placeholder="Ex.: material separado em sacos"
            placeholderTextColor="#0a0a0a"
            value={observacoes}
            onChangeText={setObservacoes}
            multiline
          />

          <Pressable
            style={[styles.button, styles.locationButton]}
            onPress={usarMinhaLocalizacao}
            disabled={carregandoLocalizacao}
          >
            {carregandoLocalizacao ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Usar minha localização atual</Text>
            )}
          </Pressable>

          {latitude !== null && longitude !== null ? (
            <View style={styles.successBox}>
              <Text style={styles.successText}>
                ✅ Localização capturada com sucesso
              </Text>
              <Text style={styles.successSubtext}>
                {rua || "Rua não identificada"}
                {numero ? `, ${numero}` : ""}
              </Text>
              <Text style={styles.successSubtext}>
                {bairro || "Bairro não identificado"} - {cidade || "Itarema"}/
                {uf || "CE"}
              </Text>
              <Text style={styles.successSubtext}>
                Lat: {latitude.toFixed(5)} | Long: {longitude.toFixed(5)}
              </Text>
            </View>
          ) : null}

          <Pressable
            style={[styles.button, salvando && styles.buttonDisabled]}
            onPress={registrarDoacao}
            disabled={salvando}
          >
            {salvando ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Registrar doação</Text>
            )}
          </Pressable>

          <Pressable
            style={styles.secondaryButton}
            onPress={() => router.back()}
          >
            <Text style={styles.secondaryButtonText}>⬅ Voltar</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#eef5f0",
  },
  container: {
    padding: 16,
    paddingBottom: 28,
  },
  headerCard: {
    backgroundColor: "#2e7d32",
    borderRadius: 22,
    padding: 20,
    marginBottom: 16,
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    color: "#e7f7ea",
    fontSize: 15,
    lineHeight: 22,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  label: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 8,
    marginTop: 10,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#d8e0d9",
    borderRadius: 14,
    backgroundColor: "#f8fbf8",
    overflow: "hidden",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#d8e0d9",
    borderRadius: 14,
    backgroundColor: "#f8fbf8",
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === "ios" ? 14 : 12,
    fontSize: 15,
    color: "#111827",
  },
  textArea: {
    minHeight: 96,
    textAlignVertical: "top",
  },
  button: {
    marginTop: 16,
    backgroundColor: "#33a852",
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: "center",
  },
  locationButton: {
    backgroundColor: "#1f8efa",
  },
  buttonDisabled: {
    opacity: 0.75,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButton: {
    marginTop: 12,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: "center",
    backgroundColor: "#e9eef3",
  },
  secondaryButtonText: {
    color: "#334155",
    fontSize: 16,
    fontWeight: "bold",
  },
  successBox: {
    marginTop: 14,
    backgroundColor: "#eef9f0",
    borderColor: "#b7e0bf",
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
  },
  successText: {
    color: "#176b2c",
    fontWeight: "700",
  },
  successSubtext: {
    color: "#2f5f3a",
    marginTop: 4,
    fontSize: 13,
  },
});