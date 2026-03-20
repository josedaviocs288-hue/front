import { View, Text,  FlatList } from "react-native";
import { styles } from "@/src/styles/rankingStyles";
import { useEffect, useState } from "react";
import { getTopDoadores } from "@/src/services/rankingService";

export default function RankingScreen() {
  const [ranking, setRanking] = useState<{ id: number, nome: string, pontos: number }[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const list = await getTopDoadores(10, "kg");
        setRanking(list);
      } catch {}
    })();
  }, []);
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
        data={ranking}
        keyExtractor={(item) => item.id.toString()}
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
