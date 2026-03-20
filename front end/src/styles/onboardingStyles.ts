import { Platform, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20
  },

  topo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Platform.OS !== "web" ? 18 : "auto"
  },

  logo: {
    flexDirection: "row",
    alignItems: "center"
  },

  logoIcon: {
    backgroundColor: "#1db954",
    color: "#fff",
    paddingHorizontal: Platform.OS !== "web" ? 7 : 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 6,
    fontSize: Platform.OS !== "web" ? 15 : 16
  },

  logoText: {
    fontSize: Platform.OS !== "web" ? 15 : 17,
    fontWeight: "700",
    color: "#1db954"
  },

  skip: {
    color: "#ff7a00",
    fontSize: Platform.OS !== "web" ? 15 : 16,
    fontWeight: "500"
  },

  conteudo: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20
  },

  image: {
    width: 220,
    height: 220,
    marginBottom: 32
  },

  titulo: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1db954",
    textAlign: "center",
    marginBottom: 16
  },

  descricao: {
    fontSize: 18,
    color: "#ff7a00",
    textAlign: "center",
    lineHeight: 26,
    maxWidth: 320
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    ...(Platform.OS !== "web" && {
      marginBottom: 22,
      paddingHorizontal: 6,
    }),
  },

  botao: {
    backgroundColor: "#1db954",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    ...(Platform.OS !== "web" && {
      elevation: 4,           
      shadowColor: "#000",    
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4
    }),
  },

  arrow: {
    fontSize: Platform.OS !== "web" ? 26 : 28,
    color: "#fff",
    fontWeight: "600"
  }
});
