  import { styles } from "@/src/styles/casaStyles";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { criarColetaCasa } from "@/src/services/coletaService";

  export default function DoacaoCasa() {
    const [tipoReciclavel, setTipoReciclavel] = useState("");
    const [tipoQuantidade, setTipoQuantidade] = useState("quilo");
    const [quantidade, setQuantidade] = useState("");
    const [localizacao, setLocalizacao] = useState("");

    async function registrarDoacao() {
      if (!tipoReciclavel || !tipoQuantidade || !quantidade || !localizacao) {
        Alert.alert("Erro", "Preencha todos os campos.");
        return;
      }

      try {
        await criarColetaCasa({
          tipoReciclavel,
          tipoQuantidade: tipoQuantidade as "quilo" | "unidade",
          quantidade,
          localizacao,
        });
        Alert.alert("Doação registrada", "Aguarde a confirmação do coletor.");
      } catch (e: any) {
        Alert.alert("Erro", (e?.message as string) || "Falha ao registrar doação.");
        return;
      }

      setTipoReciclavel("");
      setTipoQuantidade("quilo");
      setQuantidade("");
      setLocalizacao("");
    }

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <Text style={styles.title}>Doação em Casa</Text>

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
                <Picker.Item label="Plástico" value="Plástico" />
                <Picker.Item label="Vidro" value="Vidro" />
                <Picker.Item label="Papel" value="Papel" />
                <Picker.Item label="Metal" value="Metal" />
                <Picker.Item label="Eletrônico" value="Eletrônico" />
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

            {/* LOCALIZAÇÃO */}
            <Text style={styles.label}>Endereço / Localização</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Digite seu endereço ou bairro"
              value={localizacao}
              onChangeText={setLocalizacao}
            />

            {/* BOTÕES */}
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
