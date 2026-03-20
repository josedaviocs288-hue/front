import { Platform, StyleSheet } from "react-native";


export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    ...(Platform.OS !== "web" &&{
      marginTop: 16
    })
  },

  header: {
    backgroundColor: "#2e7d32",
    paddingVertical: 18,
    alignItems: "center"

  },

  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold"
  },

  top3: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 20,
    backgroundColor: "#e8f5e9"
  },

  topItem: {
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 12,
    width: 100,
    elevation: 3
  },

  top1: {
    marginTop: -15,
    borderWidth: 2,
    borderColor: "#fbc02d"
  },

  medalha: {
    fontSize: 28
  },

  nome: {
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
    marginTop: 5
  },

  pontos: {
    color: "#2e7d32",
    fontWeight: "bold",
    marginTop: 4
  },

  listaTitulo: {
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 16,
    marginBottom: 8
  },

  lista: {
    paddingHorizontal: 16,
    paddingBottom: 20
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2
  },

  posicao: {
    fontWeight: "bold",
    fontSize: 16,
    width: 40
  },

  cardNome: {
    flex: 1,
    fontSize: 15
  },

  cardPontos: {
    fontWeight: "bold",
    color: "#2e7d32"
  }
});
