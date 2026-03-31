import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { styles } from "@/src/styles/avaliacaoStyles";
import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";

export default function Avaliacao() {
  const [nota, setNota] = useState<number>(0);
  const [comentario, setComentario] = useState("");

  async function enviarAvaliacao() {
    if (nota === 0) {
      Alert.alert("Atenção", "Selecione uma nota antes de enviar.");
      return;
    }

    try {
      const usuario = await AsyncStorage.getItem("@usuario");
      if (!usuario) {
        Alert.alert("Login necessário", "Faça login para enviar a avaliação.");
        return;
      }

      const avaliacoesSalvas = await AsyncStorage.getItem("@avaliacoes");
      const avaliacoes = avaliacoesSalvas
        ? JSON.parse(avaliacoesSalvas)
        : [];

      avaliacoes.push({
        nota,
        comentario,
        data: new Date().toISOString()
      });

      await AsyncStorage.setItem(
        "@avaliacoes",
        JSON.stringify(avaliacoes)
      );

      Alert.alert(
        "Obrigado!",
        "Sua avaliação foi enviada com sucesso."
      );

      router.back();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível enviar a avaliação.");
    }
  }

  return (
    <View style={styles.page}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>←</Text>
        </Pressable>
        <Text style={styles.topTitle}>Avaliação</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Avalie nosso aplicativo</Text>

        <Text style={styles.subtitle}>
          Sua opinião é muito importante! Avalie de 1 a 5 estrelas e
          deixe um comentário.
        </Text>

        {/* Estrelas */}
        <View style={styles.stars}>
          {[1, 2, 3, 4, 5].map((value) => (
            <Pressable
              key={value}
              onPress={() => setNota(value)}
            >
              <Text
                style={[
                  styles.star,
                  value <= nota && styles.starSelected
                ]}
              >
                ★
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Comentário */}
        <TextInput
          placeholder="Deixe seu comentário aqui..."
          style={styles.textarea}
          multiline
          value={comentario}
          onChangeText={setComentario}
        />

        {/* Botão */}
        <Pressable style={styles.button} onPress={enviarAvaliacao}>
          <Text style={styles.buttonText}>Enviar Avaliação</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
