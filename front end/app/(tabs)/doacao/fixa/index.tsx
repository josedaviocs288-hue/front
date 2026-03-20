import { styles } from "@/src/styles/fixaStyles";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { criarColetaFixa } from "@/src/services/coletaService";

export default function DoacaoFixa() {
  const [tipoReciclavel, setTipoReciclavel] = useState("");
  const [tipoQuantidade, setTipoQuantidade] = useState("quilo");
  const [quantidade, setQuantidade] = useState("");
  const [lixeira, setLixeira] = useState("");
  const [qrValido, setQrValido] = useState(false);

  function lerQRCode() {
    Alert.alert("QR Code", "QR Code lido com sucesso!");
    setQrValido(true);
  }

  async function registrarDoacao() {
    if (!tipoReciclavel || !quantidade || !lixeira) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    if (!qrValido) {
      Alert.alert("Atenção", "Você precisa ler o QR Code da lixeira.");
      return;
    }

    try {
      await criarColetaFixa({
        tipoReciclavel,
        tipoQuantidade: tipoQuantidade as "quilo" | "unidade",
        quantidade,
        lixeira,
      });
      Alert.alert("Sucesso", "Doação registrada com sucesso!");
    } catch (e: any) {
      Alert.alert("Erro", (e?.message as string) || "Falha ao registrar doação.");
      return;
    }

    setQrValido(false);
    setTipoReciclavel("");
    setTipoQuantidade("quilo");
    setQuantidade("");
    setLixeira("");
  }

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <Text style={styles.title}>Doação na Lixeira</Text>

          {/* TIPO RECICLÁVEL */}
          <Text style={styles.label}>Tipo de Reciclável</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={tipoReciclavel}
              onValueChange={(value) => setTipoReciclavel(value)}
              style={styles.picker}
              dropdownIconColor="#000"
            >
              <Picker.Item label="Selecione" value="" />
              <Picker.Item label="Plástico" value="plastico" />
              <Picker.Item label="Vidro" value="vidro" />
              <Picker.Item label="Papel" value="papel" />
              <Picker.Item label="Metal" value="metal" />
              <Picker.Item label="Eletrônico" value="eletronico" />
            </Picker>
          </View>

          {/* DOAR POR */}
          <Text style={styles.label}>Doar por</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={tipoQuantidade}
              onValueChange={(value) => setTipoQuantidade(value)}
              style={styles.picker}
              dropdownIconColor="#000"
            >
              <Picker.Item label="Quilo (kg)" value="quilo" />
              <Picker.Item label="Unidade" value="unidade" />
            </Picker>
          </View>

          {/* QUANTIDADE */}
          <Text style={styles.label}>Quantidade</Text>
          <TextInput
            style={styles.textInput}
            keyboardType="numeric"
            placeholder={
              tipoQuantidade === "quilo"
                ? "Digite a quantidade em kg"
                : "Digite a quantidade em unidades"
            }
            value={quantidade}
            onChangeText={setQuantidade}
          />

          {/* LOCAL */}
          <Text style={styles.label}>Local da Lixeira</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={lixeira}
              onValueChange={(value) => setLixeira(value)}
              style={styles.picker}
              dropdownIconColor="#000"
            >
              <Picker.Item label="Selecione o ponto de coleta" value="" />
              <Picker.Item label="Escola Municipal Itarema" value="escola" />
              <Picker.Item label="Praça Central" value="praca" />
              <Picker.Item label="Mercado Público" value="mercado" />
              <Picker.Item label="Secretaria de Meio Ambiente" value="secretaria" />
              <Picker.Item label="Posto de Saúde" value="posto" />
            </Picker>
          </View>

        {/* BOTÕES */}
        <Pressable style={styles.button} onPress={lerQRCode}>
          <Text style={styles.buttonText}>📷 Ler QR Code</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={registrarDoacao}>
          <Text style={styles.buttonText}>Registrar Doação</Text>
        </Pressable>

        <Pressable style={styles.secondaryButton} onPress={() => router.back()}>
          <Text style={styles.buttonText}>⬅ Voltar</Text>
        </Pressable>
      </View>
    </View>
  );
}
