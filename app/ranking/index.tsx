import { View, Text,  FlatList, Image } from "react-native";
import { styles } from "@/src/styles/rankingStyles";

const rankingMock = [
  { id: "1", nome: "Maria Silva", pontos: 1200 },
  { id: "2", nome: "João Pereira", pontos: 980 },
  { id: "3", nome: "Ana Costa", pontos: 850 },
  { id: "4", nome: "Carlos Lima", pontos: 700 },
  { id: "5", nome: "Fernanda Rocha", pontos: 650 }
];

export default function RankingScreen() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🏆 Ranking Ecoltarema</Text>
      </View>

      {/* Top 3 */}
      <View style={styles.top3}>
        <View style={styles.topItem}>
          <Text style={styles.medalha}>🥈</Text>
          <Text style={styles.nome}>João Pereira</Text>
          <Text style={styles.pontos}>980 pts</Text>
        </View>

        <View style={[styles.topItem, styles.top1]}>
          <Text style={styles.medalha}>🥇</Text>
          <Text style={styles.nome}>Maria Silva</Text>
          <Text style={styles.pontos}>1200 pts</Text>
        </View>

        <View style={styles.topItem}>
          <Text style={styles.medalha}>🥉</Text>
          <Text style={styles.nome}>Ana Costa</Text>
          <Text style={styles.pontos}>850 pts</Text>
        </View>
      </View>

      {/* Lista geral */}
      <Text style={styles.listaTitulo}>Classificação Geral</Text>

      <FlatList
        data={rankingMock}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        renderItem={({ item, index }) => (
          <View style={styles.card}>
            <Text style={styles.posicao}>{index + 1}º</Text>
            <Text style={styles.cardNome}>{item.nome}</Text>
            <Text style={styles.cardPontos}>{item.pontos} pts</Text>
          </View>
        )}
      />
    </View>
  );
}
