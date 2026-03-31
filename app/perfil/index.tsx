import { View, Text, Image, Pressable, TextInput, Alert } from "react-native";
import { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { styles } from "@/src/styles/perfilStyles"; 

export default function Perfil() {
  const [nome, setNome] = useState("");
  const [foto, setFoto] = useState<string | null>(null);

  /* 🔹 Carregar perfil salvo */
  useEffect(() => {
    carregarPerfil();
  }, []);

  async function carregarPerfil() {
    try {
      const data = await AsyncStorage.getItem("@usuario");
      if (data) {
        const user = JSON.parse(data);
        setNome(user.nome || "");
        setFoto(user.foto || null);
      }
    } catch (e) {
      console.log("Erro ao carregar perfil", e);
    }
  }

  /* 🔹 Escolher foto */
  async function escolherFoto() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permissão necessária", "Permita acesso à galeria.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      base64: true
    });

    if (!result.canceled) {
      const base64 = result.assets[0].base64;
      if (base64) {
        setFoto(`data:image/jpeg;base64,${base64}`);
      }
    }
  }

  /* 🔹 Salvar perfil */
  async function salvarPerfil() {
    if (!nome.trim()) {
      Alert.alert("Atenção", "Digite seu nome.");
      return;
    }

    try {
      await AsyncStorage.setItem(
        "@usuario",
        JSON.stringify({ nome, foto })
      );

      Alert.alert("Sucesso", "Perfil salvo com sucesso!");
      router.back();
    } catch {
      Alert.alert("Erro", "Não foi possível salvar.");
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Editar Perfil</Text>

        <Image
          source={
            foto
              ? { uri: foto }
              : { uri: "https://via.placeholder.com/140" }
          }
          style={styles.avatar}
        />

        <Pressable style={styles.photoButton} onPress={escolherFoto}>
          <Text style={styles.photoButtonText}>Escolher Foto</Text>
        </Pressable>

        <TextInput
          placeholder="Digite seu nome"
          value={nome}
          onChangeText={setNome}
          style={styles.input}
        />

        <Pressable style={styles.saveButton} onPress={salvarPerfil}>
          <Text style={styles.saveButtonText}>Salvar</Text>
        </Pressable>

        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </Pressable>
      </View>
    </View>
  );
}
