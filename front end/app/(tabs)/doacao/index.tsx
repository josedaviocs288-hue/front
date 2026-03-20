import { styles } from "@/src/styles/doacaoStyles";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function EscolhaDoacao() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Escolha a forma de doação</Text>

      <View style={styles.opcoes}>
        <Pressable
          style={styles.button}
          onPress={() => router.push("/doacao/fixa")}
        >
          <Text style={styles.buttonText}>♻ Doação na lixeira</Text>
        </Pressable>

        <Pressable
          style={styles.button}
          onPress={() => router.push("/doacao/casa")}
        >
          <Text style={styles.buttonText}>🏠 Doação em Casa</Text>
        </Pressable>

        <Pressable
          style={[styles.button, styles.voltar]}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>⬅ Voltar</Text>
        </Pressable>
      </View>
    </View>
  );
}
